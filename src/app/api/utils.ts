import {
  refreshSession,
  saveAccessTokenToCookie,
  saveRefreshTokenToCookie,
} from "@/services/spotify/auth";
import { cookies } from "next/headers";

export const getSpotifyToken = async () => {
  let accessToken = cookies().get("sp-at")?.value ?? "";
  if (!accessToken) {
    const refreshToken = cookies().get("sp-rt")?.value ?? "";
    const res = await refreshSession(refreshToken ?? "");
    accessToken = res.accessToken;
    saveAccessTokenToCookie(accessToken);
    saveRefreshTokenToCookie(refreshToken);
  }

  return accessToken;
};
