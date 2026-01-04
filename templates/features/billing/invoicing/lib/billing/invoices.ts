/**
 * Invoice Management
 * 
 * Generate and manage invoices for customers.
 */

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export interface Invoice {
  id: string;
  number: string;
  status: string;
  amount: number;
  currency: string;
  created: Date;
  dueDate?: Date;
  paidAt?: Date;
  invoicePdf?: string;
  hostedUrl?: string;
}

/**
 * Get all invoices for a customer
 */
export async function getCustomerInvoices(
  customerId: string,
  limit = 10
): Promise<Invoice[]> {
  const invoices = await stripe.invoices.list({
    customer: customerId,
    limit,
  });

  return invoices.data.map(mapStripeInvoice);
}

/**
 * Get single invoice
 */
export async function getInvoice(invoiceId: string): Promise<Invoice | null> {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return mapStripeInvoice(invoice);
  } catch {
    return null;
  }
}

/**
 * Create manual invoice
 */
export async function createInvoice(
  customerId: string,
  items: { description: string; amount: number }[],
  options: {
    dueDate?: Date;
    autoCharge?: boolean;
  } = {}
): Promise<Invoice> {
  // Create invoice items first
  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: item.amount,
      currency: "usd",
      description: item.description,
    });
  }

  // Create the invoice
  const invoice = await stripe.invoices.create({
    customer: customerId,
    auto_advance: options.autoCharge !== false,
    collection_method: options.autoCharge !== false ? "charge_automatically" : "send_invoice",
    due_date: options.dueDate ? Math.floor(options.dueDate.getTime() / 1000) : undefined,
  });

  // Finalize the invoice
  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

  return mapStripeInvoice(finalizedInvoice);
}

/**
 * Send invoice to customer
 */
export async function sendInvoice(invoiceId: string): Promise<void> {
  await stripe.invoices.sendInvoice(invoiceId);
}

/**
 * Mark invoice as paid (for manual payments)
 */
export async function markInvoicePaid(invoiceId: string): Promise<Invoice> {
  const invoice = await stripe.invoices.pay(invoiceId, {
    paid_out_of_band: true,
  });

  return mapStripeInvoice(invoice);
}

/**
 * Void an invoice
 */
export async function voidInvoice(invoiceId: string): Promise<Invoice> {
  const invoice = await stripe.invoices.voidInvoice(invoiceId);
  return mapStripeInvoice(invoice);
}

/**
 * Map Stripe invoice to our format
 */
function mapStripeInvoice(invoice: Stripe.Invoice): Invoice {
  return {
    id: invoice.id,
    number: invoice.number || invoice.id,
    status: invoice.status || "draft",
    amount: invoice.amount_due,
    currency: invoice.currency,
    created: new Date(invoice.created * 1000),
    dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : undefined,
    paidAt: invoice.status_transitions?.paid_at
      ? new Date(invoice.status_transitions.paid_at * 1000)
      : undefined,
    invoicePdf: invoice.invoice_pdf || undefined,
    hostedUrl: invoice.hosted_invoice_url || undefined,
  };
}

