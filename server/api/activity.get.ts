import { existsSync, readFileSync } from "node:fs";

function localKey(name: string) {
  if (!existsSync(".env.local")) return "";
  const line = readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .find(entry => entry.startsWith(name + "="));
  return line?.slice(name.length + 1).replace(/^["']|["']$/g, "") || "";
}

interface RecentTrack {
  name?: string;
  artist?: { "#text"?: string };
  album?: { "#text"?: string };
  url?: string;
  image?: { "#text"?: string; size?: string }[];
  "@attr"?: { nowplaying?: string };
}

interface LastFmResponse {
  recenttracks?: { track?: RecentTrack | RecentTrack[] };
}

interface SteamResponse {
  response?: { players?: { gameextrainfo?: string; gameid?: string; personaname?: string }[] };
}

export default defineCachedEventHandler(async () => {
  const config = useRuntimeConfig();
  const lastfmApiKey = config.lastfmApiKey || localKey("NUXT_LASTFM_API_KEY");
  const lastfmUsername = config.lastfmUsername || localKey("NUXT_LASTFM_USERNAME");
  const steamApiKey = config.steamApiKey || localKey("NUXT_STEAM_API_KEY");
  const steamId = config.steamId || localKey("NUXT_STEAM_ID");
  const lastFmRequest = lastfmApiKey && lastfmUsername
    ? $fetch<LastFmResponse>("https://ws.audioscrobbler.com/2.0/", {
        query: {
          method: "user.getrecenttracks",
          user: lastfmUsername,
          api_key: lastfmApiKey,
          format: "json",
          limit: 1,
        },
        timeout: 5000,
      })
    : Promise.resolve(null);
  const steamRequest = steamApiKey && steamId
    ? $fetch<SteamResponse>("https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/", {
        query: { key: steamApiKey, steamids: steamId },
        timeout: 5000,
      })
    : Promise.resolve(null);

  const [lastFm, steam] = await Promise.allSettled([lastFmRequest, steamRequest]);
  const trackData = lastFm.status === "fulfilled" ? lastFm.value?.recenttracks?.track : undefined;
  const track = Array.isArray(trackData) ? trackData[0] : trackData;
  const player = steam.status === "fulfilled" ? steam.value?.response?.players?.[0] : undefined;

  return {
    musicAvailable: lastFm.status === "fulfilled" && !!lastFm.value?.recenttracks,
    gameAvailable: steam.status === "fulfilled" && !!steam.value?.response,
    music: track?.name && track.artist?.["#text"]
      ? {
          title: track.name,
          artist: track.artist["#text"],
          album: track.album?.["#text"] || "",
          image: track.image?.find(image => image.size === "large")?.["#text"] || "",
          url: track.url || `https://www.last.fm/user/${encodeURIComponent(lastfmUsername)}`,
          live: track["@attr"]?.nowplaying === "true",
        }
      : null,
    game: player?.gameextrainfo
      ? {
          title: player.gameextrainfo,
          url: `https://steamcommunity.com/profiles/${encodeURIComponent(steamId)}`,
          live: true,
        }
      : null,
    steamUrl: steamId ? `https://steamcommunity.com/profiles/${encodeURIComponent(steamId)}` : "https://steamcommunity.com/id/rastuharem",
    lastFmUrl: lastfmUsername ? `https://www.last.fm/user/${encodeURIComponent(lastfmUsername)}` : "https://www.last.fm",
  };
}, { maxAge: 45, swr: true, name: "current-activity" });
