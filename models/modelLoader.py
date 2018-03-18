import re
import random
import time
import sys
# print('Library versions:')

import keras
# print(f'keras:{keras.__version__}')
#import pandas as pd
#print(f'pandas:{pd.__version__}')
import sklearn
# print(f'sklearn:{sklearn.__version__}')
import nltk
# print(f'nltk:{nltk.__version__}')
import numpy as np
# print(f'numpy:{np.__version__}')

from sklearn.feature_extraction.text import CountVectorizer
from nltk.tokenize import casual_tokenize

#from tqdm import tqdm_notebook as tqdm # Special jupyter notebook progress bar 💫
MAX_VOCAB_SIZE = 394
# seq2seq generally relies on fixed length message vectors - longer messages provide more info
# but result in slower training and larger networks
MAX_MESSAGE_LEN = 20 
# Embedding size for words - gives a trade off between expressivity of words and network size
EMBEDDING_SIZE = 100
# Embedding size for whole messages, same trade off as word embeddings
CONTEXT_SIZE = 100
# Larger batch sizes generally reach the average response faster, but small batch sizes are
# required for the model to learn nuanced responses.  Also, GPU memory limits max batch size.
BATCH_SIZE = 100
# Helps regularize network and prevent overfitting.
DROPOUT = 0.2
# High learning rate helps model reach average response faster, but can make it hard to 
# converge on nuanced responses
LEARNING_RATE=0.005

# Tokens needed for seq2seq
UNK = 1  # words that aren't found in the vocab
PAD = 0  # after message has finished, this fills all remaining vector positions
START = 2  # provided to the model at position 0 for every response predicted

# Implementaiton detail for allowing this to be run in Kaggle's notebook hardware
SUB_BATCH_SIZE = 100


import pickle

with open('C:\\Users\\teler\\Desktop\\HackTues30x\\data\\embeddings.pkl', 'rb') as fp:
    our_embedding , idx2word , word2idx = pickle.load(fp)

word2idx['__unk__'] = UNK
word2idx['__pad__'] = PAD
word2idx['__start__'] = START

idx2word[UNK] = '__unk__'
idx2word[PAD] = '__pad__'
idx2word[START] =  '__start__'

with open('C:\\Users\\teler\\Desktop\\HackTues30x\\data\\xy.pkl', 'rb') as fp:
    x, y = pickle.load(fp)

x, y = np.array(x), np.array(y)

import re
def pretokenize(sentence):
    chars = r'([\.\'"])'
    return re.sub(chars, r' \1 ', sentence)


def to_word_idx(sentence):
    full_length = [word2idx[word.lower()] if word.lower() in word2idx else 1 for word in nltk.word_tokenize(pretokenize(sentence))] + [0] * 20
    return full_length[:20]

def from_word_idx(word_idxs):
    return ' '.join(idx2word[idx] for idx in word_idxs if idx != PAD).strip()


all_idx = list(range(len(x)))
train_idx = set(random.sample(all_idx, int(0.8 * len(all_idx))))
test_idx = {idx for idx in all_idx if idx not in train_idx}

train_x = x[:]#[list(train_idx)]
test_x = x[:]#[list(test_idx)]
train_y = y[:]#[list(train_idx)]
test_y = y[:]#[list(test_idx)]

assert train_x.shape == train_y.shape
assert test_x.shape == test_y.shape

from keras.utils import np_utils

def add_start_token(y_array):
    """ Adds the start token to vectors.  Used for training data. """
    return np.hstack([
        START * np.ones((len(y_array), 1)),
        y_array[:, :-1],
    ])

def binarize_labels(labels):
    """ Helper function that turns integer word indexes into sparse binary matrices for 
        the expected model output.
    """
    return np.array([np_utils.to_categorical(row, num_classes=MAX_VOCAB_SIZE)
                     for row in labels])

def respond_to(model, text):
    """ Helper function that takes a text input and provides a text output. """
    input_y = add_start_token(PAD * np.ones((1, MAX_MESSAGE_LEN)))
    idxs = np.array(to_word_idx(text)).reshape((1, MAX_MESSAGE_LEN))
    for position in range(MAX_MESSAGE_LEN - 1):
        prediction = model.predict([idxs, input_y]).argmax(axis=2)[0]
        input_y[:,position + 1] = prediction[position]
    return from_word_idx(model.predict([idxs, input_y]).argmax(axis=2)[0])

from keras.models import load_model
s2s = load_model("C:\\Users\\teler\\Desktop\\HackTues30x\\models\\s2s.h5")

print(respond_to(s2s, sys.argv[2]))
sys.stdout.flush()