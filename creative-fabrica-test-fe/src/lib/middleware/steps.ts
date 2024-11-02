import { MiddlewareStep } from "@/types/MiddlewareStep";
import { authValidationStep } from "./authValidationStep";

export const clientRoutesMiddlewareSteps: MiddlewareStep[] = [
  authValidationStep,
];
