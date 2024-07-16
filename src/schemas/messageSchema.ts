import {z} from "zod"

// this is

export const messageSchema = z.object({
	content: z.string()
})
