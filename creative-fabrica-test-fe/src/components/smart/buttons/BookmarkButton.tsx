"use client";

import { addBookmark } from "@/actions/addBookmark";
import { deleteBookmark } from "@/actions/deleteBookmark";
import { Button } from "@/components/ui/button";
import {
  BOOKMARK_BUTTON_ICON_TEST_ID,
  BOOKMARK_BUTTON_LOADER_TEST_ID,
  BOOKMARK_BUTTON_TEST_ID,
} from "@/constants/testIds";
import { Bookmark, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  postingId: number;
  isBookmarked?: boolean | null;
};

export const BookmarkButton = (props: Props) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean | null | undefined>(
    props.isBookmarked
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-8 h-8 rounded-full bg-background/50 hover:bg-background/75 focus:outline-none focus:ring-1 focus:ring-primary absolute right-6 top-6 flex items-center justify-center"
      disabled={isLoading}
      data-testid={BOOKMARK_BUTTON_TEST_ID}
      onClick={async () => {
        setIsLoading(true);
        let updated = false;
        if (!isBookmarked) {
          const result = await addBookmark(props.postingId);

          updated = result?.response === true;
        } else {
          const result = await deleteBookmark(props.postingId);
          updated = result?.response === true;
        }
        if (updated) {
          setIsBookmarked(!isBookmarked);
        }
        setIsLoading(false);
      }}
    >
      {isLoading ? (
        <Loader2
          data-testid={BOOKMARK_BUTTON_LOADER_TEST_ID}
          className="h-4 w-4 animate-spin"
        />
      ) : (
        <Bookmark
          data-testid={BOOKMARK_BUTTON_ICON_TEST_ID}
          className="w-4 h-4"
          fillOpacity={isBookmarked ? 1 : 0}
          fill={"black"}
        />
      )}
    </Button>
  );
};
