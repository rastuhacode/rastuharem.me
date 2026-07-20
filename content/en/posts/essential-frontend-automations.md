---
title: "Essential frontend automations"
description: "Some useful automations I discovered to drastically improve the developer experience"
date: "2026-07-21 00:00:00 UTC"
duration: "10 min"
toc: true
tags:
  - dev
---

# {{ title }}

<posts-date-duration :duration="duration" :date="date" class="-mt-6"></posts-date-duration>

## Introduction

After years of frontend work I've tried lots of automation tools — some turned out to be more hype than useful, and some turned out to be gems hidden in the sand.

Today I'll share my favorite automations, which I consider useful (some of them even essential). I've thoroughly used and tested them in production, and some of them differ from the common pipeline.

## Disclaimer

I intentionally don't mention any LLM automations for several reasons:

- There are lots of LLM automations — enough for another 1–2 articles
- I haven't had enough experience testing LLM automations in production
- LLM automations keep appearing, changing, and evolving
- Current automations can be used inside LLM agents, so they complement each other

## Automations

This article is structured from more common/famous tools to less known ones. You can use the TOC on the left to jump to the area of frontend development you're interested in.

### Linting and formatting = ESLint + ESLint Stylistic

The most obvious automation is of course [ESLint](https://eslint.org/).

> Wait, where's Prettier?

Yes, there's no [Prettier](https://prettier.io/). In my opinion it is better to use [ESLint Stylistic](https://eslint.style/).

You can read about this in [Why I don't use Prettier](https://antfu.me/posts/why-not-prettier), but my general issue is: **if you don't like Prettier's styling, you will fight it and work around it**. Some behavior can't be configured in a fine-grained way, and some can't be overridden at all. ESLint gives much more flexibility where it's needed without compromising useful features.

If you haven't tried this workflow, I would definitely recommend giving it a try.

Also take a look at [Oxlint](https://oxc.rs/docs/guide/usage/linter) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter). At the time this article was written, Oxlint doesn't support many ESLint rules ([general](https://github.com/oxc-project/oxc/issues/481), [vue](https://github.com/oxc-project/oxc/issues/15761)), but that might change soon.

### Testing = Playwright + nightly smokes

Testing has lots of different automations, but one I think is underestimated: **E2E nightly smokes**. Smoke tests are a small set of E2E cases that cover the most popular flows in your product. If you want that product to be as stable as possible, run them every night. I find [Playwright](https://playwright.dev/) the best for E2E at the moment — strong support from Microsoft, better readability than Cypress, and all the major integrations.

The coolest and most underrated upside is catching regressions in a common workflow before the next workday — often before anyone else notices. If nobody noticed, it "never happened". A clean nightly history is also a solid argument when you talk about reliability or promotion.

### Code quality = Knip + Husky

[Knip](https://knip.dev/) lets you check your code for a dead one. The issue with Knip is that it needs extra configuration if you use auto-imports — those files look unused by default. A minimal fix is to mark them as entry points or ignore them:

```json
{
  "entry": ["src/main.ts", "src/components/**/*.vue"],
  "ignore": ["src/auto-imports.d.ts"]
}
```

[Husky](https://typicode.github.io/husky/) lets you run commands on git hooks — most often pre-commit. Common use cases are running [lint-staged](https://github.com/lint-staged/lint-staged) so only staged files get linted, or checking that commit messages follow a convention.

That said, hot take — **I wouldn't use Husky**, or at bare minimum **I wouldn't block commits with it**. CI already gives you access to the same checks, with a controlled way to override them when you need to.

Enforcing blocking pre-commit hooks in private teams is rarely worth it:

1. These rules can be easily disabled with `HUSKY=0` (or `--no-verify`) without any trace or report.
2. If skipping them is somehow blocked (custom git wrappers, enforced hook policies, etc.), then glhf with hotfixes you need to release ASAP — just imagine explaining to a manager that you haven't released the fix due to an ESLint error. Also it makes temporary commits unavailable (I often use them).
3. Even disabling doesn't fully turn Husky rules off — e.g. a user can just delete the rules or Husky on their machine.

As a result, congrats: you made the workflow much worse by creating a half-secure pipeline.

Treating local Husky hooks as a real security boundary is a bit like storing a JWT secret in the browser. In interviews, if teams has a blocking Husky rules, I really consider this as a yellow-to-red flag.

Please, use Husky only if you know what you're doing.

### Dependency versioning = taze + Renovate

Managing dependencies is relatively easy, but it should be done repeatedly. If we could automate some of its parts even a little bit — we would get a big improvement long term.

You can check each package manually, or you could use [taze](https://github.com/antfu-collective/taze). Taze lets you check which packages have updates, categorize them by semver (major, minor, patch), and auto-apply them:

```bash
pnpm dlx taze -w
```

As an alternative you could use the [Renovate](https://docs.renovatebot.com/) bot (or any similar one). It lets you create PRs automatically while managing your `package.json`.

I honestly prefer **taze** as it works with [pnpm catalogs](https://pnpm.io/catalogs) and I like to test the build locally after each package update just to be sure. But both choices are solid for production in my opinion.

### Manage monorepo = Turborepo + pnpm

Monorepos have a dark history — they were mostly a collection of workarounds to make all repos work together. Right now monorepos are much easier, but still harder to manage than a simple repo.

I've created and maintained many monorepos and I find [Turborepo](https://turbo.build/) and [pnpm](https://pnpm.io/) extremely useful.

I honestly think that **pnpm should be used instead of npm by default** in any repo — it's just faster and more space-efficient. Just some sources: [pnpm vs npm vs yarn vs Bun](https://dev.to/pockit_tools/pnpm-vs-npm-vs-yarn-vs-bun-the-2026-package-manager-showdown-51dc), [I Finally Changed Package Managers](https://www.youtube.com/watch?v=ZIKDJBrk56k), [Categorize Your Dependencies](https://antfu.me/posts/categorize-deps). As for monorepos — pnpm is already established as a standard, where npm is trying to keep up (e.g. npm added workspaces only in 2020 and still doesn't have catalogs).

[Turborepo](https://turbo.build/) is a configurable build system which adds lots of features like build cache (so you wouldn't rebuild your workspace packages every time you rebuild the facade app) and a central command orchestrator (so you can run lint on all workspaces).

### Manage package versions = Changesets

Managing versions for packages is much harder than you might initially think. You have to implement the desired change, test it, calculate which semver modification it belongs to, build and release the package, and then update the changelog. Repeat for the next version.

It becomes more complicated if we consider that we may want to batch changes before release, automate changelog updates, calculate the actual semver bump (if we had several changes with different semver levels), and — by the end — make this work collaborative.

I consider [Changesets](https://github.com/changesets/changesets) to be the best tool for this case. Changesets lets you automate all these processes. You just need to fill a simple CLI form on each change. After that, the whole release pipeline can be automated as finely as you like.

### Generate backend endpoints = OpenAPI + Orval

What if we want full type safety and endpoint synchronization between our backend and frontend? In SSR frameworks we can use tools like [tRPC](https://trpc.io/) or Nuxt's auto-typed [useFetch](https://nuxt.com/docs/api/composables/use-fetch) composable. We can't apply the same methods though if we have a standard old-school SPA with a frontend team and a Java/PHP/any-other-language backend team.

Tools like [GraphQL](https://graphql.org/) exist, but what if you want just typed REST clients without adopting GraphQL? If you have such a case, you probably already have OpenAPI documentation from the backend to power Swagger. We can use codegen to take those same docs and generate Zod schemas, types, and even fetch services.

The best one in my opinion is [Orval](https://orval.dev/). Orval is a codegen which takes OpenAPI docs and generates all of the above, plus nice docs and easy-to-use configuration.

Here's a concrete before / after. Start with a tiny OpenAPI spec and an Orval config:

```yaml
# openapi.yaml
openapi: 3.0.3
info:
  title: Users API
  version: 1.0.0
paths:
  /users/{id}:
    get:
      operationId: getUser
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      required: [id, email]
      properties:
        id:
          type: string
        email:
          type: string
          format: email
```

```ts
// orval.config.ts
import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    input: './openapi.yaml',
    output: {
      target: './src/api/endpoints.ts',
      client: 'fetch',
      schemas: './src/api/models',
    },
  },
})
```

After `orval`, you get typed models and a ready-to-use fetch client — no hand-written DTO mapping:

```ts
// src/api/models/user.ts (generated)
export interface User {
  id: string
  email: string
}

// src/api/endpoints.ts (generated, simplified)
export const getUser = async (id: string, options?: RequestInit): Promise<User> => {
  const res = await fetch(`/users/${id}`, { ...options, method: 'GET' })
  return res.json()
}
```

The one problem I want to mention is that you need to manage collaborative work, which could change and break the types on the frontend (e.g. you are writing a hotfix and some feature is deployed on dev by the backend team, which results in your types being broken). For this case, one solution is to use an npm package with OpenAPI schemas, which would be updated and versioned by both teams.

### Generate Figma tokens = Tokens Studio + Style Dictionary

This is both the most useful and the hardest automation to set up, as it would require changing the way your design team works.

The major issue when you have a designed UI is keeping it in sync with changes in Figma. I've heard lots of scary stories about teams spending even 1/5 of their sprints just syncing with Figma. For some reason there's a still poor versioning mechanism in Figma, and many local custom workarounds are created.

We can use [Tokens Studio](https://tokens.studio/) to resolve this issue. Tokens Studio is basically a Figma plugin which manages design tokens. When designers use tokens through that plugin they can export them as a schema (like OpenAPI for tokens), and then we can use [Style Dictionary](https://styledictionary.com/) to render this schema into our specific CSS setup — Tailwind, CSS variables, Sass, and so on.

Concrete before / after. Designers export a Tokens Studio schema, and you point Style Dictionary at it:

```json
// tokens/colors.json (exported from Tokens Studio)
{
  "color": {
    "brand": {
      "primary": { "value": "#2563eb", "type": "color" },
      "secondary": { "value": "#7c3aed", "type": "color" }
    },
    "surface": {
      "bg": { "value": "#ffffff", "type": "color" },
      "fg": { "value": "#0f172a", "type": "color" }
    }
  },
  "spacing": {
    "sm": { "value": "8", "type": "spacing" },
    "md": { "value": "16", "type": "spacing" },
    "lg": { "value": "24", "type": "spacing" }
  }
}
```

```js
// style-dictionary.config.js
export default {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [
        {
          destination: 'theme.css',
          format: 'css/variables',
          options: {
            selector: '@theme',
          },
        },
      ],
    },
  },
}
```

With `selector: '@theme'`, Style Dictionary generates a Tailwind v4 theme file directly:

```css
/**
 * Do not edit directly, this file was auto-generated.
 */

@theme {
  --color-brand-primary: #2563eb;
  --color-brand-secondary: #7c3aed;
  --color-surface-bg: #ffffff;
  --color-surface-fg: #0f172a;
  --spacing-sm: 8;
  --spacing-md: 16;
  --spacing-lg: 24;
}
```

```css
/* app.css */
@import "tailwindcss";
@import "./build/theme.css";
```

It has the same issue with versioning the tokens, but Tokens Studio supports integration with Git so designers can easily version token changes. Then we can create an npm package where this generation would be applied and pin our frontend to that version.

## Conclusion

I've tried to collect my favorite high-value automations, the ones that I actually kept using after trying. I hope you found something interesting and new for yourself!