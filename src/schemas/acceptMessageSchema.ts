import {z} from "zod"

// this is

export const AcceptMessageSchema = z.object({
  acceptMessages: z.boolean()
})