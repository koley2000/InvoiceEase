import InvoiceForm from "@/components/InvoiceForm";
import React from "react";

const createInvoice: React.FC = () => {

  return (
    <>
    <InvoiceForm isEditMode={false}/>
    </>
  );
};

export default createInvoice;
