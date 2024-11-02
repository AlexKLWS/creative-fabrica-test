import { describe, expect, it, jest } from "@jest/globals";
import { NextResponse } from "next/server";

import { resolveIntermediateResponse } from "./resolveIntermediateResponse";

jest.mock("next/server");

describe("resolveIntermediateResponse helper function", () => {
  it("returns NextResponse object", () => {
    const mockResponse: any = {};

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse;
    });

    expect(resolveIntermediateResponse({})).toBe(mockResponse);
  });
  it("returns response with redirect if redirectURL is specified", () => {
    const domain = "https://example.com";
    const redirectURL = new URL("/some-path", domain);

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return {} as any;
    });

    const mockRedirectResponse = {};
    (
      NextResponse.redirect as jest.MockedFunction<typeof NextResponse.redirect>
    ).mockImplementationOnce((_) => {
      return mockRedirectResponse as any;
    });
    expect(
      resolveIntermediateResponse({
        redirectURL,
      })
    ).toBe(mockRedirectResponse);
    expect(NextResponse.redirect).toBeCalledWith(redirectURL);
  });
  it("adds cookies if addCookies dictionary has any values", () => {
    const addCookieName1 = "test1Key";
    const addCookieValue1 = "test1";
    const addCookieName2 = "test2Key";
    const addCookieValue2 = "test2";

    const mockSet = jest.fn<any>();

    const mockResponse: any = {
      cookies: {
        set: mockSet,
      },
    };

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse;
    });
    expect(
      resolveIntermediateResponse({
        addCookies: {
          [addCookieName1]: addCookieValue1,
          [addCookieName2]: addCookieValue2,
        },
      })
    ).toBe(mockResponse);
    expect(mockSet).toBeCalledWith(addCookieName1, addCookieValue1);
    expect(mockSet).toBeCalledWith(addCookieName2, addCookieValue2);
  });
  it("removes cookies if removeCookies array has any values", () => {
    const removeCookieName1 = "test1";
    const removeCookieName2 = "test2";

    const mockDelete = jest.fn<any>();

    const mockResponse: any = {
      cookies: {
        delete: mockDelete,
      },
    };

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse;
    });

    expect(
      resolveIntermediateResponse({
        removeCookies: [removeCookieName1, removeCookieName2],
      })
    ).toBe(mockResponse);
    expect(mockDelete).toBeCalledWith(removeCookieName1);
    expect(mockDelete).toBeCalledWith(removeCookieName2);
  });
  it("adds headers if headers dictionary has any values", () => {
    const addHeaderName1 = "test1Key";
    const addHeaderValue1 = "test1";
    const addHeaderName2 = "test2Key";
    const addHeaderValue2 = "test2";

    const mockSet = jest.fn<any>();

    const mockResponse: any = {
      headers: {
        set: mockSet,
      },
    };

    (
      NextResponse.next as jest.MockedFunction<typeof NextResponse.next>
    ).mockImplementationOnce(() => {
      return mockResponse;
    });
    expect(
      resolveIntermediateResponse({
        headers: {
          [addHeaderName1]: addHeaderValue1,
          [addHeaderName2]: addHeaderValue2,
        },
      })
    ).toBe(mockResponse);
    expect(mockSet).toBeCalledWith(addHeaderName1, addHeaderValue1);
    expect(mockSet).toBeCalledWith(addHeaderName2, addHeaderValue2);
  });
});
