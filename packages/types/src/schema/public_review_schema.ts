/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import z from "zod";

export const public_review_schema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be atleast 1")
    .max(5, "Rating cannot exceed 5"),
  title: z.string().optional(),
  content: z.string().optional(),
});
