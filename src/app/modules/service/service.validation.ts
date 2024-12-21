import { z } from 'zod'
import { objectIdZodSchema } from '../../../helpers/checkObjectIdZodSchemaHelper'

const createServiceZodSchema = z.object({
    body: z.array(
        z.object({
            title: z.string({ required_error: "Title is required" }),
            category: objectIdZodSchema("Category Object ID is required")
        })
    )
})

const updateServiceZodSchema = z.object({
    body: z.object({
        image: z.string({ required_error: "Image is required" }),
        gender: z.enum([ "Male", 'Female', 'Children', 'Others'], { required_error: "Gender is required" }),
        price: z.number({ required_error: "Price is required" }),
        discount: z.number({ required_error: "Discount is required" }),
        duration: z.string({ required_error: "Duration is required" }),
        description: z.string({ required_error: "Description is required" })
    })

})

export const ServiceValidation = {
    createServiceZodSchema,
    updateServiceZodSchema
}