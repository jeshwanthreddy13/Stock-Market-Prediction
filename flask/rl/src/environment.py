

import gym
import numpy as np
import pandas as pd
from typing import Tuple

from src.utilities import append_corr_matrix, append_corr_matrix_eigenvalues
class Environment(gym.Env):
    

    def __init__(self, 
                 stock_market_history: pd.DataFrame,                
                 initial_portfolio: dict,
                 buy_cost: float = 0.001,
                 sell_cost: float = 0.001,
                 bank_rate: float = 0.5,
                 limit_n_stocks: float = 200,
                 buy_rule: str = 'most_first',
                 use_corr_matrix: bool = False,
                 use_corr_eigenvalues: bool = False,
                 window: int = 20,
                 number_of_eigenvalues: int = 10,
                 ) -> None:
        
        
        super(Environment, self).__init__()
        
        # attributes related to the financial time series
        self.stock_market_history = stock_market_history
        self.assets_list = self.stock_market_history.columns
        self.stock_space_dimension = stock_market_history.shape[1]
        
        # if asked, append the sliding correlation matrix of the time series
        if use_corr_matrix:
            self.stock_market_history = append_corr_matrix(df=self.stock_market_history,
                                                           window=window)
            
        # if asked, append the eigenvalues of the sliding correlation matrix of the time series
        elif use_corr_eigenvalues:
            self.stock_market_history = append_corr_matrix_eigenvalues(df=self.stock_market_history,
                                                                       window=window,
                                                                       number_of_eigenvalues = number_of_eigenvalues)
        
        # We define the time horizon after appending the correlation matrix or its eigenvalues because 
        # the definition of the sliding correlation matrix forces to get rid of a few time points
        self.time_horizon = self.stock_market_history.shape[0]
        
        # defining the observation and action space, once all preprocessing has been done
        self.observation_space_dimension = 1 + self.stock_space_dimension + self.stock_market_history.shape[1]
        self.action_space_dimension = self.stock_space_dimension
        self.observation_space = gym.spaces.Box(low=-np.inf, high=np.inf, shape=(self.observation_space_dimension,))
        self.action_space = gym.spaces.Box(low=-1, high=1, shape=(self.action_space_dimension,)) 
        
        # maximal amount of share one can buy or sell in one trade
        self.limit_n_stocks = limit_n_stocks
        
        # attributes related to buying, selling, and bank interest rate
        self.buy_rule = buy_rule
        self.buy_cost = buy_cost
        self.sell_cost = sell_cost
        self.daily_bank_rate = pow(1 + bank_rate, 1 / 365) - 1
        
        self.initial_portfolio = initial_portfolio
        
        # initializing the state of the environment
        self.current_step = None
        self.cash_in_bank = None
        self.stock_prices = None
        self.number_of_shares = None
        self.reset()
    
    def reset(self) -> np.array:  
        
        
        self.current_step = 0
        self.cash_in_bank = self.initial_portfolio["Bank_account"]
        self.stock_prices = self.stock_market_history.iloc[self.current_step]
        self.number_of_shares = np.array([self.initial_portfolio[ticker] for ticker in self.stock_market_history.columns[:self.action_space_dimension]])
        
        return self._get_observation()
        
    def step(self, 
             actions: np.ndarray,
             ) -> Tuple[np.ndarray, float, bool, dict]:
        
         
        self.current_step += 1      
        initial_value_portfolio = self._get_portfolio_value()
        self.stock_prices = self.stock_market_history.iloc[self.current_step] 
        
        self._trade(actions)
        
        self.cash_in_bank *= 1 + self.daily_bank_rate # should this line be before the trade?       
        new_value_portfolio = self._get_portfolio_value()
        done = self.current_step == (self.time_horizon - 1)
        info = {'value_portfolio': new_value_portfolio}
        
        reward = new_value_portfolio - initial_value_portfolio 
           
        return self._get_observation(), reward, done, info
       
    def _trade(self, 
               actions: np.ndarray,
               ) -> None:
        
        
        actions = (actions * self.limit_n_stocks).astype(int)
        sorted_indices = np.argsort(actions)
        
        sell_idx = sorted_indices[ : np.where(actions<0)[0].size]
        buy_idx = sorted_indices[::-1][ : np.where(actions>0)[0].size]

        for idx in sell_idx:  
            self._sell(idx, actions[idx])
        
        if self.buy_rule == 'most_first':
            for idx in buy_idx: 
                self._buy(idx, actions[idx])
                
        if self.buy_rule == 'cyclic':
            should_buy = np.copy(actions[buy_idx])
            i = 0
            while self.cash_in_bank > 0 and not np.all((should_buy == 0)):
                if should_buy[i] > 0:
                    self._buy(buy_idx[i])
                    should_buy[i] -= 1
                i = (i + 1) % len(buy_idx) 
                
        if self.buy_rule == 'random':
            should_buy = np.copy(actions[buy_idx])
            while self.cash_in_bank > 0 and not np.all((should_buy == 0)):
                i = np.random.choice(np.where(should_buy > 0))
                self._buy(buy_idx[i])
                should_buy[i] -= 1
        
    def _sell(self, 
              idx: int, 
              action: int,
              ) -> None:
        
    
        if int(self.number_of_shares[idx]) < 1:
            return
         
        n_stocks_to_sell = min(-action, int(self.number_of_shares[idx]))
        money_inflow = n_stocks_to_sell * self.stock_prices[idx] * (1 - self.sell_cost)
        self.cash_in_bank += money_inflow
        self.number_of_shares[idx] -= n_stocks_to_sell
            
    def _buy(self, 
             idx: int, 
             action: int = 1,
             ) -> None:
        
        
        if self.cash_in_bank < 0:
            return
        
        n_stocks_to_buy = min(action, self.cash_in_bank // self.stock_prices[idx])
        money_outflow = n_stocks_to_buy * self.stock_prices[idx] * (1 + self.buy_cost)
        self.cash_in_bank -= money_outflow
        self.number_of_shares[idx] += n_stocks_to_buy   
        
    def _get_observation(self) -> np.array:
        
        
        observation = np.empty(self.observation_space_dimension)
        observation[0] = self.cash_in_bank
        observation[1 : self.stock_prices.shape[0]+1] = self.stock_prices
        observation[self.stock_prices.shape[0]+1 : ] = self.number_of_shares
        
        return observation
    
    def _get_portfolio_value(self) -> float:
        
        
        portfolio_value = self.cash_in_bank + self.number_of_shares.dot(self.stock_prices[:self.stock_space_dimension])
        return portfolio_value
