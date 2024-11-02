import { describe, expect, it, jest } from "@jest/globals";
import { NextResponse } from "next/server";

import { authValidationStep } from "./authValidationStep";
import { HOME_REDIRECT_PATH, AUTH_REDIRECT_PATH } from "@/constants/routes";

jest.mock("next/server");

describe("authValidationStep, a middleware step function designed to be chained with other steps", () => {
  it("returns IntermediateResponse object passed to it as 2nd argument", async () => {
    const domain = "https://example.com";
    const redirectURL = new URL(HOME_REDIRECT_PATH, domain);

    const mockResponse: any = {
      nextUrl: redirectURL,
      url: redirectURL,
      cookies: { has: () => true },
    };
    const mockIntermediateResponse = {};

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse;
    });

    await expect(
      authValidationStep(mockResponse, mockIntermediateResponse)
    ).resolves.toBe(mockIntermediateResponse);
  });
  it("returns IntermediateResponse object with redirectUrl pointing to AUTH_REDIRECT_PATH if cookie is missing", async () => {
    const domain = "https://example.com";
    const redirectURL = new URL(HOME_REDIRECT_PATH, domain);

    const mockResponse: any = {
      nextUrl: redirectURL,
      url: redirectURL,
      cookies: { has: () => false },
    };
    const mockIntermediateResponse = {};

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse;
    });

    await expect(
      authValidationStep(mockResponse, mockIntermediateResponse)
    ).resolves.toEqual({ redirectURL: new URL(AUTH_REDIRECT_PATH, domain) });
  });
  it("returns IntermediateResponse object with redirectUrl pointing to HOME_REDIRECT_PATH if cookie is present but nextUrl is not HOME_REDIRECT_PATH", async () => {
    const domain = "https://example.com";
    const redirectURL = new URL("/test", domain);

    const mockResponse: any = {
      nextUrl: redirectURL,
      url: redirectURL,
      cookies: { has: () => true },
    };
    const mockIntermediateResponse = {};

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse;
    });

    await expect(
      authValidationStep(mockResponse, mockIntermediateResponse)
    ).resolves.toEqual({ redirectURL: new URL(HOME_REDIRECT_PATH, domain) });
  });
});
