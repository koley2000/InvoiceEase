import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/model/Invoice";
import axios from "axios";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa";
import DeleteModal from "@/components/DeleteModal";
import Loading from "@/components/Loading";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('/api/invoice');
        setInvoiceData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch invoice data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const deleteInvoice = async (id: number) => {
    try {
      await axios.delete(`/api/invoice/${id}`);
      setInvoiceData(prevData => prevData.filter(invoice => invoice.id !== Number(id)));
      toast.success("Invoice deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete invoice");
    }
  };

  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Title */}
        <div className="my-8">
          <h1 className="text-2xl font-bold text-accent mb-1">Invoice Dashboard</h1>
          <p className="text-[#4A5568] text-sm font-medium">Manage and view all your invoices</p>
        </div>

        <Table className="border rounded-lg overflow-hidden shadow-md text-sm table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-accent hover:bg-accent">
              <TableHead className="w-24 py-2 text-md font-medium text-gray-100">Invoice No</TableHead>
              <TableHead className="w-2/5 py-2 text-md font-medium text-gray-100">Customer Details</TableHead>
              <TableHead className="w-28 py-2 text-md font-medium text-gray-100">Date</TableHead>
              <TableHead className="w-32 py-2 text-md font-medium text-gray-100">Payment Status</TableHead>
              <TableHead className="w-28 text-right py-2 text-md font-medium text-gray-100">Doc Type</TableHead>
              <TableHead className="w-24 text-right py-2 text-md font-medium text-gray-100">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-foreground">
            {invoiceData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <p className="text-gray-500 font-semibold">No invoices found</p>
                    <button 
                      onClick={() => router.push('/create-invoice')}
                      className="bg-accent text-white px-4 py-1.5 text-sm rounded-md hover:bg-secondary-accent transition-colors hover:scale-105 hover:cursor-pointer"
                    >
                      Create Your First Invoice
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              invoiceData.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-gray-200 transition-colors">
                  <TableCell className="w-24 font-medium py-2 text-xs">
                    INV{invoice.invoiceNumber}
                  </TableCell>
                  <TableCell className="w-2/5 py-1 text-md">
                    <div className="max-w-full pr-2">
                      <p className="truncate">
                        {invoice.customerDetails.split(" ").slice(0, 13).join(" ")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="w-28 py-1 text-md">
                    {new Date(invoice.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: '2-digit'
                    })}
                  </TableCell>
                  <TableCell className="w-32 py-1 text-md">
                    {invoice.payStatus && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium ${
                        invoice.payStatus === 'PAID'
                          ? 'bg-green-100 text-green-800'
                          : invoice.payStatus === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {invoice.payStatus}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="w-28 text-right py-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-md font-medium bg-blue-100 text-blue-800">
                      {invoice.docType}
                    </span>
                  </TableCell>
                  <TableCell className="w-24 text-right py-1">
                    <div className="flex justify-end items-center space-x-3">
                      <button 
                        className="hover:cursor-pointer p-1.5 hover:bg-gray-100 rounded-full transition-colors" 
                        onClick={() => router.push(`/edit-invoice/${invoice.id}`)}
                        title="Edit Invoice"
                      >
                        <FaEye className="h-5 w-5 text-gray-600 hover:text-accent" />
                      </button>
                      {invoice.id !== undefined && (
                        <DeleteModal deleteInvoice={deleteInvoice} id={invoice.id} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Dashboard;
