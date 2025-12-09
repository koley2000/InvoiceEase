import { NextApiRequest, NextApiResponse } from "next";
import React from "react";
import { Document, renderToBuffer } from "@react-pdf/renderer";
import InvoicePdf from "@/template/invoice/classic"; 
import { Invoice } from "@/model/Invoice";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const invoice: Invoice = req.body;

    if (!invoice) {
      return res.status(400).json({ message: "Invoice data is required" });
    }

     const pdfElement = React.createElement(Document, null, React.createElement(InvoicePdf, { invoice }));
      
      // Render to buffer
      const pdfBuffer = await renderToBuffer(pdfElement);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=invoice-${invoice.invoiceNumber}.pdf`);
      
      res.end(pdfBuffer);
  } catch (error: unknown) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return res.status(500).json({
      message: "Error generating PDF",
      error: errorMessage,
    });
  }
}

