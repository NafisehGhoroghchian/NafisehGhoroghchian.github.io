---
title: 'Starting a notebook in public'
description: 'Why this site exists, and what I plan to write here about agentic systems and evaluation.'
date: 2026-11-14
tags: ['meta', 'evaluation']
draft: false
---

This is a placeholder post — replace it. It exists so the blog layout, the code
block styling, and the math rendering all have something to render.

## What I plan to write about

Mostly the unglamorous half of building agentic LLM systems: how you decide an
agent is actually better, not just more confident. Benchmark design, leakage,
user simulation, and the gap between an offline eval number and a system people
trust in production.

## Code renders like this

```python
def clarify_or_answer(state: AgentState, threshold: float = 0.6) -> Action:
    """Ask a clarifying question only when ambiguity is worth a turn."""
    if state.ambiguity_score > threshold:
        return Action.clarify(state.best_question())
    return Action.answer(state.resolve())
```

## Math renders like this

Inline, for instance the reward $r_t = \mathbb{1}[\hat{y} = y] - \lambda \cdot c_t$,
and display:

$$
J(\pi_\theta) = \mathbb{E}_{\tau \sim \pi_\theta}\left[\sum_{t=0}^{T} \gamma^t r_t\right]
$$

## How to add a post

Drop a Markdown file in `site/src/content/blog/`. The filename becomes the URL,
and the frontmatter above is validated at build time — a malformed `date` or a
missing `description` fails the build rather than shipping quietly. Set
`draft: true` to keep a post visible in `npm run dev` but out of the deployed site.
