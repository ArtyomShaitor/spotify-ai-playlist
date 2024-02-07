import { cookies } from "next/headers";

interface RefreshSessionResponse {
  accessToken: string;
  expiresIn: number;
}
export const refreshSession = async (refreshToken: string) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID as string;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET as string;
  // @ts-ignore
  const authHeader = new Buffer.from(clientId + ":" + clientSecret).toString(
    "base64",
  );

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authHeader}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      // client_id: clientId,
      refresh_token: refreshToken,
    }),
  };

  const body = await fetch(url, payload);
  const { error, ...data } = await body.json();

  if (error) {
    throw new Error(error);
  }

  const { access_token, expires_in } = data;

  return {
    accessToken: access_token,
    expiresIn: expires_in,
  } as RefreshSessionResponse;
};

export const saveAccessTokenToCookie = (token: string) => {
  cookies().set("sp-at", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
};

export const saveRefreshTokenToCookie = (token: string) => {
  cookies().set("sp-rt", token, {
    expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
  });
};
