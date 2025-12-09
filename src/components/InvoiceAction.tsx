import { Invoice } from "@/model/Invoice";
import generatePdfBlob from "@/utils/generatePdfBlob";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface InvoiceActionProps {
  invoiceData: Invoice;
  isEditMode?: boolean;
}

const InvoiceAction: React.FC<InvoiceActionProps> = ({
  invoiceData,
  isEditMode,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const isFormValid = () => {
    return (
      invoiceData.items.length > 0 &&
      invoiceData.items.some(
        (item) => item.des.trim() !== "" && item.price > 0 && item.qty > 0
      ) &&
      invoiceData.docType.trim() !== "" &&
      invoiceData.customerDetails.trim() !== "" &&
      invoiceData.sellerDetails.trim() !== "" &&
      invoiceData.payType.trim() !== "" &&
      invoiceData.invoiceNumber > 0
    );
  };

  const saveInvoice = async () => {
    if (!isFormValid()) {
      toast.error(
        "Please fill in all required fields before saving the invoice."
      );
      return;
    } else {
      try {
        setIsSaving(true);
        toast.loading("Saving invoice...");
        await axios.post("/api/invoice", invoiceData);
        toast.dismiss();
      } catch (error: unknown) {
        toast.dismiss();
        toast.error(
          "Failed to save invoice" +
            `: ${(error as Error).message || "Unknown error"}`);
      } finally {
        setIsSaving(false);
        toast.success("Invoice saved successfully!");
      }
    }
  };

  const updateInvoice = async () => {
    try {
      setIsSaving(true);
      toast.loading("Updating invoice...");
      await axios.put(
        `/api/invoice/${invoiceData.id}`,
        invoiceData
      );
      toast.dismiss();
    } catch (error: unknown) {
      toast.dismiss();
      toast.error(
        `Failed to update invoice:${(error as Error).message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
      toast.success("Invoice updated successfully!");
    }
  };

  const downloadInvoice = async () => {
    if (!isFormValid()) {
      toast.error(
        "Please fill in all required fields before downloading the invoice."
      );
      return;
    } else {
      try {
        setIsDownloading(true);
        toast.loading("Preparing download...");

        const Bobpdf = await generatePdfBlob(invoiceData);

        // Create a URL for the blob and trigger a download
        const url = window.URL.createObjectURL(Bobpdf);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice_${invoiceData.id}.pdf`);
        document.body.appendChild(link);
        link.click();

        toast.dismiss();
        // Cleanup
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (error: unknown) {
        toast.dismiss();
        // Log the error for debugging
        console.error(error);
        toast.error("Failed to download invoice");
      } finally {
        setIsDownloading(false);
        toast.success("Invoice downloaded successfully!");
      }
    }
  };

  const sendEmail = async () => {
    toast.error("Email sending feature is not implemented yet.");
  }

  const printPdf = async () => {
  // 1. Set loading state
  setIsPrinting(true);

  // 2. Open the window IMMEDIATELY (Synchronously)
  // This bypasses popup blockers because it happens directly inside the click event.
  const previewWindow = window.open("", "_blank");

  // Check if blocker killed it
  if (!previewWindow) {
    setIsPrinting(false);
    toast.error("Pop-up blocked. Please allow pop-ups to view the PDF.");
    return;
  }

  // 3. Add a temporary loading message to the new tab
  previewWindow.document.write(`
    <html>
      <head><title>Generating Preview...</title></head>
      <body style="display:flex; justify-content:center; align-items:center; height:100vh; margin:0; font-family:sans-serif; background: #f5f5f5;">
        <h2>Generating PDF Preview...</h2>
      </body>
    </html>
  `);

  try {
    // Check validation
    if (!isFormValid()) {
      toast.error("Please fill in all required fields.");
      previewWindow.close(); // Close the blank tab since validation failed
      return; 
      // Note: We don't need setIsPrinting(false) here because 'finally' below handles it
    }

    toast.loading("Generating PDF...");

    // 4. Generate the Blob
    const pdfBlob = await generatePdfBlob(invoiceData);
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // 5. Redirect the new window to the PDF Blob
    // This loads the browser's native PDF viewer (Chrome/Edge/Firefox viewer)
    previewWindow.location.href = pdfUrl;
    
    // Optional: Set a timeout to clean up the blob URL from memory after 1 minute
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 60000);

    toast.dismiss();
    toast.success("PDF Preview opened.");

  } catch (error) {
    console.error("Preview error:", error);
    toast.dismiss();
    toast.error("Failed to generate PDF.");
    previewWindow.close(); // Close the loading tab on error
  } finally {
    // 6. CRITICAL: This ensures the button becomes clickable again
    setIsPrinting(false);
  }
};

  return (
    <>
      <button
        type="submit"
        onClick={isEditMode ? updateInvoice : saveInvoice}
        disabled={isSaving}
        className="bg-accent text-white px-12 py-3 rounded text-sm hover:bg-secondary-accent transition hover:scale-105 hover:cursor-pointer"
      >
        {isEditMode ? "Update Invoice" : "Save Invoice"}
      </button>
      <button
        type="button"
        onClick={downloadInvoice}
        disabled={isDownloading}
        className="bg-accent text-white px-12 py-3 rounded text-sm hover:bg-secondary-accent transition hover:scale-105 hover:cursor-pointer"
      >
        Download PDF
      </button>
      <button
        type="button"
        onClick={sendEmail}
        className="bg-gray-100 border-2 border-gray-800 text-gray-800 font-bold px-12 py-3 rounded text-sm hover:bg-gray-200 transition hover:scale-105 hover:cursor-pointer"
      >
        Send Via Email
      </button>
      <button
        type="button"
        onClick={printPdf}
        disabled={isPrinting}
        className="bg-gray-100 border-2 border-gray-800 text-gray-800 font-bold px-12 py-3 rounded text-sm hover:bg-gray-200 transition hover:scale-105 hover:cursor-pointer"
      >
        Preview & Print
      </button>
    </>
  );
};

export default InvoiceAction;
