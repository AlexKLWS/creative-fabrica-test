import { cookies } from "next/headers";

import { ProductListView } from "./ProductListView";
import { USERNAME_COOKIE_NAME } from "@/constants/cookies";
import { Product } from "@/types/Product";

const fetchData = async () => {
  try {
    return {
      response: [
        {
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
        },
        {
          id: 2,
          title: "Vintage Logo Pack",
          description:
            "This Vintage Logo Pack brings timeless designs that work well for logos, branding, packaging, and promotional materials.",
          price: 35,
          category: "Graphics",
          imageUrl: "https://picsum.photos/id/102/500/450",
          isBookmarked: true,
          createdBy: {
            id: 2,
            name: "James",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
        {
          id: 3,
          title: "Modern Sans Serif Fonts",
          description:
            "Modern Sans Serif Fonts offer a clean and minimal style, perfect for web design, presentations, and editorials.",
          price: 27,
          category: "Fonts",
          imageUrl: "https://picsum.photos/id/103/500/450",
          isBookmarked: false,
          createdBy: {
            id: 3,
            name: "Linda",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
        {
          id: 4,
          title: "Abstract Background Textures",
          description:
            "This pack of abstract textures enhances design projects with unique backgrounds for social media, posters, and presentations.",
          price: 15,
          category: "Textures",
          imageUrl: "https://picsum.photos/id/104/500/450",
          isBookmarked: false,
          createdBy: {
            id: 4,
            name: "Tom",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
        {
          id: 5,
          title: "Handwritten Script Fonts",
          description:
            "Handwritten Script Fonts add a personal touch to projects, ideal for quotes, invitations, and branding.",
          price: 22,
          category: "Fonts",
          imageUrl: "https://picsum.photos/id/105/500/450",
          isBookmarked: true,
          createdBy: {
            id: 5,
            name: "Sara",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
        {
          id: 6,
          title: "Geometric Pattern Collection",
          description:
            "This collection of geometric patterns is perfect for backgrounds, wallpapers, and fabric prints.",
          price: 28,
          category: "Patterns",
          imageUrl: "https://picsum.photos/id/106/500/450",
          isBookmarked: false,
          createdBy: {
            id: 6,
            name: "Alex",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
        {
          id: 7,
          title: "Rustic Photo Overlays",
          description:
            "Rustic Photo Overlays enhance photos with a natural, vintage feel for social media and print designs.",
          price: 18,
          category: "Overlays",
          imageUrl: "https://picsum.photos/id/107/500/450",
          isBookmarked: true,
          createdBy: {
            id: 7,
            name: "Nina",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
        {
          id: 8,
          title: "Snowflake Paper Sculpture",
          description:
            "Play around with the weather with this Snowflake paper sculpture. It is perfect for a Christmas party decoration, but you can also use it a classroom, to teach children about the weather, or simply to decorate your home during wintertime!",
          price: 42,
          category: "3D",
          imageUrl: "https://picsum.photos/id/108/500/450",
          isBookmarked: false,
          createdBy: {
            id: 8,
            name: "David",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
        {
          id: 9,
          title: "Seasonal Icon Set",
          description:
            "This Seasonal Icon Set contains icons perfect for use in seasonal promotions, websites, and mobile apps.",
          price: 30,
          category: "Icons",
          imageUrl: "https://picsum.photos/id/109/500/450",
          isBookmarked: true,
          createdBy: {
            id: 9,
            name: "Emily",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
        {
          id: 10,
          title: "Wonderful Christmas Fonts",
          description:
            "Wonderful Christmas font feels equally charming and elegant. It looks stunning on wedding invitations, thank you cards, quotes, greeting cards, logos, business cards and every other design which needs a handwritten touch.",
          price: 23,
          category: "Fonts",
          imageUrl: "https://picsum.photos/id/66/500/450",
          isBookmarked: false,
          createdBy: {
            id: 10,
            name: "Josh",
            avatarImageUrl: "/placeholder-user.jpg",
          },
        },
      ],
    };
    // const urlBase = process.env.API_URL;
    // if (!urlBase) {
    //   throw new Error("Missing API URL in env config!");
    // }

    // const requestCookies = await cookies();
    // const username = requestCookies.get(USERNAME_COOKIE_NAME);
    // if (!username) {
    //   throw new Error("Somehow username is missing!");
    // }

    // const result = await fetch(urlBase + "/products", {
    //   headers: {
    //     username: username.value,
    //   },
    //   cache: "no-store",
    // });

    // const parsedResult = (await result.json()) as Product[];

    // return { response: parsedResult };
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

  if (result.response) {
    return <ProductListView products={result.response} />;
  } else {
    return <div>{(result.error as Error)?.message || "Error!"}</div>;
  }
}
