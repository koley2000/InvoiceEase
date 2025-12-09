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

  const id = parseInt(req.query.id as string);

  if (req.method === "GET") {
    if (!id) {
      return res.status(400).json({ error: "Invoice ID is required" });
    }

    // Your existing GET logic:
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: id, userId: user.id }, // Added logic for user ID is good practice
        include: {
          items: true,
        },
      });

      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" }); // Not Found
      }
      return res.status(200).json(invoice); // OK
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } 
  
  else if (req.method === "PUT") {
    try {
      const invoice: Invoice = req.body;
      const updated = await prisma.invoice.update({
        where: { id: id, userId: user.id },
        data: {
          userId: user.id,
          invoiceNumber: invoice.invoiceNumber,
          docType: invoice.docType,
          customerDetails: invoice.customerDetails,
          sellerDetails: invoice.sellerDetails,
          payType: invoice.payType,
          items: {
            deleteMany: {},
            create: invoice.items.map((item) => ({
              des: item.des,
              qty: item.qty,
              price: item.price,
              amount: item.amount,
            })),
          },
          date: new Date(invoice.date),
          tax: new Prisma.Decimal(invoice.tax),
          taxAmount: new Prisma.Decimal(invoice.taxAmount),
          discount: new Prisma.Decimal(invoice.discount),
          discountAmount: new Prisma.Decimal(invoice.discountAmount),
          shipCharges: new Prisma.Decimal(invoice.shipCharges),
          subTotal: new Prisma.Decimal(invoice.subTotal),
          totalAmount: new Prisma.Decimal(invoice.totalAmount),
          payStatus: invoice.payStatus,
          customerEmail: invoice.customerEmail || null,
        },
      });
      res.status(200).json(updated); // OK
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update invoice" });
    }
  } 
  
  else if (req.method === "DELETE") {
    try {
      await prisma.invoice.delete({
        where: { id: id, userId: user.id },
      });
      res.status(200).json({ success: true }); // OK
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete invoice" });
    }
  } 
  
  else {
    res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
