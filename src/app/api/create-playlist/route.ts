import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getSpotifyToken } from "../utils";

export const POST = async (request: NextRequest) => {
  const { tracksIds = [], name }: { tracksIds: string[]; name: string } =
    await request.json();

  if (tracksIds.length > 100) {
    return NextResponse.json(
      {
        error: "A maximum of 100 items can be added in one request",
      },
      { status: 400 },
    );
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase.auth.getSession();

  const spotifyUserId = data.session?.user.user_metadata.provider_id;
  const accessToken = await getSpotifyToken();

  const createPlaylistRequest = await fetch(
    `https://api.spotify.com/v1/users/${spotifyUserId}/playlists`,
    {
      method: "POST",
      body: JSON.stringify({
        name,
        description: "Created by SpotifAI",
        public: false,
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const createPlaylistResponse = await createPlaylistRequest.json();

  if (!createPlaylistRequest.ok) {
    return NextResponse.json(
      {
        error: "Something went wrong with playlist creation",
      },
      { status: 400 },
    );
  }

  const { id: playlistId } = createPlaylistResponse;

  const addTracksRequest = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      method: "POST",
      body: JSON.stringify({
        uris: tracksIds.map(id => `spotify:track:${id}`),
      }),
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const addTracksResponse = await addTracksRequest.json();

  if (!addTracksRequest.ok) {
    console.error(addTracksResponse);
    return NextResponse.json(
      {
        error: "Something went wrong with adding tracks",
      },
      { status: 400 },
    );
  }

  const url = createPlaylistResponse.uri;

  return NextResponse.json({ url });
};
