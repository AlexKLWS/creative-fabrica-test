import { Suspense } from "react";

import { LogOutButton } from "@/components/smart/buttons/LogOutButton";
import ProductListController from "./components/ProductListController";
import { ListLoader } from "./components/ListLoader";
import NameView from "./components/NameView";

export default function Component() {
  return (
    <div className="w-full h-[90vh]">
      <div className="pt-8 px-8 flex items-center justify-start w-full z-10">
        <LogOutButton />
        <Suspense fallback={<div className="text-black text-lg ml-8" />}>
          <NameView />
        </Suspense>
      </div>
      <Suspense fallback={<ListLoader />}>
        <ProductListController />
      </Suspense>
    </div>
  );
}
