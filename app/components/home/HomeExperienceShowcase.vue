<script setup lang="ts">
const shape = "rounded-none border-[3px] border-foreground-bold shadow-[8px_8px_0_var(--color-foreground-bold)]";
const firstSurface = "bg-[#205370]";
const secondSurface = "bg-[#8f2639]";
const headingStyle = "font-semibold uppercase";

function splitKeywords(text: string, keywords: string) {
  const parts: { text: string; highlighted: boolean }[] = [];
  const terms = keywords.split(";").filter(Boolean);
  let offset = 0;

  while (offset < text.length) {
    const next = terms
      .map((term) => ({ term, index: text.indexOf(term, offset) }))
      .filter(({ index }) => index !== -1)
      .sort((a, b) => a.index - b.index || b.term.length - a.term.length)[0];

    if (!next) {
      parts.push({ text: text.slice(offset), highlighted: false });
      break;
    }

    if (next.index > offset) parts.push({ text: text.slice(offset, next.index), highlighted: false });
    parts.push({ text: next.term, highlighted: true });
    offset = next.index + next.term.length;
  }

  return parts;
}
</script>

<template>
  <section aria-labelledby="experience-title">
    <div class="mb-9 grid gap-5 lg:grid-cols-[1fr_1fr] lg:items-end">
      <div>
        <p class="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">
          {{ $t("homepage.experience.eyebrow") }}
        </p>
        <h3 id="experience-title" class="mt-3 max-w-3xl text-4xl leading-tight tracking-[-0.055em] text-foreground-bold sm:text-6xl" :class="headingStyle">
          {{ $t("homepage.experience.title") }}
        </h3>
      </div>
      <div class="max-w-xl border-t-[3px] border-foreground-bold pt-5 lg:mb-1">
        <p class="text-lg font-semibold leading-snug text-foreground-bold sm:text-xl">
          {{ $t("homepage.experience.description") }}
        </p>
      </div>
    </div>

    <div class="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
      <article class="group relative isolate flex min-h-148 flex-col overflow-hidden p-6 text-white sm:p-9" :class="[shape, firstSurface]">
        <div class="relative flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <AstraIcon class="sm:size-16 size-10 text-sky-300" />
            <span>
              <span class="block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/55">
                {{ $t("homepage.experience.eyebrow") }} / 01
              </span>
              <RUnderlineText as="a" href="https://astra.ru/software-services/astra-consulting" target="_blank" rel="noopener noreferrer" class="block text-2xl md:text-5xl font-bold tracking-tight uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Astra Linux
              </RUnderlineText>
            </span>
          </div>
        </div>
        <RSVGMask v-slot="{ revealed }" class="-mx-6 -mb-6 mt-10 flex-1 sm:-mx-9 sm:-mb-9">
          <div
            class="experience-body grid h-full content-between gap-8 px-6 pb-6 sm:px-9 sm:pb-9"
            :class="revealed ? 'experience-body--astra-reveal' : 'experience-body--astra-base'"
          >
            <section class="experience-body__divider border-t pt-6">
              <p class="experience-body__label text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                01 / {{ $t("homepage.experience.productLabel") }}
              </p>
              <h4 class="mt-3 text-2xl tracking-tight" :class="headingStyle">
                {{ $t("homepage.experience.firstName") }}
              </h4>
              <p class="experience-body__work mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                {{ $t("homepage.experience.workLabel") }}
              </p>
              <p class="experience-body__copy mt-2 max-w-lg text-sm leading-relaxed">
                <span
                  v-for="(part, index) in splitKeywords($t('homepage.experience.firstDescription'), $t('homepage.experience.firstKeywords'))"
                  :key="index"
                  :class="part.highlighted ? (revealed ? 'experience-body__keyword' : 'experience-body__keyword-base') : undefined"
                >{{ part.text }}</span>
              </p>
              <div class="experience-body__result mt-5 border-l-4 px-4 py-4 sm:px-5">
                <p class="experience-body__label text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                  {{ $t("homepage.experience.resultLabel") }}
                </p>
                <p class="mt-2 text-2xl font-semibold tracking-tight">
                  {{ $t("homepage.experience.firstMetric") }}
                </p>
                <p class="experience-body__copy mt-1 text-sm leading-relaxed">
                  {{ $t("homepage.experience.firstOutcome") }}
                </p>
              </div>
            </section>
            <section class="experience-body__divider border-t pt-6">
              <p class="experience-body__label text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                02 / {{ $t("homepage.experience.productLabel") }}
              </p>
              <h4 class="mt-3 text-2xl tracking-tight" :class="headingStyle">
                {{ $t("homepage.experience.secondName") }}
              </h4>
              <p class="experience-body__work mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                {{ $t("homepage.experience.workLabel") }}
              </p>
              <p class="experience-body__copy mt-2 max-w-lg text-sm leading-relaxed">
                <span
                  v-for="(part, index) in splitKeywords($t('homepage.experience.secondDescription'), $t('homepage.experience.secondKeywords'))"
                  :key="index"
                  :class="part.highlighted ? (revealed ? 'experience-body__keyword' : 'experience-body__keyword-base') : undefined"
                >{{ part.text }}</span>
              </p>
              <div class="experience-body__result mt-5 border-l-4 px-4 py-4 sm:px-5">
                <p class="experience-body__label text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                  {{ $t("homepage.experience.resultLabel") }}
                </p>
                <p class="mt-2 text-2xl font-semibold tracking-tight">
                  {{ $t("homepage.experience.secondMetric") }}
                </p>
                <p class="experience-body__copy mt-1 text-sm leading-relaxed">
                  {{ $t("homepage.experience.secondOutcome") }}
                </p>
              </div>
            </section>
          </div>
        </RSVGMask>
      </article>

      <article class="group relative isolate flex min-h-148 flex-col overflow-hidden p-6 text-white sm:p-9" :class="[shape, secondSurface]">
        <div class="relative flex items-start justify-between gap-4">
          <div class="flex items-center gap-3">
            <Icon name="simple-icons:huawei" class="sm:size-16 size-10 text-white" />
            <span>
              <span class="block text-[0.65rem] font-bold uppercase tracking-[0.22em] text-white/60">
                {{ $t("homepage.experience.eyebrow") }} / 02
              </span>
              <RUnderlineText as="a" href="https://www.huawei.com/en" target="_blank" rel="noopener noreferrer" class="block text-2xl md:text-5xl font-bold tracking-tight uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                Huawei
              </RUnderlineText>
            </span>
          </div>
        </div>
        <RSVGMask v-slot="{ revealed }" class="-mx-6 -mb-6 mt-10 grow sm:-mx-9 sm:-mb-9">
          <div
            class="experience-body flex h-full flex-col gap-8 px-6 pb-6 sm:px-9 sm:pb-9"
            :class="revealed ? 'experience-body--huawei-reveal' : 'experience-body--huawei-base'"
          >
            <div class="experience-body__divider border-t pt-6">
              <p class="experience-body__label text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                03 / {{ $t("homepage.experience.productLabel") }}
              </p>
              <h4 class="mt-3 max-w-sm text-3xl leading-tight tracking-[-0.04em]" :class="headingStyle">
                {{ $t("homepage.experience.thirdName") }}
              </h4>
              <p class="experience-body__work mt-6 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                {{ $t("homepage.experience.workLabel") }}
              </p>
              <p class="experience-body__copy mt-2 max-w-lg text-sm leading-relaxed">
                <span
                  v-for="(part, index) in splitKeywords($t('homepage.experience.thirdDescription'), $t('homepage.experience.thirdKeywords'))"
                  :key="index"
                  :class="part.highlighted ? (revealed ? 'experience-body__keyword' : 'experience-body__keyword-base') : undefined"
                >{{ part.text }}</span>
              </p>
            </div>
            <div class="flex grow flex-col">
              <p class="experience-body__label text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                {{ $t("homepage.experience.resultsLabel") }}
              </p>
              <div class="mt-3 grid grow grid-rows-2 gap-3">
                <div class="experience-body__result flex flex-col justify-center border-l-4 px-4 py-4 sm:px-5">
                  <p class="text-3xl font-semibold tracking-tight">
                    {{ $t("homepage.experience.thirdRegressionMetric") }}
                  </p>
                  <p class="experience-body__copy mt-2 max-w-lg text-sm leading-relaxed">
                    {{ $t("homepage.experience.thirdRegressionOutcome") }}
                  </p>
                </div>
                <div class="experience-body__result flex flex-col justify-center border-l-4 px-4 py-4 sm:px-5">
                  <p class="text-3xl font-semibold tracking-tight">
                    {{ $t("homepage.experience.thirdMetric") }}
                  </p>
                  <p class="experience-body__copy mt-2 max-w-lg text-sm leading-relaxed">
                    {{ $t("homepage.experience.thirdOutcome") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RSVGMask>
      </article>
    </div>
  </section>
</template>

<style scoped>
.experience-body {
  color: var(--experience-text);
}

.experience-body--astra-base {
  --experience-text: #fff;
  --experience-copy: rgb(255 255 255 / 0.78);
  --experience-label: rgb(186 230 253 / 0.85);
  --experience-work: rgb(255 255 255 / 0.55);
  --experience-border: rgb(255 255 255 / 0.2);
  --experience-accent: #7dd3fc;
  --experience-panel: rgb(255 255 255 / 0.1);
}

.experience-body--astra-reveal {
  --experience-text: #102f40;
  --experience-copy: #183e51;
  --experience-label: #205370;
  --experience-work: #315e75;
  --experience-border: rgb(32 83 112 / 0.4);
  --experience-accent: #b6420a;
  --experience-panel: rgb(255 255 255 / 0.82);
  --experience-keyword: #b00633;

  background-color: #d9f2fc;
}

.experience-body--huawei-base {
  --experience-text: #fff;
  --experience-copy: rgb(255 255 255 / 0.82);
  --experience-label: rgb(255 228 230 / 0.9);
  --experience-work: rgb(255 255 255 / 0.6);
  --experience-border: rgb(255 255 255 / 0.2);
  --experience-accent: #ffe4e6;
  --experience-panel: rgb(255 255 255 / 0.15);
}

.experience-body--huawei-reveal {
  --experience-text: #411923;
  --experience-copy: #542a35;
  --experience-label: #8f2639;
  --experience-work: #86344a;
  --experience-border: rgb(143 38 57 / 0.4);
  --experience-accent: #126c7a;
  --experience-panel: rgb(255 255 255 / 0.78);
  --experience-keyword: #006d83;

  background-color: #ffe0d6;
}

.experience-body__divider {
  border-color: var(--experience-border);
}

.experience-body__label {
  color: var(--experience-label);
}

.experience-body__work {
  color: var(--experience-work);
}

.experience-body__copy {
  color: var(--experience-copy);
}

.experience-body__result {
  border-color: var(--experience-accent);
  background-color: var(--experience-panel);
}

.experience-body__keyword-base,
.experience-body__keyword {
  font-weight: 800;
}

.experience-body__keyword-base {
  color: #fff;
}

.experience-body__keyword {
  color: var(--experience-keyword);
}
</style>
