

import numpy as np
import os
import torch
from typing import Tuple, List

class Network(torch.nn.Module):
    """Abtract class to be inherited by the various critic and actor classes."""
    
    def __init__(self,
                 input_shape: Tuple, 
                 layer_neurons: int, 
                 network_name: str, 
                 checkpoint_directory_networks: str,
                 device: str = 'cpu',
                 ) -> None:
        
        
        super(Network, self).__init__()
        self.network_name = network_name
        self.checkpoint_directory_networks = checkpoint_directory_networks
        self.checkpoint_file_network = os.path.join(self.checkpoint_directory_networks, self.network_name)
         
        self.device = device
        
        self.input_shape = input_shape
        self.layer_neurons = layer_neurons
        
        if torch.cuda.device_count() > 1:
            self = torch.nn.DataParallel(self)  
        self.to(self.device)

    def forward(self, 
                *args,
                **kwargs,
                ) -> torch.tensor:

        raise NotImplementedError

    def save_network_weights(self) -> None:
        """Save checkpoint, used in training mode."""
        
        torch.save(self.state_dict(), self.checkpoint_file_network)
        
    def load_network_weights(self) -> None:
        """Load checkpoint, used in testing mode."""
        self.load_state_dict(torch.load(self.checkpoint_file_network, map_location=self.device))
        
class Critic(Network):
    """Define a critic network, whose role is to attribute a value to a (state, action) pair."""
    
    def __init__(self, 
                 lr_Q: float, 
                 action_space_dimension: Tuple, 
                 *args, 
                 **kwargs,
                 ) -> None:
        
        
        super(Critic, self).__init__(*args, **kwargs)
        self.action_space_dimension = action_space_dimension
        
        self.layer1 = torch.nn.Linear(self.input_shape[0] + action_space_dimension, self.layer_neurons)
        self.layer2 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.Q = torch.nn.Linear(self.layer_neurons, 1)
        
        self.optimizer = torch.optim.Adam(self.parameters(), lr=lr_Q)
            
    def forward(self, 
                state: np.ndarray, 
                action: np.ndarray,
                ) -> torch.tensor:
        
        
        x = self.layer1(torch.cat([state, action], dim=1))
        x = torch.nn.functional.relu(x)
        x = self.layer2(x)
        x = torch.nn.functional.relu(x)
        action_value = self.Q(x)
        
        return action_value
       
class Actor(Network):
    """Define a stochastic (Gaussian) actor, taking actions in a continous action space."""
    
    def __init__(self, 
                 lr_pi: float, 
                 max_actions: np.ndarray, 
                 action_space_dimension: Tuple, 
                 log_sigma_min: float = -20.0, 
                 log_sigma_max: float = 2.0,
                 *args,
                 **kwargs,
                 ) -> None:
        
        
        super(Actor, self).__init__(*args, **kwargs)
        self.action_space_dimension = action_space_dimension
        self.max_actions = max_actions
        self.noise = 1e-6
        
        self.layer1 = torch.nn.Linear(*self.input_shape, self.layer_neurons)
        self.layer2 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.mu = torch.nn.Linear(self.layer_neurons, self.action_space_dimension)
        self.log_sigma = torch.nn.Linear(self.layer_neurons, self.action_space_dimension)
        
        self.log_sigma_min = log_sigma_min
        self.log_sigma_max = log_sigma_max
        
        self.optimizer = torch.optim.Adam(self.parameters(), lr=lr_pi)
        
    def forward(self, 
                state: np.ndarray,
                ) -> List[torch.tensor]:
        
        
        x = self.layer1(state)
        x = torch.nn.functional.gelu(x)
        x = self.layer2(x)
        x = torch.nn.functional.gelu(x)
           
        mu = self.mu(x)

        log_sigma = self.log_sigma(x)
        log_sigma = torch.clamp(log_sigma, min=self.log_sigma_min, max=self.log_sigma_max)       
        sigma = log_sigma.exp()
        
        return mu, sigma
    
    def sample(self, 
               state: np.ndarray, 
               reparameterize: bool = True,
               ) -> Tuple[torch.tensor]:
        
        
        mu, sigma = self.forward(state)
        
        normal = torch.distributions.Normal(mu, sigma)

        if reparameterize:
            actions = normal.rsample()
        else:
            actions = normal.sample()
            
        action = torch.tanh(actions) * torch.tensor(self.max_actions).to(self.device)
        log_probabilities = normal.log_prob(actions)
        log_probabilities -= torch.log(1-action.pow(2) + self.noise)
        log_probabilities = log_probabilities.sum(1, keepdim=True)
        
        return action, log_probabilities
    
        
class Value(Network):
    
    
    def __init__(self, 
                 lr_Q: float, 
                 *args,
                 **kwargs,
                 ) -> None:
        
        
        super(Value, self).__init__(*args, **kwargs)        
        self.layer1 = torch.nn.Linear(*self.input_shape, self.layer_neurons)
        self.layer2 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.V = torch.nn.Linear(self.layer_neurons, 1)
        
        self.optimizer = torch.optim.Adam(self.parameters(), lr=lr_Q)
        
    def forward(self, 
                state: np.ndarray,
                ) -> torch.tensor:
        
        
        x = self.layer1(state)
        x = torch.nn.functional.relu(x)
        x = self.layer2(x)
        x = torch.nn.functional.relu(x)
        
        value = self.V(x)
        return value
         
class Distributional_Critic(Network):
    
    
    def __init__(self, 
                 lr_Q: float, 
                 action_space_dimension: Tuple, 
                 log_sigma_min: float = -0.1, 
                 log_sigma_max: float = 5.0,
                 *args,
                 **kwargs,
                 ) -> None:
        
        
        super(Distributional_Critic, self).__init__(*args, **kwargs)
        self.linear1 = torch.nn.Linear(self.input_shape[0] + action_space_dimension, self.layer_neurons)
        self.linear2 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.linear3 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.linear_mu_1 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.linear_mu_2 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.linear_mu_3 = torch.nn.Linear(self.layer_neurons, 1)
        self.linear_log_sigma_1 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.linear_log_sigma_2 = torch.nn.Linear(self.layer_neurons, self.layer_neurons)
        self.linear_log_sigma_3 = torch.nn.Linear(self.layer_neurons, 1)
        
        self.log_sigma_min = log_sigma_min
        self.log_sigma_max = log_sigma_max
        self.denominator = max(abs(self.log_sigma_min), self.log_sigma_max)
        
        self.optimizer = torch.optim.Adam(self.parameters(), lr=lr_Q)

    def forward(self, 
                state: List[float], 
                action: np.ndarray,
                ) -> Tuple[torch.Tensor]:
        
        
        x = self.linear1(torch.cat([state, action], dim=1))
        x = torch.nn.functional.gelu(x)
        x = self.linear2(x)
        x = torch.nn.functional.gelu(x)
        x = self.linear3(x)
        x = torch.nn.functional.gelu(x)
        
        mu = self.linear_mu_1(x)
        mu = torch.nn.functional.gelu(mu)
        mu = self.linear_mu_2(mu)
        mu = torch.nn.functional.gelu(mu)
        mu = self.linear_mu_3(mu)

        log_sigma = self.linear_log_sigma_1(x)
        log_sigma = torch.nn.functional.gelu(log_sigma)
        log_sigma = self.linear_log_sigma_2(log_sigma)
        log_sigma = torch.nn.functional.gelu(log_sigma)
        log_sigma = self.linear_log_sigma_3(log_sigma)

        log_sigma = torch.clamp(log_sigma, min=self.log_sigma_min, max=self.log_sigma_max)
        sigma = log_sigma.exp()

        return mu, sigma

    def sample(self, 
               state: List[float], 
               action: np.ndarray,
               reparameterize: bool = True,
               ) -> torch.Tensor:
        
        
        mu, sigma = self.forward(state, action)
                
        normal = torch.distributions.Normal(mu, sigma)
        
        if reparameterize:
            q = normal.rsample()
        else:
            q = normal.sample()
        
        return q, mu, sigma
