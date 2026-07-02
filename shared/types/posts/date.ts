import { z } from 'zod'

/**
 * Schema for post date
 */
export const postDateSchema = z
  .string()
  // Validates format "2026-03-13 00:00:00 UTC" using strict Regex
  .regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} UTC$/, {
    message: 'Invalid date format. Expected \'YYYY-MM-DD HH:MM:SS UTC\'',
  })
