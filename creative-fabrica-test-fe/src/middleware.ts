import { NextRequest, NextResponse } from "next/server";

import { IntermediateResponse } from "@/types/MiddlewareStep";
import { resolveIntermediateResponse } from "@/lib/resolveIntermediateResponse";
import { clientRoutesMiddlewareSteps } from "@/lib/middleware/steps";

export const config = {
  matcher: [
    "/((?!api|service-worker|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
  ],
};

export async function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.indexOf("icon") > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1
  ) {
    return NextResponse.next();
  }

  let intermediateResponse: IntermediateResponse = {};

  for (const step of clientRoutesMiddlewareSteps) {
    intermediateResponse = await step(req, intermediateResponse);
  }

  return resolveIntermediateResponse(intermediateResponse);
}
