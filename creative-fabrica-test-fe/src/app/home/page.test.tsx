import { describe, expect, it, jest } from "@jest/globals";
import { http, HttpResponse } from "msw";
import { cookies } from "next/headers";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { server } from "@/mocks/node";
import {
  BOOKMARK_BUTTON_ICON_TEST_ID,
  BOOKMARK_BUTTON_LOADER_TEST_ID,
  BOOKMARK_BUTTON_TEST_ID,
  LOGOUT_BUTTON_TEST_ID,
  PRODUCT_CARD_TEST_ID,
  PRODUCT_LOADER_CARD_TEST_ID,
} from "@/constants/testIds";
import * as logoutAction from "@/actions/logOut";
import * as addBookmarkAction from "@/actions/addBookmark";
import * as deleteBookmarkAction from "@/actions/deleteBookmark";
import Component from "./page";

const mockProduct = {
  id: 1,
  title: "Elegant Wedding Fonts",
  description:
    "Elegant Wedding Fonts are perfect for invitations, branding, and stylish designs, bringing a touch of sophistication to any project.",
  price: 19,
  category: "Fonts",
  imageUrl: "https://picsum.photos/id/101/500/450",
  isBookmarked: false,
  createdBy: {
    id: 1,
    name: "Catherine",
    avatarImageUrl: "/placeholder-user.jpg",
  },
};

jest.mock("@/actions/logOut");
jest.mock("next/headers");
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

const originalEnvs = process.env;

const originalIntersectionObserver = global.IntersectionObserver;
const originalConsole = global.console;

const TEST_USERNAME = "test";

describe("home page component", () => {
  // Setup
  beforeAll(() => {
    // There're a lot of irrelevant console logs printed during the execution of this code,
    // such as "Warning: async/await is not yet supported in Client Components, only Server Components"
    // as mentioned here: https://github.com/testing-library/react-testing-library/issues/1209#issuecomment-1569813305
    // because of this I'm overriding console to keep the output clean
    global.console = {
      ...console,
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    class IntersectionObserver {
      root = null;
      rootMargin = "";
      thresholds = [];

      disconnect() {
        return null;
      }

      observe() {
        return null;
      }

      takeRecords() {
        return [];
      }

      unobserve() {
        return null;
      }
    }
    window.IntersectionObserver = IntersectionObserver;
    global.IntersectionObserver = IntersectionObserver;
    // @ts-expect-error
    process.env = { API_URL: "https://example.com" };
    server.listen();
  });
  beforeEach(() => {
    (cookies as jest.Mock<typeof cookies>).mockImplementation(() => {
      return {
        get: (cookieName: any) => {
          return { value: TEST_USERNAME };
        },
      } as any;
    });
  });
  afterEach(() => {
    server.resetHandlers();
  });
  afterAll(() => {
    server.close();
    global.console = originalConsole;
    process.env = originalEnvs;
    window.IntersectionObserver = originalIntersectionObserver;
    global.IntersectionObserver = originalIntersectionObserver;
  });

  // Actual tests
  it("displays greeting with username from the cookie", async () => {
    render(<Component />);
    await waitFor(async () => {
      const greetingComponent = await screen.queryByText(
        `Hi ${TEST_USERNAME}!`
      );
      expect(greetingComponent).not.toBeNull();
    });
  });
  it("displays logout button", async () => {
    render(<Component />);
    const logoutButton = await screen.queryByTestId(LOGOUT_BUTTON_TEST_ID);
    expect(logoutButton).not.toBeNull();
  });
  it("calls logOut server action if logout button is pressed", async () => {
    // @ts-expect-error overriding import
    logoutAction.logOut = jest.fn();

    render(<Component />);

    fireEvent.click(screen.getByTestId(LOGOUT_BUTTON_TEST_ID));

    expect(logoutAction.logOut).toBeCalled();
  });
  it("renders 3 loading cards while request is being made", async () => {
    render(<Component />);
    const cardComponent = await screen.getAllByTestId(
      PRODUCT_LOADER_CARD_TEST_ID
    );
    expect(cardComponent).toHaveLength(3);
  });
  it("renders 10 posting cards (for each mock posting) after request succeeds", async () => {
    render(<Component />);
    // We need to wait for the response promise to be resolved and for React to render the
    // elements inside Suspense
    await waitFor(() =>
      // There 10 elements in JSON array in the msw-intercepted mock response in @/mocks/handlers
      expect(screen.queryAllByTestId(PRODUCT_CARD_TEST_ID)).toHaveLength(10)
    );
  });
  it("displays error message if response.response is empty", async () => {
    server.use(
      http.get("https://example.com/products", () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    render(<Component />);
    // We need to wait for the response promise to be resolved and for React to render the
    // elements inside Suspense
    await waitFor(async () => {
      await expect(screen.queryAllByTestId(PRODUCT_CARD_TEST_ID)).toHaveLength(
        0
      );
      const errorComponent = await screen.queryByText(
        "Unexpected end of JSON input"
      );
      expect(errorComponent).not.toBeNull();
    });
  });
  it("calls addBookmark server action when bookmark button on a card that hasn't been bookmarked yet is pressed", async () => {
    const originalAddBookmark = addBookmarkAction.addBookmark;
    // @ts-expect-error overriding import
    addBookmarkAction.addBookmark = jest.fn();
    render(<Component />);
    await waitFor(async () => {
      // getting all cards
      const postingCards = screen.queryAllByTestId(PRODUCT_CARD_TEST_ID);
      // getting bookmark button on the first card
      const bookmarkButton = within(postingCards[0]).getByTestId(
        BOOKMARK_BUTTON_TEST_ID
      );

      // press the button
      fireEvent.click(bookmarkButton);
    });
    expect(addBookmarkAction.addBookmark).toBeCalled();
    // @ts-expect-error overriding import
    addBookmarkAction.addBookmark = originalAddBookmark;
  });
  // This one is a bit tricky
  it("updates bookmark icon to be filled if the posting is bookmarked", async () => {
    render(<Component />);
    // We store this reference outside of waitFor closure scope because we need to call waitFor 2 times, and we can't
    // nest waitFors because the nested waitFor will be simply skipped
    let bookmarkButton: any;
    await waitFor(async () => {
      // getting all cards
      const postingCards = screen.queryAllByTestId(PRODUCT_CARD_TEST_ID);
      // getting bookmark button on the first card
      bookmarkButton = within(postingCards[0]).getByTestId(
        BOOKMARK_BUTTON_TEST_ID
      );
      // expect the fill-opacitiy of the bookmark icon to be 0 as the isBookmarked prop on the posting JSON object is false
      expect(
        within(bookmarkButton).queryByTestId(BOOKMARK_BUTTON_ICON_TEST_ID)
        //@ts-expect-error
      ).toHaveAttribute("fill-opacity", "0");
      // press the button
      fireEvent.click(bookmarkButton);
      // after the button is pressed a loader should appear
      await expect(
        within(bookmarkButton).queryByTestId(BOOKMARK_BUTTON_LOADER_TEST_ID)
      ).not.toBeNull();
    });
    // We wait for the component to re-render after the addBookmark server action promise resolves
    await waitFor(async () =>
      // expect the fill-opacitiy of the bookmark icon to be 1 as the request is intercepted by msw and always resolves successfully
      expect(
        within(bookmarkButton).queryByTestId(BOOKMARK_BUTTON_ICON_TEST_ID)
        //@ts-expect-error
      ).toHaveAttribute("fill-opacity", "1")
    );
  });
  it("calls deleteBookmark server action when bookmark button on a card that has already been bookmarked is pressed", async () => {
    server.use(
      http.get("https://example.com/products", () => {
        return HttpResponse.json([mockProduct]);
      })
    );
    const originalDeleteBookmark = deleteBookmarkAction.deleteBookmark;
    // @ts-expect-error overriding import
    deleteBookmarkAction.deleteBookmark = jest.fn();
    render(<Component />);
    await waitFor(async () => {
      // getting all cards
      const postingCards = screen.queryAllByTestId(PRODUCT_CARD_TEST_ID);
      // getting bookmark button on the first card
      const bookmarkButton = within(postingCards[0]).getByTestId(
        BOOKMARK_BUTTON_TEST_ID
      );

      // press the button
      fireEvent.click(bookmarkButton);
    });
    expect(deleteBookmarkAction.deleteBookmark).toBeCalled();
    // @ts-expect-error overriding import
    deleteBookmarkAction.deleteBookmark = originalDeleteBookmark;
  });
  // The same thing as with the test above previous one, only bookmark should be removed and fill should change from 1 to 0
  it("updates bookmark icon to have empty fill if the posting bookmark is deleted", async () => {
    server.use(
      http.get("https://example.com/products", () => {
        return HttpResponse.json([mockProduct]);
      })
    );
    render(<Component />);
    let bookmarkButton: any;
    await waitFor(async () => {
      const postingCards = screen.queryAllByTestId(PRODUCT_CARD_TEST_ID);
      bookmarkButton = within(postingCards[0]).getByTestId(
        BOOKMARK_BUTTON_TEST_ID
      );
      // expect the fill-opacitiy of the bookmark icon to be 0 as the isBookmarked prop on the posting JSON object is true
      expect(
        within(bookmarkButton).queryByTestId(BOOKMARK_BUTTON_ICON_TEST_ID)
        //@ts-expect-error
      ).toHaveAttribute("fill-opacity", "1");
      fireEvent.click(bookmarkButton);
      await expect(
        within(bookmarkButton).queryByTestId(BOOKMARK_BUTTON_LOADER_TEST_ID)
      ).not.toBeNull();
    });
    // We wait for the component to re-render after the deleteBookmark server action promise resolves
    await waitFor(async () =>
      // expect the fill-opacitiy of the bookmark icon to be 1 as the request is intercepted by msw and resolves successfully
      expect(
        within(bookmarkButton).queryByTestId(BOOKMARK_BUTTON_ICON_TEST_ID)
        //@ts-expect-error
      ).toHaveAttribute("fill-opacity", "0")
    );
  });
});
