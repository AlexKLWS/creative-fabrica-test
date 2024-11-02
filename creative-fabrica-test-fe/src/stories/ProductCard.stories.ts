import { ProductCard } from "@/components/smart/ProductCard";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Test/ProductCard",
  component: ProductCard,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: { index: 0, indexChangeCallback: fn() },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    product: {
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
  },
};