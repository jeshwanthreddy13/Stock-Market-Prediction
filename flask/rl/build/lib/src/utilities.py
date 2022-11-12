

from datetime import datetime
import gym
import itertools
import json
import matplotlib.pyplot as plt
import numpy as np
import os
import pandas as pd
from pathlib import Path
import pickle
import seaborn as sns
sns.set_theme()
from sklearn.preprocessing import StandardScaler
from typing import List, Union
 
def create_directory_tree(mode: str,experimental: bool,checkpoint_directory: str):

    if experimental:
        checkpoint_directory = os.path.join("saved_outputs", "experimental")
    else:
        checkpoint_directory = os.path.join("rl//saved_outputs", "last_output") if mode=='train' else checkpoint_directory
    
    # Create various subdirectories
    checkpoint_directory_networks = os.path.join(checkpoint_directory, "networks")
    checkpoint_directory_logs = os.path.join(checkpoint_directory, "logs")
    checkpoint_directory_plots = os.path.join(checkpoint_directory, "plots")
    Path(checkpoint_directory_networks).mkdir(parents=True, exist_ok=True)
    Path(checkpoint_directory_logs).mkdir(parents=True, exist_ok=True)
    Path(checkpoint_directory_plots).mkdir(parents=True, exist_ok=True)
    # write the checkpoint directory name in a file for quick access when testing
    if mode == 'train':
        print(mode=='train')
        with open(os.path.join(checkpoint_directory, "checkpoint_directory.txt"), "w") as f:
            f.write(checkpoint_directory) 
    return checkpoint_directory

def plot_reward(x: List[int], 
                rewards: np.ndarray, 
                figure_file: str, 
                mode: str,
                bins: int = 20,
                ) -> None:
    
    
    running_average = np.zeros(len(rewards))
    for i in range(len(running_average)):
        running_average[i] = np.mean(rewards[max(0, i-50): i+1])
        
    if mode == 'train':
        plt.plot(x, rewards, linestyle='-', color='blue', label='reward')
        plt.plot(x, running_average, linestyle='--', color='green', label='running average 50')
        plt.legend()
        plt.title('Reward as a function of the epoch/episode')
        
    elif mode == 'test':
        plt.hist(rewards, bins=bins)
        plt.title('Reward distribution')
    
    plt.savefig(figure_file) 
    
def plot_portfolio_value(x: List[int], 
                         values: np.ndarray, 
                         figure_file: str, 
                         ) -> None:
    
    plt.plot(x, values.T, linestyle='-', linewidth=0.5)
    plt.xlim((0, len(x)))
    plt.title('Portfolio value')
    plt.savefig(figure_file) 
        
def instanciate_scaler(env: gym.Env,
                       mode: str,
                       checkpoint_directory: str) -> StandardScaler:
    
    
    scaler = StandardScaler()
    
    if mode == 'train':
        
        observations = []
        for _ in range(10):
            observation = env.reset()
            observations.append(observation)
            done = False
            while not done:
                action = env.action_space.sample()
                observation_, _, done, _ = env.step(action)
                observations.append(observation_)

        scaler.fit(observations)
        with open(os.path.join(checkpoint_directory, 'networks', 'scaler.pkl'), 'wb') as f:
            pickle.dump(scaler, f)
    
    if mode == 'test':
        with open(os.path.join(checkpoint_directory, 'networks', 'scaler.pkl'), 'rb') as f:
            scaler = pickle.load(f)
    
    return scaler

def prepare_initial_portfolio(initial_portfolio: Union[int, float, str],
                              tickers: List[str]) -> dict:
    
    
    print('>>>>> Reading the provided initial portfolio <<<<<')
    
    if isinstance(initial_portfolio, int) or isinstance(initial_portfolio, float):
        initial_portfolio_returned = {key: 0 for key in tickers}
        initial_portfolio_returned["Bank_account"] = initial_portfolio
    
    else:
        with open(initial_portfolio, "r") as file:
            initial_portfolio = json.load(file)
            
        initial_portfolio_returned = {key: 0 for key in tickers}
        initial_portfolio_returned["Bank_account"] = initial_portfolio["Bank_account"]
        
        for key in initial_portfolio_returned.keys():
            if key in initial_portfolio.keys():
                initial_portfolio_returned[key] = initial_portfolio[key]
            
    return initial_portfolio_returned

def append_corr_matrix(df: pd.DataFrame,
                       window: int,
                       ) -> pd.DataFrame:
    

    print('>>>>> Appending the correlation matrix <<<<<')

    columns = ['{}/{}'.format(m, n) for (m, n) in itertools.combinations_with_replacement(df.columns, r=2)]
    corr = df.rolling(window).cov()
    corr_flattened = pd.DataFrame(index=columns).transpose()

    for i in range(df.shape[0]):

        ind = np.triu_indices(df.shape[1])
        data = corr[df.shape[1]*i : df.shape[1]*(i+1)].to_numpy()[ind]
        index = [corr.index[df.shape[1]*i][0]]

        temp = pd.DataFrame(data=data, columns=index, index=columns).transpose()
        corr_flattened = pd.concat([corr_flattened, temp])

    return pd.concat([df, corr_flattened], axis=1).iloc[window-1 : ]

def append_corr_matrix_eigenvalues(df: pd.DataFrame,
                                   window: int,
                                   number_of_eigenvalues: int = 10
                                   ) -> pd.DataFrame:
    
    
    print('>>>>> Appending the eigenvalues <<<<<')
    
    if number_of_eigenvalues > df.shape[1]:
        number_of_eigenvalues = df.shape[1]
    
    columns = ['Eigenvalue_{}'.format(m+1) for m in range(number_of_eigenvalues)]
    corr = df.rolling(window).cov()
    corr_eigenvalues = pd.DataFrame(index=columns).transpose()

    for i in range(window-1, df.shape[0]):
        data = corr[df.shape[1]*i : df.shape[1]*(i+1)].to_numpy()
        data = np.linalg.eig(data)
        data = data[0].real
        data[::-1].sort()
        data = data[:number_of_eigenvalues]

        index = [corr.index[df.shape[1]*i][0]]
        temp = pd.DataFrame(data=data, columns=index, index=columns).transpose()
        corr_eigenvalues = pd.concat([corr_eigenvalues, temp])

    print('>>>>> Eigenvalues have been appended <<<<<')

    return pd.concat([df.iloc[window-1 : ], corr_eigenvalues], axis=1)