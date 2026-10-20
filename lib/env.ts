import "server-only";
import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const envSchema = z.object({
  GITHUB_USERNAME: z
    .string({ error: "GITHUB_USERNAME is required" })
    .trim()
    .regex(/^[a-z\d](?:[a-z\d-]{0,38})$/i, "GITHUB_USERNAME is not a valid GitHub username"),
  GITHUB_TOKEN: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  GITHUB_REPO_LIMIT: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(100).default(10),
  ),
  GITHUB_REVALIDATE_SECONDS: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(0).default(3600),
  ),
  SITE_TITLE: z.preprocess(emptyToUndefined, z.string().trim().default("Meine Projekte")),
  SITE_COPYRIGHT_HOLDER: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  SITE_SOURCE_URL: z.preprocess(
    emptyToUndefined,
    z.url({ protocol: /^https?$/, error: "SITE_SOURCE_URL must be an http(s) URL" }).optional(),
  ),
  SITE_CONTACT_EMAIL: z.preprocess(
    emptyToUndefined,
    z.email("SITE_CONTACT_EMAIL is not a valid email address").optional(),
  ),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    `Invalid environment configuration:\n${z.prettifyError(parsed.error)}\nSee .env.example.`,
  );
}

export const env = parsed.data;
