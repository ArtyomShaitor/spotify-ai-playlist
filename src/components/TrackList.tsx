"use client";
import { Button } from "@/ui/Button";
import { Headline } from "@/ui/Headline";
import Image from "next/image";
import { useState } from "react";

export interface TrackType {
  album: {
    images: Array<{ height: number; url: string }>;
    name: string;
  };
  artists: Array<{
    name: string;
  }>;
  external_urls: {
    spotify: string;
  };
  id: string;
  name: string;
  explicit: boolean;
}

interface TrackListProps {
  tracks: TrackType[];
  name: string;
}

interface TrackProps {
  image: TrackType["album"]["images"][number];
  artists: TrackType["artists"];
  name: string;
  isExplicit?: boolean;
}

const Explicit = () => {
  return (
    <div className="w-4 h-4 rounded-sm flex text-sm font-bold items-center justify-center text-gray-950 bg-gray-400">
      E
    </div>
  );
};

const Track = ({ name, image, artists, isExplicit = false }: TrackProps) => {
  return (
    <li className="flex items-center py-4">
      <Image
        src={image.url}
        alt="album cover"
        className="w-12 h-12 mr-4 rounded-md"
        width={150}
        height={150}
      />
      <div>
        <div className="flex items-center gap-1.5">
          {isExplicit && <Explicit />}
          <p className="font-semibold">{name}</p>
        </div>
        <p className="text-gray-400">
          {artists.map(artist => artist.name).join(", ")}
        </p>
      </div>
    </li>
  );
};

export const TrackList = ({ name, tracks }: TrackListProps) => {
  const [playlistUrl, setPlaylistUrl] = useState<string>();
  const [isLoading, setLoading] = useState(false);

  const create = async () => {
    setLoading(true);
    const request = await fetch("/api/create-playlist", {
      method: "POST",
      body: JSON.stringify({
        tracksIds: tracks.map(track => track.id),
        name,
      }),
    });

    const response = await request.json();
    setPlaylistUrl(response.url);
    setLoading(false);
  };

  return (
    <div className="w-full bg-gray-950 text-white px-8 py-8">
      <div className="max-w-lg mx-auto flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Headline as="h2">{name}</Headline>
          <Button
            className="w-fit px-4 py-1 bg-green-500 rounded-full hover:bg-green-600 hover:text-white"
            onClick={playlistUrl ? undefined : create}
            href={playlistUrl}
            isDisabled={isLoading}
          >
            {isLoading
              ? "Creating..."
              : playlistUrl
              ? "Open Playlist"
              : "Create Playlist"}
          </Button>
        </div>
        <ul className="divide-y divide-gray-700">
          {tracks.map(track => (
            <Track
              key={track.id}
              image={track.album.images[0]}
              artists={track.artists}
              name={track.name}
              isExplicit={track.explicit}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
