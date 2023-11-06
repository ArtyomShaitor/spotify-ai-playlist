import OpenAI from "openai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { GENRES } from "./genres";

const { GPT_API_KEY } = process.env;

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
});

function jsonToQueryString(json: Record<string, any>) {
  return Object.keys(json)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
    .join("&");
}

const systemContent = `You're a helpful assistant that helps user to create a spotify playlist. You only can do this.
Your goal is to provide to user a list of 5 songs and list of up to 5 genres, which are based on provided description. Please respond only a list in JSON format:
${JSON.stringify({ name: "string", playlist: "string[]" }, null, 2)},
where "name" property is a name for playlist and "playlist" property is a songs array`;

const getSearchDataFromAI = async (description: string) => {
  return await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: `
          Please give me a list of 5 songs for this mood: ${description}.
        `,
      },
    ],
  });
};

export const POST = async (request: NextRequest) => {
  const { description } = await request.json();
  if (!description) {
    return NextResponse.json(
      { error: "Please provide description" },
      { status: 400 },
    );
  }

  const aiResponse = await getSearchDataFromAI(description);
  const list: { playlist: string[]; name: string } | false = JSON.parse(
    aiResponse?.choices[0]?.message?.content ?? "false",
  );
  if (!list) {
    return NextResponse.json({ error: "Please try again" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.getSession();
  const accessToken = data.session?.provider_token;

  const { playlist = [], name = "" } = list;
  const searchQuery = (song: string) => ({
    type: "track",
    q: `track:${song}`,
    market: "US",
    limit: 1,
  });

  // 1. Find IDS for each track
  let trackIds = await Promise.all(
    playlist.map(song =>
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
        .then(res => res?.tracks?.items[0] ?? {}),
    ),
  );

  trackIds = trackIds
    .map(({ name, id }) => ({ name, id }))
    .filter(({ id }) => id);
  trackIds = trackIds.map(({ id }) => id);

  const recomendationsQuery = {
    market: "US",
    seed_tracks: trackIds.slice(0, 5).join(","),
    limit: 30,
  };

  const recomendationsReq = await fetch(
    `https://api.spotify.com/v1/recommendations?${jsonToQueryString(
      recomendationsQuery,
    )}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  ).then(res => res.json());

  return NextResponse.json({
    data: { name, tracks: recomendationsReq.tracks },
  });
};
