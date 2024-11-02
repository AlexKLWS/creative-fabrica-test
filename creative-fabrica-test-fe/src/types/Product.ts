import { User } from "./User";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string | null;
  category: string;
  imageUrl: string | null;
  isBookmarked: boolean | null;
  createdBy: User;
};
