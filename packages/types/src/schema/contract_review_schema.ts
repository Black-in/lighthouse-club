/*
 * Lighthouse
 * © 2026 ayushshrivastv
 */

import { z } from "zod";

export const contractReviewSchema = z.object({
  contractId: z.string(),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  liked: z.string().optional().nullable(),
  disliked: z.string().optional().nullable(),
});

export type ContractReviewInput = z.infer<typeof contractReviewSchema>;
