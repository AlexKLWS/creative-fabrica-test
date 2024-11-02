"use server";

import { USERNAME_COOKIE_NAME } from "@/constants/cookies";
import { AUTH_REDIRECT_PATH } from "@/constants/routes";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logOut() {
  const requestCookies = await cookies();
  requestCookies.delete(USERNAME_COOKIE_NAME);
  redirect(AUTH_REDIRECT_PATH);
}
