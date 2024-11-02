import { NextRequest, NextResponse } from 'next/server';

export type MiddlewareStep = (
  request: NextRequest,
  currentResponse: IntermediateResponse
) => Promise<IntermediateResponse>;

export type IntermediateResponse = {
  lng?: string;
  redirectURL?: URL;
  addCookies?: Record<string, string>;
  removeCookies?: string[];
  headers?: Record<string, string>;
  isTokenValid?: boolean;
  isEmailVerified?: boolean;
};
