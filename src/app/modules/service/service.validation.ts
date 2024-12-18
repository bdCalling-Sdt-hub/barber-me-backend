import { z } from 'zod'

const createServiceZodSchema = z.object({
    body: z.object({
        title: z.string({required_error: "Title is required"}),
        price: z.number({required_error: "Number is required"}),
        gender: z.string({required_error: "Gender is required"}),
        professional: z.string({required_error: "Professional ID is required"}),
        category: z.string({required_error: "Category is required"}),
    })
})

export const ServiceValidation = {
    createServiceZodSchema
}