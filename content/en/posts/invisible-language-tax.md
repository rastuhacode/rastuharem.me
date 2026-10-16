---
title: "The invisible language tax"
description: "Or how to get less AI for more money"
date: "2026-10-17 00:00:00 UTC"
duration: "5 min"
---

# {{ title }}

<posts-date-duration :duration="duration" :date="date" class="-mt-6"></posts-date-duration>

> I compare Russian and English simply because those are the languages I know best. Similar effects exist across other language families, but their size depends on the model and tokenizer. You can find data for other languages in the sources linked throughout the article.

## Introduction

It's 2024. An office in Moscow. My fellow frontend developers and I are swapping tips and getting excited about how much faster we work with Cursor and Claude 3.5 Sonnet. Everyone has roughly the same tricks and prompts, but something stands out on my laptop - I talk to the model in English. _Why?_

At the time, I was practicing my English. Honestly, that was the main reason. But as I learned more about how LLMs work, I started to suspect that the choice of language mattered technically, too.

From experience, I know that many Russian-speaking developers, and plenty of others, still write prompts in their native language simply because **"it's easier."** In this post, I'll share numbers showing that they pay for that convenience **in both money and model intelligence**, and why they might as well forget about benchmark results from sites like [Artificial Analysis](https://artificialanalysis.ai/).

## First: intelligence

You're looking at a new model's benchmark results, excited that Opus 5.5 has gained [7 points](https://artificialanalysis.ai/?models=claude-opus-5-5%2Cclaude-opus-5#artificial-analysis-intelligence-index) over Opus 5. If you write your prompts in a language other than English, **that result is effectively meaningless for you**.

Take a look at this chart from the [MMLU-ProX](https://arxiv.org/html/2503.10497) benchmark:

<posts-image src="/images/llm-scores-per-language.jpg" alt="Best LLM scores on MMLU-ProX for each language, grouped by region" caption="Best LLM scores on MMLU-ProX for each language, grouped by region"></posts-image>

And here's the table from the same paper, which I've given a visual makeover and trimmed down to just English and Russian:

<posts-image src="/images/model-perfomance-on-mmlu.jpg" alt="Model performance on MMLU-ProX in English and Russian (%)" caption="Model performance on MMLU-ProX in English and Russian (%)"></posts-image>

To be fair, this research isn't new, and the models are relatively old. It's still the most recent study with this kind of comparison that I managed to find. Also, GPT-4o actually scored higher in Russian than in English.

So what can we take away from this?

- **Most models "understand" and "respond" better in English most of the time.** The gap varies from model to model, but the overall picture is worse for other languages.
- **Most benchmarks you see on Artificial Analysis are run in English.** When you write prompts in another language, you could theoretically get results no better, or even worse, than those of a previous-generation model. In other words, Opus 5.5 could theoretically be worse than Opus 5 for YOU. Most of the time, improvements will probably carry over proportionally, but the opposite can happen too. And the scariest part is that **you'll never know**.

Why does this happen? Here's the rough explanation:

- Models learn from data. The more data a model has, the more accurately it will answer, assuming you're comparing it with an otherwise similar model trained on less data. **There's simply more training data in English**, so the answers are more accurate.
- **Knowledge doesn't always transfer reliably between languages.** A correct answer in English doesn't guarantee a correct answer to the same question in Russian. You can read more about that [here](https://aclanthology.org/2024.naacl-long.339/).

## Second: the tax

Do you like taxes? Would it make your day if I told you that **every prompt in Russian costs 2.5 times as much on average**? Why?

Tokenizers. A prompt is split into tokens, which are then converted into vectors and processed by the model. Pricing usually comes down to two rates: the price per million input tokens and the price per million output tokens.

Here's the catch: these tokenizers are heavily optimized for English. The same sentence, expressed in different languages, can be split into different numbers of tokens even though the meaning is identical.

Take a look at this chart from a [2023 paper](https://aclanthology.org/2023.emnlp-main.614.pdf):

<posts-image src="/images/average-number-of-tokens-by-language.jpg" alt="Average number of tokens per FLORES sentence, grouped by writing system; numbers above the lines indicate the number of languages in each group" caption="Average number of tokens per FLORES sentence, grouped by writing system; numbers above the lines indicate the number of languages in each group"></posts-image>

Cyrillic takes more tokens than the Latin alphabet for the same prompt. Now remember what the bill is based on, and that the model replies in Cyrillic too. That means more tokens on both the input and output sides.

<posts-image src="/images/model-cost-relative-to-english.jpg" alt="Cost by language family relative to English" caption="Cost by language family relative to English"></posts-image>

That's the **invisible language tax**.

Again, to be fair, the study is pretty old: it dates back to 2023, all the way back to GPT-3.5. But remember, this part depends **on the tokenizer, not the model**. And judging by newer research, things have improved, but not by much.

For example, this [2026 paper](https://arxiv.org/abs/2609.39001) found that **French requires 31–58% more tokens than English**. Another [paper](https://arxiv.org/html/2601.13328) shows that after a tokenizer update, **Hindi's token overhead fell from 4.83× with GPT-3.5/4 to 1.59× with GPT-4o**.

And here's a recent [article](https://teletype.in/@khaskydev/non-english-prompts-cost-more-tokens) showing that **Opus 5 uses 200% more tokens in Russian** for prompts with the same meaning.

So what can we take away from this?

- **The same request costs more on average if you use any language other than English.** In other words, you burn through your subscription limits faster.
- Context windows are limited by token count. If Russian text takes more tokens, **less information fits in the same window**, and agents may need to compact their context sooner.

## Conclusion

For everyday tasks, you may never notice the difference. But if you work with agents and large contexts all the time, your choice of language deserves attention.

With the rise of AI, **knowing English has only become more important**. Code is already written using the Latin alphabet. All code comments **must** be in English because they go into the context. Documentation that an agent might use **must** be in English because it goes into the context. Your prompts **must** be in English too, because they create that context.

There's a chart called [Intelligence Index vs. Cost per Intelligence Index Task](https://artificialanalysis.ai/#intelligence-comparison-tabs) that many people use to pick models offering the best value for money. If you keep writing prompts in Russian, every time you look at it, mentally move your model's dot to the right and down, where things are more expensive and dumber. That will be your tax for "it's easier."

Use English, please.
