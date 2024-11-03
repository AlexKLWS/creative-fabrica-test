import { cookies } from "next/headers";

import { ProductListView } from "./ProductListView";
import { USERNAME_COOKIE_NAME } from "@/constants/cookies";
import { Product } from "@/types/Product";

const fetchData = async () => {
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

    const result = await fetch(urlBase + "/products", {
      headers: {
        username: username.value,
      },
      cache: "no-store",
    });

    const parsedResult = (await result.json()) as Product[];
    console.log(
      "🚀 ~ file: ProductListController.tsx ~ line 28 ~ fetchData ~ parsedResult",
      parsedResult
    );

    return { response: parsedResult };
  } catch (e) {
    console.log(
      "🚀 ~ file: ProductListController.tsx ~ line 52 ~ fetchData ~ e",
      e
    );
    return { error: e };
  }
};

export default async function ProductListController() {
  const result = await fetchData();

  if (result.response?.length) {
    return <ProductListView products={result.response} />;
  } else {
    return <div>{(result.error as Error)?.message || "Error!"}</div>;
  }
}
