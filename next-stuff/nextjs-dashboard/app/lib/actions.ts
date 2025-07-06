"use server";
import { revalidatePath } from "next/cache";
import postgres from "postgres";
import { FormSchema } from "./definitions";
const sql = postgres(process.env.POSTGRES_URL!, { ssl: false });
const CreateInvoice = FormSchema.omit({ id: true, date: true });
const DeleteInvoice = FormSchema.pick({ id: true });
import { redirect } from "next/navigation";

export async function createInvoice(formData: FormData) {
  try {
    const { amount, customerId, status } = CreateInvoice.parse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    });
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

export async function updateInvoice(id: string, formData: FormData) {
  try {
    const { amount, customerId, status } = CreateInvoice.parse({
      customerId: formData.get("customerId"),
      amount: formData.get("amount"),
      status: formData.get("status"),
    });
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
