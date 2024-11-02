import { cookies } from "next/headers";

import { USERNAME_COOKIE_NAME } from "@/constants/cookies";

export default async function NameView() {
  const requestCookies = await cookies();
  const username = requestCookies.get(USERNAME_COOKIE_NAME);

  return (
    <div className="text-black text-lg ml-8">{`Hi ${username?.value}!`}</div>
  );
}
