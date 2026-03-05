---
title: "Stop using Word for your resume"
description: "A practical comparison of resume formats"
date: "2026-03-03 00:00:01 UTC"
duration: "6 min"
tags:
  - dev
---

# {{ title }}

Every professional needs a resume. It's the most impactful document you have — one that shapes the first _impression_ of you.

When I started working in IT, the easiest and most obvious option was to use job-search platforms. All popular hiring websites offer a form that, once completed, generates a downloadable document for any HR person or recruiter to review.

But what if you use _several_ hiring platforms? Maintaining them quickly becomes tedious. Sooner or later, a single edit to your resume turns into a series of repetitive updates across different websites. In developer terms, this violates the **DRY** principle.

One solution is to keep your resume in a single editable file, update it when needed, and then sync it with all the platforms. This doesn't _fully_ solve the problem — you still have to manually copy and paste content — but it creates a **single source of truth** from which all copies are derived. On top of that, resumes exported by these platforms tend to be ugly and uniform, making them indistinguishable from one another and easy to skip.

This led me to a simple question:

> Which format should I use to create and store my source resume?

I spent far more time on this than I expected — and even had to build a simple tool along the way (more on that later).

---

## Defining the Requirements

Before comparing formats, I needed to define what I actually want. Here's my list, ordered by **importance**:

1. **Transformable to PDF** — PDF is the universal format for sharing resumes, so the source format **must** convert to it cleanly.
2. **Precise layout control** — margins, columns, spacing, and alignment should be easy to define and adjust.
3. **Rich and flexible styling** — fonts, colors, sizes, and visual hierarchy should be straightforward to apply.
4. **Easy to author content** — writing and editing text should feel natural, without fighting the format.
5. **LLM and ATS friendly** — LLMs can speed up creating, modifying, and reviewing resumes. ATS compatibility is less critical since the final output is PDF, but it's still nice if the raw format is parseable too.
6. **Version-controllable** — the format should be text-based so changes can be tracked, ideally with **Git**.
7. **Portable** — not locked into any specific tool, editor, or platform.
8. **Separation of content and style** — so you can redesign the look without rewriting the content.

## Evaluating the Options

### Microsoft Word (.docx)

The most popular _raw_ resume format is without a doubt **.docx**. Its strengths:

- **Easy to transform to PDF**
- **Rich styling** — you can easily change fonts, colors, etc.
- **Easy to author content**

And... no, that's all.

Now the weaknesses:

- **Layout control exists**, but IMHO it's clunky to work with.
- **Not LLM friendly at all** due to binary encoding. You can't paste raw content into an LLM. LLMs can't generate .docx files. ATS is excellent though.
- **Not version-controllable** — binary format means no meaningful diffs.
- **Not portable**. You're limited to Word (paid, desktop-only), Google Docs, or free editors that tend to be unstable.
- **Separation of content and style is practically nonexistent**.

So the most popular resume format satisfies only **3 out of 8** requirements. The same applies to **.gdoc**, which is essentially Google's equivalent.

My main frustration is the dependency on third-party products and the limited, hard-to-modify layout. Definitely not for me.

### LaTeX (.tex)

The format for math nerds. Its strengths:

- **Extremely high-quality PDF output**.
- **Precise control over spacing and layout**.
- **Easy to author content** (once you learn the syntax).

On the other hand:

- Styling is powerful but **verbose and hard to customize** — most of the LaTeX resumes look familiarly _scientific_.
- While .tex files are technically plain text, the verbose syntax makes them **harder to work with for LLMs and ATS** than simpler formats.
- **Version control is possible**, but the noisy syntax makes diffs harder to read.
- **More portable than .docx**, but you still need a TeX distribution or a dedicated editor.
- **No real separation of content and style**.

LaTeX is better than .docx, but still doesn't check enough boxes. Not for me.

### Markdown (.md)

Here's where things get interesting. Strengths:

- **Really easy to author content**.
- **Fully LLM and ATS friendly**.
- **Version control is effortless** (especially with Git).
- **Extremely portable** — any text editor will do.

Much better! But there are notable gaps:

- **No layout control** — only document structure.
- **No styling** — it's plain text content.
- **Nothing to separate** when there are no styles.
- **PDF export is possible** but not straightforward.

The core problem is that Markdown is **headless** — it requires a custom **toolchain** to transform content into a final, styled PDF. That said, most of these tools are open source.

So you _can_ freely edit your resume's content, but _can't_ control its appearance out of the box. A clear step up, but let's see what else is out there.

### JSON / YAML Structured Resume

I won't spend much time on this — it's essentially the same story as Markdown, with even less styling support.

---

## Solution

Those are the most common formats people use for resumes, and none of them truly fit my needs. What I wanted was full control over content, styles, _and_ layout. If only there were a markup language that separates structure and styling, supports precise layout, and exports cleanly to PDF...

WAIT... and then it clicked!

### HyperText Markup Language (HTML)

Straight to the point:

- **Easily transformed to PDF** via browser print or automation tools.
- **Layout control is excellent** — Flexbox, Grid, you name it.
- **Rich** — no, **RICH** styling with the full power of CSS, including hovers and animations (though not in PDF).
- **Fully LLM friendly** — you can easily generate and modify styled resumes. ATS can often parse it as well, though overly complex markup may cause issues..
- **Version control** is just as easy as Markdown — it's plain text.
- **Fully portable** — both content and layout travel with the file.

Any downsides? Of course:

- **Content mixes with markup** — tags and styles live alongside your text. It's still readable, but separation isn't ideal.

And... yes, that's it for the obvious ones!

### Hidden Gotchas

Having worked with HTML resumes for a while, I've encountered a few less obvious issues:

- **You need to know HTML and CSS** to write it. That said, LLMs can generate it for you.
- **Browser rendering differs across operating systems.** The same HTML can look different on Windows vs. macOS.

  Take a look at these two renderings of the same HTML resume on different systems:

  // Pictures here

  The font appears different even though the CSS properties are identical. I spent a long time researching this, and unfortunately it can't be fully fixed. The good news is that once rendered to PDF, the result looks the same everywhere.

- **No built-in page breaks.** You have to handle pagination manually.

  CSS helps with properties like:

  ```css
  .page {
    width: 210mm;
    height: 297mm;
  }

  @media print {
    .page {
      break-after: page;
    }
  }
  ```

  These lock the dimensions to a real printable page. But combined with the cross-OS rendering differences, page breaks can shift when editing on different devices — an annoying source of inconsistency.

---

## Building the Tool

When I settled on HTML, I started looking for a dedicated tool. Surely I wasn't the first person to think of this use case.

But nothing quite fit. I couldn't find a tool that gave you direct, full control over an HTML resume. The closest options were form-based builders where you load data and pick a template — but they weren't free, and they didn't give you a raw editable file.

The other obvious approach was editing HTML directly in VS Code, but constantly switching to a browser is tedious. Page breaks are only visible in print preview, and you have to manually export every time.

So I decided to build the tool myself. I called it **[CV.html](https://cv-html-dev.netlify.app/)**.

It's a Monaco Editor with a live preview, packed with features like:

- **Export to PDF**
- **Import / Export HTML** — save, load, and modify your resume freely
- **TailwindCSS support** (yeah, really!)
- **Auto-formatting with Prettier**
- **Handy extras** like A4 page outline, utility styles, customizable `<head>` for fonts, and more
- **Completely free and open source**

If you've read this far and are interested, check it out [live](https://cv-html-dev.netlify.app/) or on [GitHub](https://github.com/rastuhacode/cv.html). I'd be glad if you find it useful and appreciate any feedback!

There's still plenty of room for improvement. For instance, text replacement isn't straightforward because `<span>` tags and other markup get mixed with content. I plan to decompose the template and data layers in a future.

## Conclusion

Many developers keep their resume in Markdown, LaTeX, or .docx, but HTML offers a surprisingly powerful alternative.

It's not perfect, but for my needs it turned out to be the best option — offering unmatched control over content, styling, and layout in a portable, version-controllable format.

I hope you found this article helpful. See you next time!
