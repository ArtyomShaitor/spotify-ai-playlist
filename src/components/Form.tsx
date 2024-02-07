"use client";

import _chunk from "lodash/chunk";
import { useState } from "react";
import { TrackList, TrackType } from "./TrackList";
import { CreatePlaylistForm } from "./CreatePlaylistForm";

const CHUNK_SIZE = 5;

const getPlaylistData = (description: string) =>
  fetch("/api/get-playlist-data", {
    method: "POST",
    body: JSON.stringify({ description }),
  });

const getTrackDetails = (names: string[]) =>
  fetch("/api/get-track-details", {
    method: "POST",
    body: JSON.stringify({ names }),
  });

export const Form = () => {
  const [isLoading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<TrackType[]>([]);
  const [description, setDescription] = useState<string>("");
  const [playlistName, setPlaylistName] = useState<string>("");

  const onClick = async () => {
    setLoading(true);
    const response = await getPlaylistData(description);

    const { data, error } = await response.json();
    if (error || !data?.playlist?.length) {
      alert("Something went wrong, please try again later");
    }

    if (data) {
      const { playlist, name }: { playlist: string[]; name: string } = data;
      setPlaylistName(name);
      const playlistChunks = _chunk(playlist, CHUNK_SIZE);
      for (let chunk of playlistChunks) {
        const newTracks: TrackType[] = await getTrackDetails(chunk)
          .then(response => response.json())
          .then(({ data }) => data.tracks ?? []);

        setTracks(oldTracks => [...oldTracks, ...newTracks]);
      }
    }

    setLoading(false);
  };

  return (
    <div className="w-full flex flex-col gap-20 items-center">
      <CreatePlaylistForm
        value={description}
        setValue={setDescription}
        isLoading={isLoading}
        onClick={onClick}
        showTooLongMessage={isLoading && !tracks.length}
      />
      {tracks.length > 0 && <TrackList name={playlistName} tracks={tracks} />}
    </div>
  );
};
