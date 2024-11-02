"use client";

import { logOut } from "@/actions/logOut";
import { Button } from "@/components/ui/button";
import { LOGOUT_BUTTON_TEST_ID } from "@/constants/testIds";

export const LogOutButton = () => {
  return (
    <Button
      data-testid={LOGOUT_BUTTON_TEST_ID}
      onClick={() => logOut()}
      variant="outline"
    >
      {"Log Out"}
    </Button>
  );
};
