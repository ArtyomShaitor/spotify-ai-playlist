"use client";

import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { useState } from "react";
import { TrackType } from "./TrackList";

interface CreatePlaylistFormProps {
  onResponse: (name: string, tracks: TrackType[]) => void;
}

export const CreatePlaylistForm = ({ onResponse }: CreatePlaylistFormProps) => {
  const [value, setValue] = useState("");
  const [isLoading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const response = await fetch("/api/get-tracks", {
      method: "POST",
      body: JSON.stringify({ description: value }),
    });

    const {
      data: { tracks, name },
    } = (await response.json()) || [];

    onResponse(name, tracks);
    setLoading(false);
  };

  return (
    <div className="max-w-lg w-full flex justify-center gap-2">
      <Input
        className="flex-1"
        placeholder="Enter your mood"
        value={value}
        onChange={setValue}
        isDisabled={isLoading}
      />
      <Button onClick={onClick} isDisabled={isLoading}>
        {isLoading ? "Generating..." : "Get Tracks"}
      </Button>
    </div>
  );
};
