import type { MaybeRefOrGetter } from "vue";

interface PageSeo {
  title: string;
  description: string;
  type: "ProfilePage" | "Blog" | "BlogPosting" | "ImageGallery" | "CollectionPage";
  date?: string;
}

export function usePageSeo(input: MaybeRefOrGetter<PageSeo>) {
  const site = useSiteConfig();
  const route = useRoute();
  const { locale, t } = useI18n();
  const page = computed(() => toValue(input));
  const siteUrl = computed(() => String(site.url).replace(/\/$/, ""));
  const pageUrl = computed(() => `${siteUrl.value}${route.path.replace(/\/$/, "")}/`);
  const image = computed(() => `${siteUrl.value}/images/social-card-${locale.value}.png`);
  const publishedAt = computed(() => page.value.type === "BlogPosting" && page.value.date
    ? new Date(page.value.date).toISOString()
    : undefined);

  useSeoMeta({
    title: () => page.value.title,
    description: () => page.value.description,
    ogTitle: () => page.value.title,
    ogDescription: () => page.value.description,
    ogType: () => page.value.type === "BlogPosting" ? "article" : "website",
    ogSiteName: () => t("homepage.hero.name"),
    ogImage: () => image.value,
    ogImageType: "image/png",
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: () => t("seo.imageAlt"),
    twitterCard: "summary_large_image",
    twitterTitle: () => page.value.title,
    twitterDescription: () => page.value.description,
    twitterImage: () => image.value,
    twitterImageAlt: () => t("seo.imageAlt"),
    articlePublishedTime: () => publishedAt.value,
    articleAuthor: () => page.value.type === "BlogPosting" ? [`${siteUrl.value}/`] : undefined,
  });

  useHead(() => {
    const personId = `${siteUrl.value}/#person`;
    const websiteId = `${siteUrl.value}/#website`;
    const language = locale.value === "ru" ? "ru-RU" : "en-US";
    const person = {
      "@type": "Person",
      "@id": personId,
      "name": "Rasten Remizov",
      "alternateName": ["Растен Ремизов", "rastuharem", "rastuhacode"],
      "url": `${siteUrl.value}/`,
      "jobTitle": t("seo.jobTitle"),
      "sameAs": [
        "https://www.linkedin.com/in/rasten-remizov",
        "https://github.com/rastuhacode",
        "https://t.me/rastuharem",
        "https://soundcloud.com/rastuharem",
        "https://www.last.fm/user/rastuhacode",
      ],
    };
    const webpage = {
      "@type": page.value.type,
      "@id": `${pageUrl.value}#webpage`,
      "url": pageUrl.value,
      "name": page.value.title,
      "description": page.value.description,
      "inLanguage": language,
      "isPartOf": { "@id": websiteId },
      "about": { "@id": personId },
      ...(page.value.type === "ProfilePage" ? { mainEntity: { "@id": personId } } : {}),
      ...(page.value.type === "BlogPosting" ? {
        headline: page.value.title,
        author: { "@id": personId },
        image: image.value,
        datePublished: publishedAt.value,
        mainEntityOfPage: pageUrl.value,
      } : {}),
    };

    return {
      script: [{
        key: "page-schema",
        type: "application/ld+json",
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [person, {
            "@type": "WebSite",
            "@id": websiteId,
            "url": `${siteUrl.value}/`,
            "name": "Rasten Remizov",
            "inLanguage": ["en-US", "ru-RU"],
            "publisher": { "@id": personId },
          }, webpage],
        }).replace(/</g, "\\u003c"),
      }],
    };
  });
}
