---
title: "Why I don’t use music streaming services"
description: "My long-term issues with music streaming services and the solution I came up with"
date: "2026-08-14 00:00:00 UTC"
duration: "8 min"
toc: true
tags:
  - dev
  - music
  - life
---

# {{ title }}

<posts-date-duration :duration="duration" :date="date" class="-mt-6"></posts-date-duration>

## Disclaimer

This is probably the most personal post I've written so far, as these thoughts have followed me for about four years. With both the world and my life constantly changing, I struggled to come up with the right solution.

Recently, I've had a bit more time and enthusiasm to tackle this issue. So, with a plan based on my theories and some help from agents, I started experimenting.

## Beginning

Music has been my passion since I was about 14. In terms of its impact on my life, it could be considered equal even to programming. I didn't just listen to music, but I also [wrote](https://soundcloud.com/rastuharem) my own. I never had any money in mind and just wrote it as a hobby - I enjoyed it so much.

I've since taken a break from writing music, but I still listen to it a lot. And throughout that time, one thing has remained clear to me: **all music streaming services suck**.

I completely understand why most people don't have an issue with them, although I would still recommend reconsidering how you use them.

I'll try to explain **my** issues, how they emerged over time, and how I became convinced of this opinion.

## History

If you listen to music, I have a genuine question for you: **what is music to you?** Why do you listen to it? Maybe you like deep lyrics, the bounce of EDM, distorted rock guitars, or the flow of an orchestra.

I like all of that, but my main reason is that **music is a storage medium for memories**. A song can hold a life-changing event, a prolonged period of your life, a clutch in a game, or a connection to another work of art—an anime opening or a film's closing credits. My music collection contains all those moments, combined and shuffled, ready to bring those memories back.

That's why I think of my collection as a treasure. I want to keep it forever and always be able to both "write" and "read" memories from it. I want it to be available on a plane, train, or in a car; while I'm gaming, working, or writing this post. My music should **always be accessible**.

### Everywhere

This was the first core issue I identified: **music services don't let you access your collection everywhere**. Of course, this wasn't entirely the services' fault; it was also a technical limitation.

With that in mind, I created the following system:

1. Buy songs and store them locally on my phone's SD card. This would give me a source of truth and reliable access.
2. Log in to a music service and manually sync it with my local library. This was for convenience: I could listen while gaming on my PC or working on my laptop without connecting my phone, transferring files, or moving the SD card every time. At the time, I used VK Music for this. Keep in mind that Spotify wasn't available in Russia, and VK was actually the best option—we'll return to it later.

Although music services let you cache tracks for offline listening, this is usually a paid and restricted feature that I didn't want to rely on.

### Anything

When I started creating music, I wanted to upload my own tracks as part of that "sync." Fortunately, VK allowed me to do so. In the meantime, Spotify officially launched in Russia, so I wanted to try it.

It was a huge disappointment to discover that Spotify did not let me upload a track directly into a cloud-synced personal library; officially releasing it required a distributor. In addition, some of the artists I listened to were self-releasing and didn't have a Spotify profile, so part of my collection was simply missing.

The second issue emerged: **music services don't let you listen to anything you want**.

### Inconsistency

My breaking point was the third issue I recognized over time: **music services are context-dependent**.

Unfortunately, I encountered several different examples:

- In April 2022, Spotify [left](https://newsroom.spotify.com/2022-03-02/spotifys-statement-in-response-to-the-war-in-ukraine/) the Russian market after being [available](https://newsroom.spotify.com/2020-07-14/spotify-is-now-available-in-russia-croatia-ukraine-and-10-other-european-markets/) for **less than two years**. People who used the platform effectively **lost access to their music collections**.
- VK was ["bought"](https://archive.nytimes.com/dealbook.nytimes.com/2014/09/16/mail-ru-takes-full-ownership-of-vkontakte-russias-largest-social-network/?eafs_enabled=false) by Mail.ru, which made poor business and technical decisions and lost a huge portion of its users. The music service was fine until a redesign **[broke](https://vc.ru/services/1722129-v-chem-problema-novogo-dizaina-vkontakte-s-tochki-zreniya-artistov-i-teh-kto-na-nih-podpisan) feed playback**. Then it started **[blocking](https://www.themoscowtimes.com/2026/04/15/russian-websites-begin-blocking-vpn-users-as-internet-controls-tighten-a92511) people using VPNs**, which many Russians rely on, making the **app almost unusable**.
- More recently, new Russian censorship laws prompted labels and platforms to [edit or remove](https://www.themoscowtimes.com/2026/03/16/russias-censorship-laws-are-killing-its-pop-culture-a92220/pdf) many songs. In many cases, this has meant **replacing original tracks with _new_ versions**.

If you think this is all specific to Russia, consider this examples:

- India. In May 2025, its government advised streaming platforms to remove media originating in Pakistan on national-security grounds. Pakistani music subsequently [disappeared](https://www.indiatoday.in/amp/entertainment/music/story/pakistani-songs-pulled-down-from-spotify-after-indian-government-advisory-2725114-2025-05-15) from services including Spotify and Apple Music for Indian listeners. Once again, tracks people had saved were made unavailable because the political context around their library had changed.
- Hong Kong, a 2024 court injunction targeting the protest anthem “Glory to Hong Kong” led YouTube to [block dozens of videos locally](https://apnews.com/article/protest-song-glory-to-hong-kong-remove-cbe6d6b24c3a80b1c0dc089b0a57223f). Its distributor then removed the song from streaming platforms, including Apple Music and Spotify, with some removals extending beyond Hong Kong.
- Turkey, a court ordered Spotify, Apple Music, and YouTube to [block access](https://www.balcanicaucaso.org/en/cp_article/mabel-matiz-music-and-censorship-in-turkey/) to Mabel Matiz’s song “Perperişan” in 2025 after the Ministry of Family and Social Services argued that its lyrics threatened public order and family values.

Russia may be a thousand steps ahead of the rest of the world in this regard, but **you are still not protected from radical interventions** in your library. A music service can ban you, replace tracks in your library, suddenly put features behind a paywall, or simply become unusable to you.

### UI

While testing and using different streaming products, I also found that most **music services have bad interfaces or lack essential features**.

I've already mentioned VK's redesign. I would also point to the awful Yandex Music [redesign](https://t-j.ru/new-wave-4-u/) of "My Wave".

What about international music services? I was surprised to discover that most of them [don't offer bulk operations](https://www.reddit.com/r/truespotify/comments/1fy67cl/how_to_add_multiple_songs_from_one_massive/) for tracks. You also can't clear your music preferences.

## Changes

As these issues piled up, I kept searching for an acceptable solution. I researched almost every possibility, from self-hosting on a Raspberry Pi and using Plex to buying a separate player, but nothing seemed convenient enough.

In the meantime, Telegram [released](https://telegram.org/blog/profile-music-gift-themes) Profile Music, which behaves similarly to VK's "My Music." I started moving my online collection there, and it was good enough. My main issues were its primitive and inconvenient interface and the Telegram team's apparent lack of interest in adding essential features such as playlists (yes, there are no custom playlists), a separate window for tracks, bulk editing, and so on.

To be honest, comparing these issues with those of other music services is like comparing candy with tree bark. It might not be my _favorite_ candy, but I would choose it over bark every time.

A little later, after Telegram was [blocked](https://edition.cnn.com/2026/02/10/europe/telegram-ban-russia-web-block-latam-intl) in Russia, I conveniently learned that an MTProto API exists, allowing anyone to create their own Telegram client.

## Solution

I began wondering whether I could build a client specifically for music and implement the missing features, combining the best of both worlds: Telegram Desktop's broad availability and local-first playback with the good interfaces and features of music services.

I started researching and building. I wanted a desktop app primarily for macOS and Windows, with the possibility of expanding to Android in the future. I also preferred to write it in TypeScript simply because I was familiar with it, which would speed up development.

I already had experience with [Electron](https://www.electronjs.org/), but it couldn't be compiled for Android. [Expo](https://expo.dev/), on the other hand, had no desktop versions and used React Native, which I hadn't worked with before. Eventually, I found a framework that fit my requirements better than any other: [Tauri](https://tauri.app/).

---

With help from an agent and the fragments of C++ knowledge I retained from university, I managed to learn Rust to a workable level. After that, I just kept building and building...

My idea was that a user would log in to the app with their Telegram account through direct MTProto authentication and gain access to their Saved Music, renamed "All Tracks" or "Library" in my app. I would then add all the missing playlist operations and polish the experience with features such as offline playback, caching, and downloading.

The result is my biggest personal project yet. I'm proud to introduce <soundgrammy-badge></soundgrammy-badge>

<div class="flex gap-2 justify-center w-full">
    <posts-image src="/images/soundgrammy-interface.png" alt="SoundGrammy interface" caption="SoundGrammy interface" class="h-70"></posts-image>
</div>

## SoundGrammy

So, **what is SoundGrammy**, and what does it currently offer?

- **Playlist creation and standard operations** such as deletion and editing, plus additional features including export (mainly for cross-device syncing for now), caching for offline listening in the app, and downloading, which also creates an `m3u8` file.
- **Queue display and management**: create playlists from the queue and modify it while listening by adding, removing, or reordering tracks.
- **Track and playlist filtering**, which works especially well with the next feature.
- **Bulk track operations!** You can cache, download, or add multiple selected tracks to a playlist.
- **Listening statistics**, "Likeness," and other metrics, plus "Popular," "Recent," and "Liked" playlists that you can hide.
- **All other essential features and nice enhancements**: different shuffles, MSE streaming, cache TTL and maximum-size settings, fullscreen mode (with artwork bounce), and much more!

What **SoundGrammy is not**:

- **It is not a music service** built around recommendations: you won't find "tracks you might like," Spotify's Smart Shuffle, or similar features. The app treats your saved tracks as your library and respects its boundaries.
- **It is not a replacement for Telegram clients**: you won't find chats or groups. The app only authenticates with Telegram and fetches your Saved Music. You also need the Telegram app to modify your Saved Music, or "All Tracks" in SoundGrammy. It is a companion, not a replacement.
- **It is not an official Telegram product**, and I am not affiliated with Telegram in any way. Although SoundGrammy uses MTProto, all its code is open source and its data is stored locally on your device. You should still be cautious about where you log in.
- Although Tauri apps can be compiled for all major modern platforms, **only macOS and Windows are currently supported**. I plan to add Android support, but that requires a compact version of the interface. iOS and Linux versions are not planned because I don't use those devices and can't test on them. However, you can always build the source yourself and test it, also contributions are welcome!

That said it solves all the issues I described:

- It is accessible **everywhere**. You can **cache and download** playlists for local playthrough or you can **stream** it from Telegram.
- You can listen **anything**. Telegram lets users to upload any audiofiles and add them to profile.
- It is as **context-independent** as it can be. Telegram is a stable base and it is most likely won't change it's policies.

I won't recommend that everyone try it, because I think something like Spotify is enough for most people. I created this app primarily for myself, but if my reasoning and the issues I've described resonate with you, you're welcome to try it!

## Summary

SoundGrammy does not try to replace Spotify or compete with every music service. It solves a narrower problem: turning Telegram’s Saved Music into a practical, local-friendly library with playlists, bulk operations, offline playback, downloads, and listening statistics.

I originally built it for myself, but I am releasing it in case someone else recognizes the same problems. If you want recommendations and an enormous licensed catalog, a conventional streaming service will probably serve you better. If you want more control over the music you have already chosen, SoundGrammy may be worth trying.
