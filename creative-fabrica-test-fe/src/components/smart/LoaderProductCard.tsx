import { MapPinIcon } from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { PRODUCT_LOADER_CARD_TEST_ID } from "@/constants/testIds";

export const LoaderProductCard = () => {
  return (
    <section className="snap-center">
      <Card
        data-testid={PRODUCT_LOADER_CARD_TEST_ID}
        className="rounded-lg overflow-hidden w-[80vw] md:w-[60vw] lg:w-[50vw] relative"
      >
        <CardHeader>
          <div className="xl:grid grid-cols-2 gap-6">
            <div>
              <CardTitle>
                <Skeleton className="h-7 w-72" />
              </CardTitle>
              <Skeleton className="h-8 w-44 my-4 xl:my-6" />
            </div>
            <Skeleton className="w-full h-72 object-cover rounded-md" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-72 mt-4" />
        </CardContent>
        <CardFooter className="block lg:flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <Avatar className="w-8 h-8 border">
              <AvatarImage src="/placeholder-user.jpg" alt="@username" />
              <AvatarFallback></AvatarFallback>
            </Avatar>
            <Skeleton className="h-4 w-32" />
          </div>
        </CardFooter>
      </Card>
    </section>
  );
};
