"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import postgres from "postgres";
import { FormSchema, State } from "./definitions";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const DeleteInvoice = FormSchema.pick({ id: true });

/* auth */

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

/* other logic */
export async function createInvoice(
  prevState: Partial<State>,
  formData: FormData
) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing, invalid fields. Failed to create an invoice.",
    };
  }
  const { customerId, amount, status } = validatedFields.data;
  try {
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split("T")[0];

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(invoiceId: string) {
  throw new Error("simulated error");
  try {
    const { id } = DeleteInvoice.parse({
      id: invoiceId,
    });
    await sql`DELETE FROM invoices WHERE id = ${id}`;
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/dashboard/invoices");
  // redirect("/dashboard/invoices"); no need to redirect because we're already in that path
}

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData
) {
  try {
    const validatedFields = CreateInvoice.safeParse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    });

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Missing / invalid field values. Please try again",
      };
    }
    const { amount, customerId, status } = validatedFields.data;

    const amountInCents = amount * 100;

    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  } catch (error) {
    console.log(error);
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
