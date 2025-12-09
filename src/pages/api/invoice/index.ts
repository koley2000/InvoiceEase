import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Invoice } from "@/model/Invoice";
import { authMiddleware } from "@/middleware/authMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const user = await authMiddleware(req, res);
  if (!user) return; // If not authenticated, response is already sent in middleware

  if (req.method == "GET") {
    try {
      const invoices = await prisma.invoice.findMany({
        where: { userId: user.id },
        // Select only the necessary fields for the list view
        select: {
          id: true,
          invoiceNumber: true,
          customerDetails: true,
          docType: true,
          payStatus: true,
          totalAmount: true,
          date: true,
          updatedAt: true,
        },
      });

      return res.status(200).json(invoices); 

    } catch (error: unknown) {
      let errorMessage = "Internal Server Error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return res.status(500).json({ error: errorMessage });
    }
  }

  if (req.method === "POST") {
    const invoice: Invoice = req.body;

    if (
      !invoice.invoiceNumber ||
      !invoice.totalAmount ||
      !invoice.items?.length
    ) {
      return res.status(400).json({ error: "Missing required fields" }); // Bad Request
    }

    try {
      await prisma.invoice.create({
        data: {
          userId: user.id,
          invoiceNumber: invoice.invoiceNumber,
          docType: invoice.docType,
          customerDetails: invoice.customerDetails,
          sellerDetails: invoice.sellerDetails,
          payType: invoice.payType,
          payStatus: invoice.payStatus || "Pending",
          customerEmail: invoice.customerEmail || null,
          items: {
            create: invoice.items.map((item) => ({
              des: item.des,
              qty: item.qty,
              price: item.price,
              amount: item.amount,
            })),
          },
          date: new Date(invoice.date).toISOString(),
          tax: new Prisma.Decimal(invoice.tax),
          taxAmount: new Prisma.Decimal(invoice.taxAmount),
          discount: new Prisma.Decimal(invoice.discount || 0),
          discountAmount: new Prisma.Decimal(invoice.discountAmount || 0),
          shipCharges: new Prisma.Decimal(invoice.shipCharges || 0),
          subTotal: new Prisma.Decimal(invoice.subTotal),
          totalAmount: new Prisma.Decimal(invoice.totalAmount),
        },
      });
      res.status(201).json({ message: "Invoice saved successfully" }); // Created
    } catch (error: unknown) {
      let errorMessage = "Unknown error";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ error: errorMessage }); // Internal Server Error
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
