import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { USERNAME_COOKIE_NAME } from "@/constants/cookies";
import { HOME_REDIRECT_PATH } from "@/constants/routes";

export default function Component() {
  async function logIn(formData: FormData) {
    "use server";

    const username = formData.get("username");
    if (username) {
      const requestCookies = await cookies();
      requestCookies.set(USERNAME_COOKIE_NAME, username.toString());
      redirect(HOME_REDIRECT_PATH);
    }
  }

  return (
    <div className="py-12 px-4">
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <CardTitle>Enter your username</CardTitle>
          <CardDescription>
            Can be anything as long as you don't forget it. Username is used to
            load data relevant to you.
          </CardDescription>
        </CardHeader>
        <form action={logIn}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name={"username"}
                  placeholder="Your unique username"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant={"outline"}>Log In</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
