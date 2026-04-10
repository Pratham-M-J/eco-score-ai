import torch
import torch.nn as nn

class EcoScoreModel(nn.Module):
    def __init__(self, input_features):
        super(EcoScoreModel, self).__init__()
        self.layer1 = nn.Linear(input_features, 64)
        self.layer2 = nn.Linear(64, 32)
        self.output_layer = nn.Linear(32,2)
        self.relu = nn.ReLU()
    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.relu(self.layer2(x))
        x = self.output_layer(x)
        return x

