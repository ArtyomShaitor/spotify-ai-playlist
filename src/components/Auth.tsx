"use client";
import { Button } from "@/ui/Button";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useMemo } from "react";

export const AuthButton = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const supabase = useMemo(() => createClientComponentClient(), []);

  const onClick = async () => {
    if (isLoggedIn) {
      await supabase.auth.signOut();
      globalThis.location.reload();
      return;
    }

    await supabase.auth.signInWithOAuth({
      provider: "spotify",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        scopes: "playlist-modify-public playlist-modify-private",
      },
    });
  };

  return (
    <Button onClick={onClick}>
      {isLoggedIn ? "Sign Out" : "Login with Spotify"}
    </Button>
  );
};
