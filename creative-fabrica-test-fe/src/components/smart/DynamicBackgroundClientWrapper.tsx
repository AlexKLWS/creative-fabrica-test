"use client";

import dynamic from "next/dynamic";

const DynamicBackground = dynamic(() => import("./DynamicBackground"), {
  ssr: false,
});

const DynamicBackgroundClientWrapper = () => {
  return <DynamicBackground />;
};

export default DynamicBackgroundClientWrapper;
