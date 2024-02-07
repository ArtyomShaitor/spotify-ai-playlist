import type { TrackType } from "@/components/TrackList";
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyToken } from "../utils";

function jsonToQueryString(json: Record<string, any>) {
  return Object.keys(json)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
    .join("&");
}

const searchQuery = (song: string) => ({
  type: "track",
  q: `track:${song}`,
  market: "US",
  limit: 1,
});

export const POST = async (request: NextRequest) => {
  const { names }: { names: string[] | undefined } = await request.json();
  if (!names || !names.length) {
    return NextResponse.json(
      { error: "Please provide the song names" },
      { status: 400 },
    );
  }

  const accessToken = await getSpotifyToken();

  const maybeTracks: TrackType[] | null = await Promise.all(
    names.map(song =>
      fetch(
        `https://api.spotify.com/v1/search?${jsonToQueryString(
          searchQuery(song),
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
        .then(res => res.json())
        .then(res => res?.tracks?.items[0] ?? null),
    ),
  );

  const tracks = maybeTracks.filter(Boolean);

  return NextResponse.json({
    data: { tracks },
  });
};
