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
import Loading from "@/components/Loading";
import { FaPlusCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(e.target.value);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("/api/invoice");
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
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="my-8">
            <h1 className="text-2xl font-bold text-accent mb-1">
              Invoice Dashboard
            </h1>
            <p className="text-[#4A5568] text-sm font-medium">
              Manage and view all your invoices
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative">
              <select
                id="payStatus"
                className="w-full text-gray-700 rounded px-2 py-2 pr-8 font-semibold appearance-none focus:outline-none hover:cursor-pointer"
                name="filterStatus"
                value={filterStatus}
                onChange={handleFilterChange}
                required
              >
                <option value="">Filter By Status</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
              </select>
              <IoIosArrowDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-accent pointer-events-none" />
            </div>
            <button
              onClick={() => router.push("/create-invoice")}
              className="flex items-center justify-center gap-2 rounded-full bg-accent font-semibold text-white px-4 py-3 text-md hover:bg-secondary-accent transition-colors hover:scale-105 hover:cursor-pointer"
            >
              <FaPlusCircle size={30} />
              Create New Invoice
            </button>
          </div>
        </div>

        <Table className="border rounded-lg overflow-hidden shadow-md text-sm table-fixed w-full">
          <TableHeader>
            <TableRow className="bg-accent hover:bg-accent">
              <TableHead className="w-24 py-2 text-md font-medium text-gray-100">
                Invoice No
              </TableHead>
              <TableHead className="w-2/5 py-2 text-md font-medium text-gray-100">
                Customer Details
              </TableHead>
              <TableHead className="w-28 py-2 text-md font-medium text-gray-100">
                Date
              </TableHead>
              <TableHead className="w-32 py-2 text-md font-medium text-gray-100">
                Payment Status
              </TableHead>
              <TableHead className="w-28 text-right py-2 text-md font-medium text-gray-100">
                Doc Type
              </TableHead>
              <TableHead className="w-24 text-right py-2 text-md font-medium text-gray-100">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-foreground">
            {invoiceData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No invoices found. Create your first invoice now!
                </TableCell>
              </TableRow>
            ) : (
              invoiceData
                .filter((invoice) => {
                  return !filterStatus || invoice.payStatus === filterStatus; // If no filter is set, show everything.
                })
                .map(
                  (
                    invoice, // Otherwise, only show invoices that match the status.
                  ) => (
                    <TableRow
                      key={invoice.id}
                      className="py-4 hover:bg-white transition-colors cursor-pointer border-b"
                      onClick={() => router.push(`/edit-invoice/${invoice.id}`)}
                    >
                      <TableCell className="w-24 font-medium py-4 text-xs">
                        INV{invoice.invoiceNumber}
                      </TableCell>
                      <TableCell className="w-2/5 py-4 text-md">
                        <div className="max-w-full pr-2">
                          <p className="truncate">
                            {invoice.customerDetails
                              .split(" ")
                              .slice(0, 13)
                              .join(" ")}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="w-28 py-4 text-md">
                        {new Date(invoice.date).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          year: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="w-32 py-4 text-sm">
                        {invoice.payStatus && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                              invoice.payStatus === "PAID"
                                ? "bg-green-100 text-green-800"
                                : invoice.payStatus === "PENDING"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {invoice.payStatus}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="w-28 text-right py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-md font-medium bg-blue-100 text-blue-800">
                          {invoice.docType}
                        </span>
                      </TableCell>
                      <TableCell className="w-24 text-right py-4">
                        <div className="flex justify-center items-center space-x-3">
                            <MdKeyboardDoubleArrowRight className="h-5 w-5 text-gray-700 hover:text-accent" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ),
                )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Dashboard;
