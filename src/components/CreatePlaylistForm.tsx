"use client";

import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { SmallText, Text } from "@/ui/Text";
import { memo } from "react";

interface CreatePlaylistFormProps {
  value: string;
  setValue: (value: string) => void;
  onClick: () => void;
  isLoading?: boolean;
  showTooLongMessage?: boolean;
}

export const CreatePlaylistForm = memo(function CreatePlaylistForm({
  value,
  setValue,
  isLoading = false,
  onClick,
  showTooLongMessage = false,
}: CreatePlaylistFormProps) {
  return (
    <div className="max-w-lg w-full flex flex-col items-center gap-y-2">
      <div className="w-full flex justify-center gap-2">
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
      {showTooLongMessage && (
        <SmallText>
          Generating a playlist could take a while. Please do not close the page
        </SmallText>
      )}
    </div>
  );
});
