"use client";
import { Button } from "@/ui/Button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMemo } from "react";

export const AuthButton = () => {
  const supabase = useMemo(() => createClientComponentClient(), []);

  const onClick = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        scopes: "playlist-modify-public playlist-modify-private",
      },
    });
  };

  return <Button onClick={onClick}>Login with Spotify</Button>;
};
