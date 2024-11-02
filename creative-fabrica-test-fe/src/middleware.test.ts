import { describe, expect, it, jest } from "@jest/globals";
import { NextResponse } from "next/server";
import * as resolver from "@/lib/resolveIntermediateResponse";
import * as steps from "@/lib/middleware/steps";

import { middleware } from "./middleware";

jest.mock("next/server");
jest.mock("./lib/middleware/steps");
jest.mock("./lib/resolveIntermediateResponse");

describe("middleware", () => {
  it("returns NextResponse early if url contains 'icon'", async () => {
    const domain = "https://example.com";
    const redirectURL = new URL("/test/icon", domain);

    // @ts-expect-error overriding imports
    steps.clientRoutesMiddlewareSteps = [jest.fn()];

    const mockResponse: any = {};
    const mockRequest: any = {
      nextUrl: redirectURL,
    };

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse as any;
    });

    await expect(middleware(mockRequest)).resolves.toBe(mockResponse);
    expect(steps.clientRoutesMiddlewareSteps[0]).not.toHaveBeenCalled();
  });
  it("returns NextResponse early if url contains 'chrome'", async () => {
    const domain = "https://example.com";
    const redirectURL = new URL("/test/chrome", domain);

    // @ts-expect-error overriding imports
    steps.clientRoutesMiddlewareSteps = [jest.fn()];

    const mockResponse: any = {};
    const mockRequest: any = {
      nextUrl: redirectURL,
    };

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse as any;
    });

    await expect(middleware(mockRequest)).resolves.toBe(mockResponse);
    expect(steps.clientRoutesMiddlewareSteps[0]).not.toHaveBeenCalled();
  });
  it("calls steps.clientRoutesMiddlewareSteps, then passes intermediate response to resolveIntermediateResponse and returns NextResponse from it", async () => {
    const domain = "https://example.com";
    const redirectURL = new URL("/test", domain);

    const mockResponse: any = {};
    const mockRequest: any = {
      nextUrl: redirectURL,
    };

    const mockIntermediateResponse = {};

    // @ts-expect-error overriding imports
    steps.clientRoutesMiddlewareSteps = [jest.fn()];

    (
      steps.clientRoutesMiddlewareSteps[0] as jest.MockedFunction<
        (typeof steps.clientRoutesMiddlewareSteps)[0]
      >
    ).mockImplementation(async () => {
      return mockIntermediateResponse;
    });

    // @ts-expect-error
    resolver.resolveIntermediateResponse.mockImplementationOnce(
      (intermediateResponse: any) => {
        expect(intermediateResponse).toBe(mockIntermediateResponse);
        return mockResponse;
      }
    );

    await expect(middleware(mockRequest)).resolves.toBe(mockResponse);
    expect(steps.clientRoutesMiddlewareSteps[0]).toHaveBeenCalled();
    expect(resolver.resolveIntermediateResponse).toHaveBeenCalled();
  });
});
