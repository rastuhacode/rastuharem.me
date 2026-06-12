---
title: "Stop using HTML for your resume"
description: "Continuation of the resume topic and major improvements in CV.html"
date: "2026-06-13 00:00:00 UTC"
duration: "8 min"
toc: true
tags:
  - dev
---

# {{ title }}

<posts-date-duration :duration="meta.duration" :date="meta.date" class="-mt-6"></posts-date-duration>

## Disclaimer

This post is a logical continuation of [Stop using Word for your resume](/posts/stop-using-word-for-your-resume). I strongly recommend reading that post first for full context, but I will still recap the main points:

1. A resume should have a **single local** source of truth in an easy-to-edit **raw** format.
2. That raw format should be **transformable to PDF**, **LLM and ATS friendly**, **version-controllable**, and **portable**, with **precise layout control**, **rich and flexible styling**, **easy-to-author content**, and **separation of content and style**. We assume the user is a **developer** and/or **can or wants to learn** that format.
3. **HTML** fits the role, but didn't have the required tooling.
4. [CV.html](https://cv-html-dev.netlify.app) was created to fill this gap.

## Issues

Since then, I've been using my tool a lot, experimenting with different styles, content, visual designs, and so on. While it all sounds good on paper, in practice some unexpected issues appeared.

### Repeating

Resume structure is inherently repetitive — job entries, bullet points, skills lists — but plain HTML gives you no way to express that. For example, achievements inside a work experience entry, or the work experience entries themselves.

Technically, it's a two-level-deep list, and while in day-to-day work we'd use loop rendering and component abstraction, plain HTML doesn't give you those tools. You could extract some markup into a [custom element](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements), but you'd still repeat it many times in code, bloating the file and running into everything you've heard about the [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principle.

Also, who wants to write web components for their resume?

### Images

It's common to add a photo to a resume in some countries, and the most portable way to embed one in HTML is to convert it to a base64 string. If you've ever seen an encoded image, you know it can get really big. In the current setup, a user has to paste it into an `img` tag as the `src` attribute:

```html
<img src="data:image/[format];base64,[your_base64_string]" />
```

That combines perfectly with the previous issue, making your HTML even more bloated. Now imagine rendering the same image several times (as in the work experience list case). Even thinking about it gives me a headache.

### Multilingual

One of my use cases was creating bilingual resumes that look the same. It quickly became a struggle because of the issues above, plus the sheer mix of tags, classes, and actual content. I could paste the HTML file into an LLM and ask it to translate, but:

1. I should still review its output and make changes.
2. Encoded images will eat unnecessary tokens.
3. Compare the Chinese and English versions of the same sentence:

   ```md
   > London is the capital of the United Kingdom.
   > 伦敦是英国的首都。
   ```

   It's obvious that the Chinese version is shorter than the English one. If you simply translate the same HTML template, the fixed-size boxes and page breaks would drift. For example, a two-page Chinese resume can become a three- or four-page English resume, which may be considered oversized. So I'd also need to adjust styles and template structure. Remember the work experience list example? Be frightened!

## Solution

Stop using HTML for your resume. Or not?

When I ran into these issues, I started thinking about how to keep the benefits of HTML while removing the problems. And I found a really nice solution.

### Concept

We need to understand the actual core problem. Let's go back to our requirements — one of them was **separation of content and style**.

CV.html has three tabs: **Template**, where the user writes HTML; **Styles**, where the user writes CSS; and **Head**, for additional external imports (Tailwind CSS, fonts, etc.). While separation technically exists between content and style via the Template and Styles tabs, the actual experience was the opposite.

That's because this point needs to be formulated a bit differently: **separation of content, _template_, and style**.

We need to decompose HTML into **content** and **template** parts first. Let's define them:

- **Content** — all the _information_ in the resume: text, images, and any other metadata the template needs.
- **Template** — the _structure_ of the resume. It can also be described as the _compilation_ of **content** and **styles** according to the user's rules.

### Implementation

#### Template

The main focus should be the **Template** section. Those HTML issues aren't new — frontend _frameworks_ already solved them. But creating a React app for a resume would be overengineering: it would be heavy, the user wouldn't need most of the features, it would complicate PDF export, and it would make raw HTML export unavailable. For comfortable work, we need only the following framework's features:

1. Loop and conditional rendering to remove bloat.
2. Binding to dynamic variables, with **content** stored separately.
3. Static HTML as the final output.

This isn't a common use case, but it's a valid one — and the perfect tool already exists.

Welcome, [Handlebars](https://handlebarsjs.com)!

In short, **Handlebars** is a simple templating language that takes a template and an input object to generate HTML or other text formats. You can read more about its features in the [docs](https://handlebarsjs.com/guide), but I'll focus only on what's important for us:

1. Has [loop](https://handlebarsjs.com/guide/builtin-helpers.html#each) and [conditional](https://handlebarsjs.com/guide/builtin-helpers.html#if) rendering out of the box.
2. Has [bindings](https://handlebarsjs.com/guide/expressions.html#basic-usage) to object variables.
3. Can be compiled at runtime to HTML.

Additionally, its syntax is very similar to modern frontend frameworks, so it's easy for my fellow frontend devs to pick up.

#### Content

The easy part is extracting **content** from HTML into a JS object. We can create a JSON or YAML file where the user defines their `cv` — all text data, attributes like a base64 image string, and so on — and then parse it.

Then we pass this object to Handlebars and let the user access it in the template. I chose YAML because it's more human-readable than JSON.

### Result

I've already implemented this solution, tested it, and it works really well — with massive flexibility. Here's how that looks in practice:

Maybe you want a bilingual resume? Or even the same template for another person? That can be done just by replacing the **content**.

  <div class="flex gap-2 md:flex-row flex-col">
    <posts-image src="/images/cvhtml-original.png" alt="Original CV.html resume" caption="Original CV.html resume" class="h-70"></posts-image>
    <posts-image src="/images/cvhtml-russian.png" alt="Same resume translated in Russian" caption="Same resume translated in Russian" class="h-70"></posts-image>
    <posts-image src="/images/cvhtml-johndoe.png" alt="Same template for random user" caption="Same template for random user" class="h-70"></posts-image>
  </div>

Or maybe you want another design? No worries — just replace the **template**.

  <div class="flex gap-2 md:flex-row flex-col">
    <posts-image src="/images/cvhtml-pinkycute.png" alt="Pinky-cute template" caption="Pinky-cute template" class="h-70"></posts-image>
    <posts-image src="/images/cvhtml-newspaper.png" alt="Newspaper template" caption="Newspaper template" class="h-70"></posts-image>
    <posts-image src="/images/cvhtml-terminal.png" alt="Terminal template" caption="Terminal template" class="h-70"></posts-image>
  </div>

There's so much customization that I still find new usage ideas and designs. You can try it too at <cv-html-badge class="ml-1"></cv-html-badge>.

## Conclusion

Is HTML still the best _raw_ format? Technically no — we replaced it with two independent `yaml` and `hbs` (Handlebars) files. But it still serves as an intermediate format between your source files and PDF, and you can still use the benefits of HTML like rendering it on a website.

So I would still say you should treat it as the output and author your resume in **content** / **template** abstractions and while native HTML doesn't have such separation, the ecosystem has all the right tools to achieve it!
