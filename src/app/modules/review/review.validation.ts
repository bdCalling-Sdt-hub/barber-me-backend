import { z } from "zod"

const reviewZodSchema = z.object({
    body: z.object({
        professional: z.string({ required_error: 'Professional is required' }),
        rating: z.number({ required_error: 'Rating is required' })
            .int({ message: 'Rating must be an integer' })
            .min(1, { message: 'Rating must be at least 1' })
            .max(5, { message: 'Rating must be at most 5' }),
        comment: z.string({ required_error: 'Comment is required' }),
    })  
})

export const ReviewValidation = {reviewZodSchema}