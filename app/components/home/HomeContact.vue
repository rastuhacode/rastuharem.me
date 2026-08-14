<script setup lang="ts">
interface ContactLink {
  external?: boolean;
  href: string;
  icon: string;
  label: string;
  value?: string;
}

const { t } = useI18n();
const email = "rasten.remizov@gmail.com";

const contactLinks = computed<ContactLink[]>(() => [
  { href: `mailto:${email}`, icon: "lucide:mail", label: t("homepage.contact.emailLabel"), value: email },
  { external: true, href: "https://t.me/rastuharem", icon: "simple-icons:telegram", label: t("homepage.contact.telegramLabel") },
  { external: true, href: "https://www.linkedin.com/in/rasten-remizov", icon: "simple-icons:linkedin", label: t("homepage.contact.linkedinLabel") },
  { external: true, href: "https://github.com/rastuhacode", icon: "simple-icons:github", label: t("homepage.contact.githubLabel") },
]);

const findLinks = computed<ContactLink[]>(() => [
  { external: true, href: "https://steamcommunity.com/id/rastuharem", icon: "simple-icons:steam", label: t("homepage.contact.steamLabel") },
  { external: true, href: "https://soundcloud.com/rastuharem", icon: "simple-icons:soundcloud", label: t("homepage.contact.soundcloudLabel") },
]);
</script>

<template>
  <section
    id="contact"
    class="home-shell not-prose scroll-mt-24 border-t border-border/80 py-20 sm:py-24"
    aria-labelledby="contact-title"
  >
    <div class="overflow-hidden rounded-3xl border border-border/80 bg-background/80 p-7 shadow-[0_30px_100px_-60px_color-mix(in_oklab,var(--foreground)_55%,transparent)] backdrop-blur-lg sm:p-10 lg:p-14">
      <p class="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {{ $t("homepage.contact.eyebrow") }}
      </p>
      <h2
        id="contact-title"
        class="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.045em] text-foreground-bold sm:text-6xl"
      >
        {{ $t("homepage.contact.title") }}
      </h2>
      <p class="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
        {{ $t("homepage.contact.description") }}
      </p>

      <div class="mt-12 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {{ $t("homepage.contact.contactMethodsLabel") }}
          </h3>
          <div class="grid gap-3 sm:grid-cols-2">
            <a
              v-for="link in contactLinks"
              :key="link.href"
              :href="link.href"
              :target="link.external ? '_blank' : undefined"
              :rel="link.external ? 'noopener' : undefined"
              class="group flex items-center justify-between gap-5 rounded-2xl bg-foreground/5 h-18 px-5 text-foreground no-underline ring-1 ring-inset ring-foreground/8 transition-all duration-300 hover:-translate-y-0.5 hover:bg-foreground/8 hover:text-foreground-bold"
            >
              <span class="flex min-w-0 items-center gap-4">
                <span class="grid size-10 shrink-0 place-items-center rounded-full bg-background/80 ring-1 ring-inset ring-foreground/10">
                  <Icon :name="link.icon" class="size-4 text-muted-foreground" />
                </span>
                <span class="min-w-0">
                  <span class="block font-semibold">{{ link.label }}</span>
                  <span v-if="link.value" class="mt-1 block truncate text-sm text-muted-foreground">{{ link.value }}</span>
                </span>
              </span>
              <Icon name="lucide:arrow-up-right" class="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>

        <div class="lg:flex lg:flex-col">
          <h3 class="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {{ $t("homepage.contact.findMeLabel") }}
          </h3>
          <div class="grid grow gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <a
              v-for="link in findLinks"
              :key="link.href"
              :href="link.href"
              target="_blank"
              rel="noopener"
              class="group flex h-18 items-center justify-between gap-5 rounded-2xl border border-border/80 bg-background/55 px-5 text-muted-foreground no-underline transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:text-foreground-bold"
            >
              <span class="flex items-center gap-4">
                <span class="grid size-10 place-items-center rounded-full bg-foreground/5">
                  <Icon :name="link.icon" class="size-4" />
                </span>
                <span class="font-semibold">{{ link.label }}</span>
              </span>
              <Icon name="lucide:arrow-up-right" class="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
