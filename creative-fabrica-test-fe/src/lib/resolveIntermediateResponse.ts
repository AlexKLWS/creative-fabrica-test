import { NextResponse } from 'next/server';

import { IntermediateResponse } from '@/types/MiddlewareStep';

export const resolveIntermediateResponse = (intermediateResponse: IntermediateResponse) => {
  let response = NextResponse.next();
  if (intermediateResponse.redirectURL) {
    return NextResponse.redirect(intermediateResponse.redirectURL);
  }
  if (intermediateResponse.addCookies) {
    for (const cookieName in intermediateResponse.addCookies) {
      response.cookies.set(cookieName, intermediateResponse.addCookies[cookieName]);
    }
  }
  if (intermediateResponse.removeCookies) {
    for (const cookieName of intermediateResponse.removeCookies) {
      response.cookies.delete(cookieName);
    }
  }
  if (intermediateResponse.headers) {
    for (const header in intermediateResponse.headers) {
      response.headers.set(header, intermediateResponse.headers[header]);
    }
  }
  return response;
};
