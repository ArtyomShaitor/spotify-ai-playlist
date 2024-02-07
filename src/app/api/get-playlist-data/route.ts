import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const { GPT_API_KEY } = process.env;
const MAX_SONGS = 30;

const openai = new OpenAI({
  apiKey: GPT_API_KEY,
});

const systemContent = (mood: string) =>
  `Based on an '${mood}' mood, generate a list of up to ${MAX_SONGS} track names with their respective artists. Respond me only in a JSON structure: ${JSON.stringify(
    { name: "string", playlist: "string[]" },
    null,
    2,
  )}, where "name" property is a name for playlist and "playlist" property is a songs array.`;

const getSearchDataFromAI = async (description: string) => {
  try {
    const data = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You're a helpful assistant that helps user to create a spotify playlist",
        },
        {
          role: "user",
          content: systemContent(description),
        },
      ],
    });

    return { data, error: null };
  } catch (e) {
    console.error(111, e);
    // @ts-ignore
    const { code, message } = e?.error ?? {
      code: 500,
      message: "Something went wrong",
    };
    return { error: { code, message }, data: null };
  }
};

export const POST = async (request: NextRequest) => {
  const { description } = await request.json();
  if (!description) {
    return NextResponse.json(
      { error: "Please provide description" },
      { status: 400 },
    );
  }

  const { data: aiResponse, error: aiError } =
    await getSearchDataFromAI(description);

  if (aiError) {
    return NextResponse.json({ error: aiError }, { status: aiError.code });
  }

  const list: { playlist: string[]; genres: string[]; name: string } | false =
    JSON.parse(aiResponse?.choices[0]?.message?.content ?? "false");

  if (!list) {
    return NextResponse.json({ error: "Please try again" }, { status: 400 });
  }

  const { playlist = [], name = "" } = list;

  return NextResponse.json({
    data: { name, playlist: playlist ?? [] },
  });
};
