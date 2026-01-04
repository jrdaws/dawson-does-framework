"use client";

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

interface InvoiceCardProps {
  invoice: Invoice;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "open":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "void":
        return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400";
      case "uncollectible":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium dark:text-white">{invoice.number}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(invoice.created)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold dark:text-white">
            {formatCurrency(invoice.amount, invoice.currency)}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
              invoice.status
            )}`}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      {(invoice.invoicePdf || invoice.hostedUrl) && (
        <div className="mt-4 flex gap-2">
          {invoice.invoicePdf && (
            <a
              href={invoice.invoicePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Download PDF
            </a>
          )}
          {invoice.hostedUrl && invoice.status === "open" && (
            <a
              href={invoice.hostedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Pay Online
            </a>
          )}
        </div>
      )}
    </div>
  );
}

