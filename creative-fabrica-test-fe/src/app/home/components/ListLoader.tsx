import { LoaderProductCard } from "@/components/smart/LoaderProductCard";

export const ListLoader = () => {
  return (
    <div className="h-screen overflow-x-scroll snap-x snap-mandatory hide-scrollbar relative flex items-center gap-8 px-4 md:px-24">
      <LoaderProductCard />
      <LoaderProductCard />
      <LoaderProductCard />
    </div>
  );
};
