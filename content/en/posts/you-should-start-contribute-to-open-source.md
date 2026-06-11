---
title: "You should start contribute to open-source"
description: "How I made first contribution — and why you should too"
date: "2026-04-03 00:00:00 UTC"
duration: "5 min"
toc: false
tags:
  - dev
---

# {{ title }}

<posts-date-duration :duration="meta.duration" :date="meta.date" class="-mt-6"></posts-date-duration>

If you are good developer, but looking for an opportunity to grow professionaly, you **should start contribute to open-source**. And the reason goes beyond benefiting the community — it's much more beneficial for you directly.

For a long time I was really interested in contributing, but I both underestimated the value I'd get from contributions and overestimated the complexity of the process. In this article I want to touch on both of these themes and maybe make you reconsider your perspective on OSS.

I'm proud to tell you that since the beginning of 2026 I've already made 10+ contributions, and even landed in the top 30 contributors in [Reka UI](https://reka-ui.com/) — the core library for [NuxtUI](https://ui.nuxt.com/) and [shadcn-vue](https://www.shadcn-vue.com/)!

---

## The barrier

For a long time, the idea of contributing felt out of reach. Maintainers are smart and professional — what could I possibly offer? On top of that — working full-time left only evenings, it's not common to contribute in Russia, so nobody around me had ever done it, and the process itself was a mystery. Should you just pick an open issue? Go through the whole project hunting for bugs?

I tried different approaches and found one that worked for me, so I want to share it with you.

## The playbook

The key mindset shift was simple - yet hard to find: **stop treating third-party bugs as your app's problem**.

Here's the workflow that made me understand how I could contribute:

1. **Split bugs into levels.** When something breaks, ask: is this your code or a dependency? It seems obvious, but think about how often you wrote workarounds for your app when the bug actually came from third-party.
2. **Dig into the source.** If the bug is from a third-party — open the source and trace it. Most bugs are easier to find than you'd expect.
3. **Solve first, then ask.** Come up with a fix and THEN open an issue asking if you can submit a PR. This order was key for me — the fear of taking on responsibility and failing was real. Knowing I had already found a fix made it much easier to step up.
4. **Protect your deadlines.** If you're worried about timelines at work (since you can't control when your PR gets merged) — create a workaround in your codebase anyway and add a TODO linking to the issue to track the upstream fix.

Your first contribution doesn't need to be massive. A missing translation, an unexported type, a docs typo — it's enough to get familiar with the workflow: forking, branching, opening PRs, responding to reviews, etc.

## The benefits

So why do I think that you **should contribute**?

As I said before — contributing is one of the rare cases where I underestimated the value I actually got. Every contribution delivers value in three directions at once:

1. **Your product.** That bug you fixed upstream? It's now fixed for your project too — properly, not with a workaround. Your codebase gets cleaner, and you stop carrying technical debt that isn't yours.
2. **The community.** Every fix, every improvement, every translation helps thousands of developers who depend on the same library. Your one PR might save hundreds of people from writing the same workaround you did.
3. **Yourself.** You [read](https://medium.com/@mohitsingh3406/why-reading-code-is-more-important-than-writing-it-30c01a489375) code written by experienced developers. You get reviews from people who think differently than your team. You learn to write code that strangers can understand, to communicate in PRs, to think about edge cases that don't exist in your own project.

On top of that, contributing can become a really good networking tool and source of job opportunities. Although the direct impact of contributions on your job offers is overrated — the network you can build through them is not.

All of these are exactly the traits that separate good developers from great ones. Think about any programmer you admire — chances are, they're an open-source contributor. I think that's not a coincidence — OSS contributions aren't a consequence of being great, but a cause.

## The controversy

There's also an opposite position, which is well explained here: [Don't Contribute to Open Source](https://www.youtube.com/watch?v=5nY_cy8zcO4). You may notice that my article title is the straight opposite of that video — and that was deliberate. That kind of position was actually gatekeeping me from trying to contribute and grow professionally.

While I mostly don't agree with this position, I still **highly** recommend watching it, as I totally agree that situations like [Node.js README spam](https://www.youtube.com/watch?v=YFkeOBqfQBw) **SHOULD NOT** happen. I also understand the reason for gatekeeping, but I think it should be balanced and not too aggressive.

But let me make it clear — while you **should start contribute to open source**, you also **must be respectful and responsible for your actions**.

## Conclusion

If you've been thinking about contributing to open source but haven't started yet — you definitely should try. It could become both a growth opportunity and a rewarding experience. As for me — I'll definitely continue to contribute when I get the chance and free time.

Basically, that's why if you want to grow professionally you <prose-a target="" href="/posts/you-should-start-contribute-to-open-source">should start contribute to open-source</prose-a>.
