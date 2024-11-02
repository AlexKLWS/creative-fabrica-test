"use server";

import { USERNAME_COOKIE_NAME } from "@/constants/cookies";
import { cookies } from "next/headers";

export async function deleteBookmark(postingId: number) {
  try {
    const urlBase = process.env.API_URL;
    if (!urlBase) {
      throw new Error("Missing API URL in env config!");
    }

    const requestCookies = await cookies();
    const username = requestCookies.get(USERNAME_COOKIE_NAME);
    if (!username) {
      throw new Error("Somehow username is missing!");
    }

    const result = await fetch(urlBase + "/bookmarks", {
      method: "DELETE",
      headers: {
        username: username.value,
      },
      body: JSON.stringify({ postingId }),
      cache: "no-store",
    });

    return { response: result.status === 200 };
  } catch (e) {
    console.log(
      "🚀 ~ file: deleteBookmark.ts ~ line 30 ~ deleteBookmark ~ e",
      e
    );
    return { error: e };
  }
}
