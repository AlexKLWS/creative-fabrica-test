import React from "react";

import type { Preview } from "@storybook/react";
import { Work_Sans } from "next/font/google";
import "../src/app/globals.css";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
});

const preview: Preview = {
  decorators: [
    (Story) => (
      <div className={`font-sans antialiased ${workSans.variable}`}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
