import InvoiceForm from '@/components/InvoiceForm';
import Loading from '@/components/Loading';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function EditInvoice() {
  const router = useRouter();
  const { id } = router.query;
  
  const [invoiceData, setInvoiceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id && typeof id === 'string') {
      
      axios.get(`/api/invoice/${id}`) // Fixed: removed 's' from invoices
        .then(response => {
          setInvoiceData(response.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
          toast.error('Failed to fetch invoice data');
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (!invoiceData) {
    return <div>Invoice not found</div>;
  }

  return (
    <div>
      <InvoiceForm invoice={invoiceData} isEditMode={true} />
    </div>
  );
}

export default EditInvoice;
