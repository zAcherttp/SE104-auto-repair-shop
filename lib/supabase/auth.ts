import { createClient } from "./server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
}

export async function requireAuth(locale: string = "en") {
  const { user } = await getUser();

  if (!user) {
    redirect(`/${locale}`);
  }

  return user;
}

export async function requireNoAuth(locale: string = "en") {
  const { user } = await getUser();

  if (user) {
    redirect(`/${locale}/home`);
  }

  return null;
}

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return { session, error };
}
