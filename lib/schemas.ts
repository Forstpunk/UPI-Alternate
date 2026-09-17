import { z } from "zod"

export const upiIdSchema = z.object({
  upiId: z
    .string()
    .trim()
    .min(3, "Enter a UPI ID")
    .regex(
      /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9]{1,63}$/,
      "Enter a valid UPI ID, e.g. name@bank"
    ),
})

export type UpiIdFormValues = z.infer<typeof upiIdSchema>

export const amountSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Enter an amount" })
    .min(1, "Minimum amount is ₹1")
    .max(100000, "Maximum amount is ₹1,00,000"),
})

export type AmountFormValues = z.infer<typeof amountSchema>
