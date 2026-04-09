import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_NAME: z.string().default("E-Com AI Store"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_API_BASE_URL: z.string().url().default("http://localhost:5000/api/v1"),
  NEXT_PUBLIC_IMAGE_BASE_URL: z.string().url().default("http://localhost:5000/uploads"),
  NEXT_PUBLIC_AUTH_COOKIE_NAME: z.string().default("refresh_token"),
  NEXT_PUBLIC_ENABLE_AI_SEARCH: z.preprocess((val) => val === "true", z.boolean()).default(true),
  NEXT_PUBLIC_ENABLE_RECOMMENDATIONS: z.preprocess((val) => val === "true", z.boolean()).default(true),
  NEXT_PUBLIC_CURRENCY: z.string().default("INR"),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.string().default("en-IN"),
  NEXT_PUBLIC_ITEMS_PER_PAGE: z.preprocess((val) => Number(val), z.number()).default(10),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().default("support@ecom.com"),
});

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_IMAGE_BASE_URL: process.env.NEXT_PUBLIC_IMAGE_BASE_URL,
  NEXT_PUBLIC_AUTH_COOKIE_NAME: process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME,
  NEXT_PUBLIC_ENABLE_AI_SEARCH: process.env.NEXT_PUBLIC_ENABLE_AI_SEARCH,
  NEXT_PUBLIC_ENABLE_RECOMMENDATIONS: process.env.NEXT_PUBLIC_ENABLE_RECOMMENDATIONS,
  NEXT_PUBLIC_CURRENCY: process.env.NEXT_PUBLIC_CURRENCY,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_ITEMS_PER_PAGE: process.env.NEXT_PUBLIC_ITEMS_PER_PAGE,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
});

if (!parsedEnv.success) {
  console.error("❌ Invalid environment variables:", parsedEnv.error.format());
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv.data;
