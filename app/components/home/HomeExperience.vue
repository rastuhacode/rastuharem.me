<script setup lang="ts">
import type { AnimatedTab } from "~/components/ui/animated-tabs/types";

interface ProductExperience {
  description: string;
  name: string;
  outcome: string;
}

interface EmployerExperience {
  company: string;
  href: string;
  icon: "astra" | "huawei";
  projects: ProductExperience[];
  value: string;
}

const { t } = useI18n();

const employers = computed<EmployerExperience[]>(() => [
  {
    company: "Astra Linux",
    href: "https://astra.ru/software-services/astra-consulting",
    icon: "astra",
    value: "astra-linux",
    projects: [
      {
        description: t("homepage.experience.firstDescription"),
        name: t("homepage.experience.firstName"),
        outcome: t("homepage.experience.firstOutcome"),
      },
      {
        description: t("homepage.experience.secondDescription"),
        name: t("homepage.experience.secondName"),
        outcome: t("homepage.experience.secondOutcome"),
      },
    ],
  },
  {
    company: "Huawei",
    href: "https://www.huawei.com/en",
    icon: "huawei",
    value: "huawei",
    projects: [
      {
        description: t("homepage.experience.thirdDescription"),
        name: t("homepage.experience.thirdName"),
        outcome: t("homepage.experience.thirdOutcome"),
      },
    ],
  },
]);

const companyTabs = computed<AnimatedTab[]>(() => employers.value.map(employer => ({
  title: employer.company,
  value: employer.value,
})));

function getEmployer(value: string) {
  return employers.value.find(employer => employer.value === value) ?? employers.value[0];
}
</script>

<template>
  <section
    class="home-shell not-prose border-t border-border/80 py-20 sm:py-24"
    aria-labelledby="experience-title"
  >
    <div class="flex justify-between gap-5 lg:gap-16">
      <div class="max-w-2xl grow">
        <h2
          id="experience-title"
          class="text-3xl font-semibold tracking-[-0.035em] text-foreground-bold sm:text-5xl"
        >
          {{ $t("homepage.experience.title") }}
        </h2>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {{ $t("homepage.experience.description") }}
        </p>
      </div>

      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {{ $t("homepage.experience.eyebrow") }}
      </p>
    </div>

    <AnimatedTabs
      :tabs="companyTabs"
      :stacked="false"
      :aria-label="$t('homepage.experience.tabsLabel')"
      container-class-name="gap-2"
      tab-class-name="min-w-36 border border-transparent px-5 py-3 text-left text-sm font-semibold uppercase tracking-[0.12em] transition-colors hover:border-foreground/15 sm:min-w-44"
      active-tab-class-name="shadow-[0_12px_35px_-20px_color-mix(in_oklab,var(--foreground)_80%,transparent)]"
      content-class-name="min-h-120"
      class="mt-12"
    >
      <template #tab="{ tab }">
        <AstraIcon
          v-if="getEmployer(tab.value)?.icon === 'astra'"
          class="size-4 shrink-0 text-blue-600"
        />
        <Icon
          v-else
          name="simple-icons:huawei"
          class="size-4 shrink-0 text-red-600"
        />
        <span>{{ tab.title }}</span>
      </template>

      <template #content="{ tab }">
        <article
          v-if="getEmployer(tab.value)"
          :key="tab.value"
        >
            <section
              v-for="(product, index) in getEmployer(tab.value)?.projects"
              :key="product.name"
              class="grid gap-7 border-t border-border/80 last:border-b py-8 first:pt-7 sm:py-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(17rem,0.65fr)] lg:gap-16"
            >
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {{ String(index + 1).padStart(2, '0') }} · {{ $t("homepage.experience.productLabel") }}
                </p>
                <h4 class="mt-4 text-2xl font-semibold tracking-tight text-foreground-bold sm:text-3xl">
                  {{ product.name }}
                </h4>
                <p class="mt-4 max-w-2xl leading-relaxed text-muted-foreground sm:text-lg">
                  {{ product.description }}
                </p>
              </div>

              <div class="lg:border-l lg:border-border/80 lg:pl-8">
                <p class="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {{ $t("homepage.experience.outcomeLabel") }}
                </p>
                <p class="mt-4 text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                  {{ product.outcome }}
                </p>
              </div>
            </section>

          <a
            :href="getEmployer(tab.value)?.href"
            target="_blank"
            rel="noopener"
            class="border-underline mt-3 inline-flex items-center gap-1 py-1 text-sm font-semibold text-foreground"
          >
            {{ $t("homepage.experience.companyWebsiteLabel") }}
            <Icon name="lucide:arrow-up-right" class="size-4" />
          </a>
        </article>
      </template>
    </AnimatedTabs>
  </section>
</template>
