---
slug: "gpt-from-scratch"
lang: "en"
title: "Mini GPT from Scratch"
summary: "Educational PyTorch implementation of a mini GPT language model, from text cleaning and tokenization to causal attention, Transformer blocks, training, evaluation, and controlled text generation."
---

# Overview

## Project logic
This project builds a small GPT-style language model from the ground up.
The goal is not to create a general-purpose chatbot, but to understand the full next-token prediction pipeline in concrete terms.

The notebook starts from raw text and moves through the whole chain:
cleaning, tokenization, sequence construction, batching, embeddings, causal attention, Transformer blocks, training, evaluation, and generation.

The project is intentionally compact.
It makes visible what is usually hidden behind large language models: how text becomes tokens, how the model learns a distribution over the next token, and why causal attention prevents access to future positions.

- [v] I built a GPT end to end to understand its internal mechanics, not just to call an API.
- [v] I added a bigram baseline to compare the Transformer with a simple starting point.
- [!] The generated text remains the output of a small educational model trained on a compact corpus.

# Method

## Data and tokenization
The corpus is synthetic and original.
It mixes dialogues, short stories, procedures, reformulations, practical messages, summaries, and simple reasoning examples.

Two tokenization strategies are explored:
a character-level version with a small vocabulary, then a BPE version using `tiktoken`.
This comparison makes the trade-off between simplicity, vocabulary size, and sequence length explicit.

## Architecture and training
The project implements a complete autoregressive language-modeling workflow in `PyTorch`.
The core logic follows the classic path:

```text
text -> tokens -> sequences -> batches -> model -> logits -> loss -> gradients -> generation
```

The model includes token and position embeddings, causal self-attention, Transformer blocks, and a next-token prediction head.
The notebook compares a bigram baseline, a character-level mini GPT, and a larger final version.

Reported repository results show a strong improvement over the bigram baseline:
perplexity moves from about `9.51` for the baseline to `1.32` for the GPT, then around `1.25` for the final version.
Next-token accuracy moves from about `0.2917` to `0.9040`, then `0.9300`.

- [v] I made the workflow reproducible, following the core steps of language modeling.
- [v] The metrics show the gain over the baseline clearly (perplexity from 9.51 to 1.32).
- [!] The scores mostly measure local corpus learning, not general reasoning ability.

# Value

## What I wanted to show
I wanted to open the black box of language models and connect Transformer theory to a readable implementation: the shift between `x` and `y`, the causal mask, logits, cross-entropy, perplexity and generation. For me, GPT is not a keyword: it is a system I can rebuild, test and criticize.

## What I take from it
- [v] I rebuilt tokenization, causal attention and evaluation myself.
- [v] I connected Transformer theory to readable code.
- [!] This is a mini GPT from scratch, not a competitor to a general-purpose LLM.
