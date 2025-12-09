import { Invoice } from "@/model/Invoice";
import axios from "axios";

interface InvoiceActionProps {
  invoiceData: Invoice;
}
 const generatePdfBlob = async (invoiceData: Invoice) => {
  try {
    const response = await axios.post("/api/generate-pdf", invoiceData, {
      responseType: "blob",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return new Blob([response.data], { type: "application/pdf" });
  } catch (error) {
    throw new Error("Failed to generate PDF");
  }
}

export default generatePdfBlob;

