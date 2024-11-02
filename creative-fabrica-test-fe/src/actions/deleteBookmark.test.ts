import { describe, expect, it, jest } from "@jest/globals";
import { deleteBookmark } from "./deleteBookmark";

import { cookies } from "next/headers";

jest.mock("next/headers");

const originalEnvs = process.env;
const originalConsole = global.console;
const originalFetch = global.fetch;

describe("deleteBookmark server action", () => {
  beforeAll(() => {
    global.console = {
      ...console,
      log: jest.fn(),
    };
    global.fetch = jest.fn() as jest.Mock<typeof global.fetch>;
  });
  afterAll(() => {
    global.console = originalConsole;
    process.env = originalEnvs;
    global.fetch = originalFetch;
  });
  beforeEach(() => {
    // @ts-expect-error
    process.env = { API_URL: "https://example.com" };
  });
  it("returns error if API_URL is missing", async () => {
    // @ts-expect-error
    process.env = { API_URL: null };

    const result = await deleteBookmark(1);

    expect(result).toHaveProperty("error");
    expect(result).not.toHaveProperty("response");
  });
  it("returns error if username cookie is missing", async () => {
    (cookies as jest.MockedFunction<typeof cookies>).mockImplementationOnce(
      () => {
        return Promise.resolve({ get: () => false } as any);
      }
    );

    const result = await deleteBookmark(1);

    expect(result).toHaveProperty("error");
    expect(result).not.toHaveProperty("response");
  });
  it("calls fetch with correct path", async () => {
    const mockPostingId = 1;
    const mockUsernameCookie = {
      value: "name",
    };
    const mockResponse = { status: 200 };

    let callPath;

    const urlBase = process.env.API_URL;
    (global.fetch as jest.Mock<typeof global.fetch>).mockImplementationOnce(
      (path, options) => {
        callPath = path;
        return Promise.resolve(mockResponse as any);
      }
    );

    (cookies as jest.MockedFunction<typeof cookies>).mockImplementationOnce(
      () => {
        return Promise.resolve({ get: () => mockUsernameCookie } as any);
      }
    );

    await deleteBookmark(mockPostingId);

    expect(fetch).toBeCalled();
    expect(callPath).toEqual(urlBase + "/bookmarks");
  });
  it("calls fetch with correct options", async () => {
    const mockPostingId = 1;
    const mockUsernameCookie = {
      value: "name",
    };
    const mockResponse = { status: 200 };

    let callOptions;

    (global.fetch as jest.Mock<typeof global.fetch>).mockImplementationOnce(
      (path, options) => {
        callOptions = options;
        return Promise.resolve(mockResponse as any);
      }
    );

    (cookies as jest.MockedFunction<typeof cookies>).mockImplementationOnce(
      () => {
        return Promise.resolve({ get: () => mockUsernameCookie } as any);
      }
    );

    await deleteBookmark(mockPostingId);

    expect(fetch).toBeCalled();
    expect(callOptions).toEqual({
      method: "DELETE",
      headers: {
        username: mockUsernameCookie.value,
      },
      body: JSON.stringify({ postingId: mockPostingId }),
      cache: "no-store",
    });
  });
  it("returns {response: true} if fetch call response status code is 200", async () => {
    const mockPostingId = 1;
    const mockUsernameCookie = {
      value: "name",
    };
    const mockResponse = { status: 200 };

    (global.fetch as jest.Mock<typeof global.fetch>).mockImplementationOnce(
      (path, options) => {
        return Promise.resolve(mockResponse as any);
      }
    );

    (cookies as jest.MockedFunction<typeof cookies>).mockImplementationOnce(
      () => {
        return Promise.resolve({ get: () => mockUsernameCookie } as any);
      }
    );

    const result = await deleteBookmark(mockPostingId);

    expect(result.response).toEqual(true);
  });
  it("returns {response: false} if fetch call response status code is not 200", async () => {
    const mockPostingId = 1;
    const mockUsernameCookie = {
      value: "name",
    };
    const mockResponse = { status: 500 };

    global.fetch = jest.fn((path, options) => {
      return Promise.resolve(mockResponse as any);
    }) as jest.Mock<typeof global.fetch>;

    (cookies as jest.MockedFunction<typeof cookies>).mockImplementationOnce(
      () => {
        return Promise.resolve({ get: () => mockUsernameCookie } as any);
      }
    );

    const result = await deleteBookmark(mockPostingId);

    expect(result.response).toEqual(false);
  });
});
