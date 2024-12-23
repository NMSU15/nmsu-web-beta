'use client';
import { useSession } from "next-auth/react";

export function session() {
  const { data: session } = useSession();

  if (!session) {
    return null; // or show loading or sign-in prompt
  }

  const { name, email, id } = session.user; // Adjust these keys based on your session structure

  return { name, email, id };
}
