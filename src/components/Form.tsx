"use client";

import { useState } from "react";
import { TrackList, TrackType } from "./TrackList";
import { CreatePlaylistForm } from "./CreatePlaylistForm";
import { Button } from "@/ui/Button";

export const Form = () => {
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [name, setName] = useState<string>("");

  return (
    <div className="w-full flex flex-col gap-20 items-center">
      <CreatePlaylistForm
        onResponse={(name, tracks) => {
          setTracks(tracks);
          setName(name);
        }}
      />
      {tracks.length > 0 && <TrackList name={name} tracks={tracks} />}
    </div>
  );
};
