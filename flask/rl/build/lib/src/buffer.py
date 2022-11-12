
import numpy as np
from typing import Tuple, List

class ReplayBuffer():
    """Plays the role of memory for the Agents, by storing (state, action, reward, state_, done) tuples"""
    
    def __init__(self, 
                 size: int, 
                 input_shape: Tuple, 
                 action_space_dimension: int,
                 ) -> None:
        
        
        self.size = size
        self.pointer = 0
        
        self.state_buffer = np.zeros((self.size, *input_shape))
        self.new_state_buffer = np.zeros((self.size, *input_shape))
        self.action_buffer = np.zeros((self.size, action_space_dimension))
        self.reward_buffer = np.zeros(self.size)
        self.done_buffer = np.zeros(self.size, dtype=np.bool)
        
    def push(self, 
             state: np.ndarray, 
             action: np.ndarray, 
             reward: float, 
             new_state: np.ndarray, 
             done: bool,
             ) -> None:
        
        
        index = self.pointer % self.size
        self.state_buffer[index] = state
        self.action_buffer[index] = action
        self.reward_buffer[index] = reward
        self.new_state_buffer[index] = new_state
        self.done_buffer[index] = done
        
        self.pointer += 1
        
    def sample(self, 
               batch_size: int = 32,
               ) -> Tuple[np.ndarray, np.array, np.array, np.array, np.array]:
        
        
        size = min(self.pointer, self.size)
        batch = np.random.choice(size, batch_size)
        
        states = self.state_buffer[batch]
        actions = self.action_buffer[batch]
        rewards = self.reward_buffer[batch]
        new_states = self.new_state_buffer[batch]
        dones = self.done_buffer[batch]
        
        return states, actions, rewards, new_states, dones