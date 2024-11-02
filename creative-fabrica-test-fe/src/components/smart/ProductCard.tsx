import { forwardRef, useEffect } from "react";
import { BoxIcon } from "lucide-react";
import Image from "next/image";

import { Product } from "@/types/Product";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { BookmarkButton } from "./buttons/BookmarkButton";
import { PRODUCT_CARD_TEST_ID } from "@/constants/testIds";

type Props = {
  product: Product;
  index: number;
  indexChangeCallback: (index: number) => void;
};

export const ProductCard = forwardRef(function ProductCard(
  props: Props,
  ref: any
) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          props.indexChangeCallback(props.index);
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.9 }
    );
    if (ref?.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [props.index, props.indexChangeCallback]);

  return (
    <section className="snap-center" ref={ref}>
      <Card
        data-testid={PRODUCT_CARD_TEST_ID}
        className="rounded-lg overflow-hidden w-[80vw] md:w-[60vw] lg:w-[50vw] relative"
      >
        <BookmarkButton
          isBookmarked={props.product.isBookmarked}
          postingId={props.product.id}
        />
        <CardHeader>
          <div className="xl:grid grid-cols-2 gap-6">
            <div>
              <CardTitle className="text-xl font-bold">
                {props.product.title}
              </CardTitle>
              <h4 className="text-xl xl:text-3xl font-semibold py-4 xl:py-6">
                {`$${props.product.price}/month`}
              </h4>
            </div>
            <Image
              src={props.product.imageUrl || ""}
              alt="Rental Property"
              width={500}
              height={450}
              className="w-full h-72 object-cover rounded-md"
              style={{ aspectRatio: "600/450", objectFit: "cover" }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-muted-foreground h-16">
            {props.product.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="block lg:flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 h-10">
            <BoxIcon className="w-5 h-5" />
            <span className="text-sm">{props.product.category}</span>
          </div>
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <Avatar className="w-8 h-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback>{props.product.createdBy.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm">{`Hosted by ${props.product.createdBy.name}`}</span>
          </div>
        </CardFooter>
      </Card>
    </section>
  );
});
