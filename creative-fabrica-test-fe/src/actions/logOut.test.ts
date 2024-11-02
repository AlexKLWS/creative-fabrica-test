import { describe, expect, it, jest } from "@jest/globals";

import { cookies } from "next/headers";
import * as nextNavigation from "next/navigation";
import { logOut } from "./logOut";
import { USERNAME_COOKIE_NAME } from "@/constants/cookies";
import { AUTH_REDIRECT_PATH } from "@/constants/routes";

jest.mock("next/headers");
jest.mock("next/navigation");

describe("logOut server action", () => {
  it("calls cookies delete and then redirect with correct args", async () => {
    // @ts-expect-error overriding imports
    nextNavigation.redirect = jest.fn();

    (cookies as jest.Mock<typeof cookies>).mockImplementationOnce(() => {
      return Promise.resolve({
        delete: (cookieName: any) => {
          expect(cookieName).toEqual(USERNAME_COOKIE_NAME);
        },
      } as any);
    });
    await logOut();
    expect(nextNavigation.redirect).toBeCalledWith(AUTH_REDIRECT_PATH);
  });
});
