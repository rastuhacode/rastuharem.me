<script setup lang="ts">
type Focus = "engineering" | "photography" | "other";
type ContactLink = { label: string; icon: string; href: string };

const props = defineProps<{ focus: Focus }>();
const { t } = useI18n();

const contact = computed(() => {
  const email = (subject?: string): ContactLink => ({
    label: t("homepage.contact.emailLabel"),
    icon: "lucide:mail",
    href: `mailto:rasten.remizov@gmail.com${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`,
  });

  if (props.focus === "photography") {
    return {
      eyebrow: t("homepage.contact.photographyEyebrow"),
      title: t("homepage.contact.photographyTitle"),
      description: t("homepage.contact.photographyDescription"),
      accent: "bg-[#ef7659]",
      hoverAccent: "hover:bg-[#ef7659] focus-visible:bg-[#ef7659]",
      links: [
        email("Photography"),
        { label: "Telegram", icon: "simple-icons:telegram", href: "https://t.me/rastuharem" },
      ],
    };
  }

  if (props.focus === "other") {
    return {
      eyebrow: t("homepage.contact.otherEyebrow"),
      title: t("homepage.contact.otherTitle"),
      description: t("homepage.contact.otherDescription"),
      accent: "bg-[#72afc8]",
      hoverAccent: "hover:bg-[#72afc8] focus-visible:bg-[#72afc8]",
      links: [
        email("Music and writing"),
        { label: "SoundCloud", icon: "simple-icons:soundcloud", href: "https://soundcloud.com/rastuharem" },
        { label: "Steam", icon: "simple-icons:steam", href: "https://steamcommunity.com/id/rastuharem" },
        { label: "Telegram", icon: "simple-icons:telegram", href: "https://t.me/rastuharem" },
      ],
    };
  }

  return {
    eyebrow: t("homepage.contact.engineeringEyebrow"),
    title: t("homepage.contact.engineeringTitle"),
    accent: "bg-[#f5e536]",
    hoverAccent: "hover:bg-[#f5e536] focus-visible:bg-[#f5e536]",
    links: [
      email(),
      { label: "LinkedIn", icon: "simple-icons:linkedin", href: "https://www.linkedin.com/in/rasten-remizov" },
      { label: "GitHub", icon: "simple-icons:github", href: "https://github.com/rastuhacode" },
      { label: "Telegram", icon: "simple-icons:telegram", href: "https://t.me/rastuharem" },
    ],
  };
});
</script>

<template>
  <section class="site-container relative mx-auto mt-20 border-[3px] border-foreground-bold bg-background/65 p-6 text-foreground-bold shadow-[8px_8px_0_var(--color-foreground-bold)] backdrop-blur-sm sm:mt-28 sm:p-10" aria-labelledby="home-contact">
    <span class="absolute inset-x-0 top-0 h-2" :class="contact.accent" aria-hidden="true" />
    <div class="grid gap-10 pt-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div>
        <p class="text-xs font-black uppercase tracking-[0.22em] text-muted-foreground">
          {{ contact.eyebrow }}
        </p>
        <h2 id="home-contact" class="mt-4 max-w-2xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-6xl">
          {{ contact.title }}
        </h2>
      </div>
      <nav class="grid gap-3 sm:grid-cols-2" :aria-label="$t('homepage.contact.linksLabel')">
        <a v-for="link in contact.links" :key="link.href" :href="link.href" :target="link.href.startsWith('mailto:') ? undefined : '_blank'" :rel="link.href.startsWith('mailto:') ? undefined : 'noopener'" class="group flex min-h-24 flex-col justify-between border-2 border-foreground-bold bg-background/80 p-4 text-base font-bold text-foreground-bold no-underline shadow-[4px_4px_0_var(--color-foreground-bold)] transition-[transform,background-color,color] hover:text-[#171717] focus-visible:text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground-bold" :class="contact.hoverAccent">
          <span class="flex items-start justify-between gap-3">
            <Icon :name="link.icon" class="size-6" aria-hidden="true" />
            <Icon name="lucide:arrow-up-right" class="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </span>
          <span>{{ link.label }}</span>
        </a>
      </nav>
    </div>
  </section>
</template>
