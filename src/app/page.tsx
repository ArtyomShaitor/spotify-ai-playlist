import { AuthButton } from "@/components/Auth";
import { Form } from "@/components/Form";
import { Headline } from "@/ui/Headline";
import { Text } from "@/ui/Text";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoggedIn = !!session?.user;

  return (
    <main className="flex flex-col gap-8 items-center justify-between">
      <div className="flex flex-col gap-4 items-center justify-between pt-24">
        <Headline className="text-5xl">
          SpotifAI - Spotify AI Playlist Creator
        </Headline>
        <Text>Create your playlist only by your current mood</Text>
      </div>
      <AuthButton isLoggedIn={isLoggedIn} />
      {isLoggedIn && <Form />}
    </main>
  );
}
