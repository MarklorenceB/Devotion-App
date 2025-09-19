// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind + clsx merge helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting helper
export function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// --- Server Action Response Helper ---
export type ServerActionResponse<T = any> = {
  status: "SUCCESS" | "ERROR";
  error: string;
  data?: T;
} & Record<string, any>;

/**
 * Normalizes / builds a server action response object.
 */
export function parseServerActionResponse<T = any>(
  payload: Partial<ServerActionResponse<T>> = {}
): ServerActionResponse<T> {
  const { status, error = "", data, ...rest } = payload;

  return {
    status: status ?? (error ? "ERROR" : "SUCCESS"),
    error: error ?? "",
    data,
    ...rest,
  } as ServerActionResponse<T>;
}
