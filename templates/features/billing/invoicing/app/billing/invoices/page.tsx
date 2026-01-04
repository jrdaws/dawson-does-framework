"use client";

import { useEffect, useState } from "react";
import { InvoiceCard } from "@/components/billing/InvoiceCard";

interface Invoice {
  id: string;
  number: string;
  status: string;
  amount: number;
  currency: string;
  created: string;
  dueDate?: string;
  paidAt?: string;
  invoicePdf?: string;
  hostedUrl?: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/billing/invoices")
      .then((res) => res.json())
      .then((data) => {
        setInvoices(data.invoices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Invoices</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Invoices</h1>

      {invoices.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            No invoices found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <InvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      )}
    </div>
  );
}

