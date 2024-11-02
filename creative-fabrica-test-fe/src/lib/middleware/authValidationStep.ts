import { NextRequest } from "next/server";
import { IntermediateResponse, MiddlewareStep } from "@/types/MiddlewareStep";

import { HOME_REDIRECT_PATH, AUTH_REDIRECT_PATH } from "@/constants/routes";
import { USERNAME_COOKIE_NAME } from "@/constants/cookies";

export const authValidationStep: MiddlewareStep = async (
  request: NextRequest,
  currentResponse: IntermediateResponse
) => {
  let nextUrl =
    currentResponse.redirectURL?.pathname || request.nextUrl.pathname;

  if (!request.cookies.has(USERNAME_COOKIE_NAME)) {
    if (nextUrl !== AUTH_REDIRECT_PATH) {
      currentResponse.redirectURL = new URL(AUTH_REDIRECT_PATH, request.url);
    }
  } else if (nextUrl !== HOME_REDIRECT_PATH) {
    currentResponse.redirectURL = new URL(HOME_REDIRECT_PATH, request.url);
  }

  return currentResponse;
};
