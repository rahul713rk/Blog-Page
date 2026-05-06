# Chapter 19: Sequence Models

## 1. Chapter Overview
The world isn't just static images; it's a stream of events. This chapter explores **Recurrent Neural Networks (RNNs)**, the models designed to handle sequential data like text, speech, and stock prices. We dive into the "Memory" of the network and explore how **LSTMs** and **GRUs** solve the problem of long-term forgetting.

## 2. Why This Topic Matters
Language is sequential—the meaning of the word "bank" depends on whether you previously said "sloped" (river bank) or "money" (financial bank). Standard neural networks treat words as independent, but sequence models understand **Context**. They power Siri, Alexa, and the predictive text on your phone.

## 3. Real-World Applications
- **Speech Recognition**: Turning live audio waves into text in real-time.
- **Stock Forecasting**: Predicting tomorrow's price based on the last 100 days of history.
- **Sentiment Analysis**: Understanding if a movie review is positive or negative by reading the whole sentence.

## 4. Core Intuition
An RNN is a **Neural Network with a Loop**. 
- Unlike a standard network that takes an input and gives an output, an RNN takes an input *and its previous memory* (Hidden State) to give an output. 
- It's like reading a book: as you read a new word, you keep the memory of the previous sentence in your head.

## 5. Beginner-Friendly Explanation
### Explain Like I Am New
Imagine you are watching a movie. 
- If you only look at one frame at a time, you see a person standing.
- If you remember the *previous* frames, you know the person is actually mid-jump and about to land.
An RNN is a network that doesn't just see the "Frame"; it remembers the "Movie." It carries a small backpack (the Hidden State) where it puts important information from the past to use in the future.

## 6. Technical Foundations
- **Hidden State ($h_t$)**: The mathematical representation of the network's "memory" at time $t$.
- **Timesteps**: Each word or data point in the sequence.
- **Unrolling**: Representing the loop as a long line of connected networks for training.
- **Many-to-One**: Reading a sentence and giving one output (Sentiment).
- **Many-to-Many**: Reading English and outputting French (Translation).

## 7. Mathematical Foundations
- **The RNN Equation**: $h_t = \text{tanh}(W_{hh}h_{t-1} + W_{xh}x_t + b_h)$.
- **LSTMs (Long Short-Term Memory)**: Adding three "Gates" (Forget, Input, Output) that allow the math to "protect" important memories from being overwritten.
- **Vanishing Gradient in Sequences**: Why simple RNNs forget the beginning of a sentence by the time they reach the end.

## 8. Step-by-Step Workflow
1. **Tokenize**: Turn words into numbers.
2. **Embed**: Convert those numbers into dense vectors (Word Embeddings).
3. **Pass through RNN/LSTM**: Let the model process the sequence one step at a time.
4. **Collect Output**: Use the final hidden state to make a prediction.
5. **Backpropagate through Time (BPTT)**: How the model learns to remember better.

## 9. Algorithms and Architectures
We introduce the **Encoder-Decoder Architecture**. One RNN (the Encoder) reads the input and compresses it into a "Context Vector," and another RNN (the Decoder) takes that vector and starts writing the output. This is the basis for all early machine translation systems.

## 10. Visual Explanation
```mermaid
graph LR
    X0[Word 1] --> H0[Memory 1]
    X1[Word 2] --> H1[Memory 2]
    X2[Word 3] --> H2[Memory 3]
    H0 --> H1
    H1 --> H2
    H2 --> O[Final Prediction]
    O -- Error -- BPTT --> H2
    H2 -- Error -- BPTT --> H1
    H1 -- Error -- BPTT --> H0
```

## 11. Code Implementation
Defining an LSTM classifier in PyTorch:

```python
import torch.nn as nn

class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size, embed_dim, hidden_dim):
        super(SentimentLSTM, self).__init__()
        self.embedding = nn.Embedding(vocab_size, embed_dim)
        self.lstm = nn.LSTM(embed_dim, hidden_dim, batch_first=True)
        self.fc = nn.Linear(hidden_dim, 1) # Positive or Negative

    def forward(self, x):
        embedded = self.embedding(x)
        output, (hidden, cell) = self.lstm(embedded)
        # Use only the last hidden state
        return self.fc(hidden[-1])

model = SentimentLSTM(vocab_size=1000, embed_dim=64, hidden_dim=128)
print(model)
```

## 12. Optimization Techniques
- **Gradient Clipping**: If the math "explodes" (gradients become too large), we literally cut them off at a maximum value to keep training stable.
- **Bidirectional RNNs**: Reading the sentence both forwards and backwards to get even more context.

## 13. Common Mistakes
- **Assuming fixed length**: Sequences vary. We use **Padding** and **Packing** to handle a 5-word sentence and a 50-word sentence in the same batch.
- **Using simple RNNs for long text**: They will forget everything from the first half of the page. Always use LSTM or GRU.

## 14. Debugging Guide
1. If the model repeats the same word over and over, your learning rate is likely stuck in a "local minimum" or your vocabulary is too small.
2. Check if the hidden state is "saturating" (all values becoming 1 or -1).

## 15. Performance Considerations
RNNs are slow because they are **Sequential**. You cannot calculate the 10th word until you have finished the 9th. This makes them difficult to speed up on GPUs compared to CNNs.

## 16. Research Evolution
RNNs were developed in the 1980s. **Sepp Hochreiter and Jürgen Schmidhuber** invented the LSTM in 1997, which solved the "forgetting" problem. Sequence models dominated AI until 2017, when the "Attention" mechanism began to replace them.

## 17. Industry Case Study
**Google Translate (2016)**: Google switched from "phrase-based" translation to **Neural Machine Translation (GNMT)** using massive stacks of LSTMs. This resulted in the single largest jump in translation quality in history.

## 18. Hands-On Exercise
- [ ] Create a sequence of 5 numbers representing a sine wave.
- [ ] Use an RNN to predict the 6th number.
- [ ] Diagram the flow of information through an LSTM cell.

## 19. Mini Project
**The Shakespeare Bot**: Train a small LSTM on a few plays of Shakespeare. Character by character, let the model try to predict the next letter and watch it slowly learn to spell and write in an "old English" style.

## 20. Interview Questions
1. Why do we use "Backpropagation Through Time" (BPTT)?
2. What is the "Vanishing Gradient Problem" in RNNs?
3. What are the three gates in an LSTM?

## 21. Summary
Sequence models allow AI to understand the flow of time and language. While they are being supplemented by Transformers, understanding RNNs and LSTMs is vital for mastering the history and logic of sequential intelligence.

## 22. Further Reading
- [The Unreasonable Effectiveness of Recurrent Neural Networks (Andrej Karpathy)](http://karpathy.github.io/2015/05/21/rnn-effectiveness/)
- *Deep Learning with PyTorch* by Eli Stevens.

## 23. Research Papers
- *Long Short-Term Memory* (Hochreiter & Schmidhuber, 1997).

## 24. Key Takeaways
- Sequence model = Hidden State (Memory).
- LSTM/GRU > Simple RNN.
- Many-to-one vs Many-to-many.
- Context is everything.
