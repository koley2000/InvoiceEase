import React, { ChangeEvent, useEffect, useState, useCallback } from "react";
import InvoiceAction from "@/components/InvoiceAction";
import { Invoice } from "@/model/Invoice";
import { RxCross1 } from "react-icons/rx";

interface InvoiceFormProps {
  invoice?: Invoice;
  isEditMode?: boolean;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, isEditMode }) => {
  const [addDis, setAddDis] = useState(false);
  const [addShip, setAddShip] = useState(false);

  const [invoiceData, setInvoiceData] = useState<Invoice>({
    invoiceNumber: invoice?.invoiceNumber || 0,
    docType: invoice?.docType || "",
    customerDetails: invoice?.customerDetails || "",
    sellerDetails: invoice?.sellerDetails || "",
    customerEmail: invoice?.customerEmail || "",
    payType: invoice?.payType || "",
    payStatus: invoice?.payStatus || "UNPAID",
    items: invoice?.items || [{ des: "", qty: 1, price: 0, amount: 0 }],
    date: invoice?.date || new Date(),
    tax: invoice?.tax || 0,
    taxAmount: invoice?.taxAmount || 0,
    discount: invoice?.discount || 0,
    discountAmount: invoice?.discountAmount || 0,
    shipCharges: invoice?.shipCharges || 0,
    subTotal: invoice?.subTotal || 0,
    totalAmount: invoice?.totalAmount || 0,
  });

  useEffect(() => {
    if (isEditMode && invoice) {
      setInvoiceData({
        ...invoice,
        date: invoice.date ? new Date(invoice.date) : new Date(),
        items:
          invoice.items && invoice.items.length > 0
            ? invoice.items
            : [{ des: "", qty: 1, price: 0, amount: 0 }],
      });
    }
  }, [invoice, isEditMode]);

  const addItem = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setInvoiceData((prevItem) => ({
      ...prevItem,
      items: [...prevItem.items, { des: "", qty: 1, price: 0, amount: 0 }],
    }));
  };

  const removeItem = (index: number) => {
    setInvoiceData((prevItem) => ({
      ...prevItem,
      items: prevItem.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const items = [...invoiceData.items];
    const numericValue =
      name === "qty" || name === "price" ? parseFloat(value) || 0 : value;
    items[index] = { ...items[index], [name]: numericValue };

    // Calculate amount for this item
    if (name === "qty" || name === "price") {
      items[index].amount = items[index].qty * items[index].price;
    }

    setInvoiceData({ ...invoiceData, items });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInvoiceData({
      ...invoiceData,
      [name]:
        name === "invoiceNumber"
          ? parseInt(value) || 0
          : name === "date"
          ? new Date(value) // Handle date properly
          : name === "shipCharges" || name === "tax" || name === "discount"
          ? parseFloat(value) || 0
          : value,
    });
  };

  const calculateTotal = useCallback(() => {
    // Calculate subtotal from qty * price, not from amount
    const subtotal = invoiceData.items.reduce((sum, item) => {
      const itemTotal = (item.qty || 0) * (item.price || 0);
      return sum + itemTotal;
    }, 0);

    const discountAmount = (subtotal * (invoiceData.discount || 0)) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * (invoiceData.tax || 0)) / 100;
    const totalAmount =
      taxableAmount + taxAmount + (invoiceData.shipCharges || 0);

    setInvoiceData((prev) => ({
      ...prev,
      subTotal: subtotal,
      totalAmount: totalAmount,
      taxAmount: taxAmount,
      discountAmount: discountAmount,
    }));
  }, [
    invoiceData.items,
    invoiceData.tax,
    invoiceData.discount,
    invoiceData.shipCharges,
  ]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row justify-center items-start gap-8 p-4 lg:p-6">
      {/* Invoice Form Container */}
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 lg:p-6">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            {/* Left - Type & From/To */}
            <div className="w-full lg:w-2/3 space-y-3">
              <div>
                <label
                  htmlFor="docType"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Type
                </label>
                <select
                  id="docType"
                  className="w-full lg:w-1/2 border border-gray-300 rounded px-2 py-2 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent hover:cursor-pointer"
                  name="docType"
                  value={invoiceData.docType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Invoice">Invoice</option>
                  <option value="Estimate">Estimate</option>
                  <option value="Receipt">Receipt</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sellerDetails"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Seller Details
                </label>
                <textarea
                  id="sellerDetails"
                  className="w-3/4 border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent resize-none hover:cursor-pointer"
                  rows={3}
                  name="sellerDetails"
                  value={invoiceData.sellerDetails}
                  onChange={handleChange}
                  placeholder="Enter seller details"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="customerDetails"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Customer Details
                </label>
                <textarea
                  id="customerDetails"
                  className="w-3/4 border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent resize-none hover:cursor-pointer"
                  rows={3}
                  name="customerDetails"
                  value={invoiceData.customerDetails}
                  onChange={handleChange}
                  placeholder="Enter customer details"
                  required
                />
              </div>
            </div>

            {/* Right - Logo, Invoice Info */}
            <div className="w-full lg:w-1/3 mt-4 lg:mt-0 space-y-3">
              <div>
                <label
                  htmlFor="invoiceNumber"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Invoice Number
                </label>
                <input
                  id="invoiceNumber"
                  type="number"
                  name="invoiceNumber"
                  value={invoiceData.invoiceNumber}
                  onChange={handleChange}
                  className="w-full text-gray-700 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent hover:cursor-pointer"
                  placeholder="Enter invoice number"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  name="date"
                  value={
                    invoiceData.date
                      ? new Date(invoiceData.date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleChange}
                  className="w-full border uppercase text-gray-700 border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent hover:cursor-pointer"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Customer Email
                </label>
                <input
                  id="customerEmail"
                  type="email"
                  name="customerEmail"
                  value={invoiceData.customerEmail}
                  onChange={handleChange}
                  className="w-full border text-gray-700 border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent"
                  placeholder="Enter customer email"
                />
              </div>
              <div>
                <label
                  htmlFor="payStatus"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Payment Status
                </label>
                <select
                  id="payStatus"
                  className="w-full text-gray-700 border border-gray-300 rounded px-2 py-2 text-sm appearance-none box-border bg-white focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent hover:cursor-pointer"
                  name="payStatus"
                  value={invoiceData.payStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="PAID">Paid</option>
                  <option value="PENDING">Pending</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead className="bg-secondary-accent text-white">
                <tr>
                  <th className="text-left p-2 w-2/5">Description</th>
                  <th className="text-center p-2 w-1/6">Price</th>
                  <th className="text-center p-2 w-1/6">Qty</th>
                  <th className="text-center p-2 w-1/6">Amount</th>
                  <th className="text-center p-2 w-1/12">Action</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.items.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-2">
                      <label
                        htmlFor={`item-description-${index}`}
                        className="sr-only"
                      >
                        Item description for row {index + 1}
                      </label>
                      <input
                        id={`item-description-${index}`}
                        type="text"
                        name="des"
                        value={item.des}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="Item description"
                        className="w-full border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-secondary-accent focus:border-secondary-accent hover:cursor-pointer"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <label
                        htmlFor={`item-price-${index}`}
                        className="sr-only"
                      >
                        Price for row {index + 1}
                      </label>
                      <input
                        id={`item-price-${index}`}
                        type="number"
                        name="price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="0.00"
                        min="0"
                        step="0.1"
                        className="w-full border border-gray-300 rounded px-2 py-2 text-center text-sm focus:outline-none focus:ring-1 focus:ring-secondary-accent focus:border-secondary-accent hover:cursor-pointer"
                        required
                      />
                    </td>
                    <td className="p-2">
                      <label htmlFor={`item-qty-${index}`} className="sr-only">
                        Quantity for row {index + 1}
                      </label>
                      <input
                        id={`item-qty-${index}`}
                        type="number"
                        name="qty"
                        value={item.qty}
                        onChange={(e) => handleItemChange(index, e)}
                        placeholder="1"
                        min="1"
                        className="w-full border border-gray-300 rounded px-2 py-2 text-center text-sm focus:outline-none focus:ring-1 focus:ring-secondary-accent focus:border-secondary-accent hover:cursor-pointer"
                        required
                      />
                    </td>
                    <td className="p-2 text-center text-gray-700 font-medium">
                      &#8377; {((item.qty || 0) * (item.price || 0)).toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1.5 rounded-full transition-colors duration-200 hover:cursor-pointer"
                        title={`Remove item ${index + 1}`}
                        aria-label={`Remove item ${index + 1}`}
                      >
                        <RxCross1 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3">
              <button
                type="button"
                onClick={addItem}
                className="px-2.5 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200 text-sm hover:cursor-pointer"
              >
                + Add Item
              </button>
            </div>
          </div>

          {/* Totals Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 mb-6 gap-6">
            {/* Payment Via (left column, opposite Subtotal) */}
            <div className="flex flex-col justify-start mt-0 lg:mt-2">
              <label
                htmlFor="payType"
                className="block text-sm font-semibold text-gray-700 mb-1"
              >
                Payment Via
              </label>
              <select
                id="payType"
                name="payType"
                className="w-64 text-gray-700 border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent hover:cursor-pointer"
                value={invoiceData.payType}
                onChange={handleChange}
                required
              >
                <option value="">Payment Via</option>
                <option value="Payment Due">Payment Due</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Debit / Credit Card">Debit / Credit Card</option>
              </select>
            </div>

            {/* Totals (right column) */}
            <div className="space-y-1.5 text-right w-full lg:w-auto max-w-xs text-sm font-medium lg:ml-auto justify-self-end">
              <div className="flex items-center justify-end text-gray-700 transition hover:scale-105">
                <span className="mr-2">Subtotal:</span>
                <span>
                  &#8377; {Number(invoiceData.subTotal || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-end text-gray-700 mb-3">
                <label htmlFor="tax" className="text-gray-700 mr-2">
                  Tax:
                </label>
                <input
                  id="tax"
                  type="number"
                  name="tax"
                  step="0.1"
                  value={invoiceData.tax}
                  onChange={handleChange}
                  className="w-16 text-right border border-gray-300 rounded py-1.5 px-2 text-sm focus:outline-none focus:ring focus:ring-secondary-accent focus:border-secondary-accent mr-2 hover:cursor-pointer"
                  placeholder="0"
                  required
                />
                <span>%</span>
              </div>

              {addDis && (
                <div className="flex items-center justify-end mb-3">
                  <label htmlFor="discount" className="text-gray-700 mr-2">
                    Discount:
                  </label>
                  <input
                    id="discount"
                    type="number"
                    className="remove-arrow block w-16 border-gray-300 border rounded py-1.5 px-2 leading-tight focus:outline-none focus:ring-1 focus:ring-secondary-accent focus:border-secondary-accent mr-2 text-sm"
                    name="discount"
                    step="0.1"
                    value={invoiceData.discount}
                    onChange={handleChange}
                    placeholder="0"
                  />
                  <span>%</span>
                </div>
              )}

              {addShip && (
                <div className="flex items-center justify-end mb-3">
                  <label htmlFor="shipCharges" className="text-gray-700 mr-2">
                    Shipping Charges: <span>&#8377;</span>{" "}
                  </label>
                  <input
                    id="shipCharges"
                    type="number"
                    className="remove-arrow block w-16 border-gray-300 border rounded py-1.5 px-2 leading-tight-none focus:outline-none focus:ring-1 focus:ring-secondary-accent focus:border-secondary-accent mr-2 text-sm"
                    name="shipCharges"
                    value={invoiceData.shipCharges}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              )}

              <div className="flex items-center justify-end mb-4">
                <button
                  type="button"
                  className={`inline-block rounded border border-current px-3 py-1.5 text-sm font-medium ${
                    addDis ? "text-red-600" : "text-indigo-600"
                  } transition hover:scale-105 hover:cursor-pointer 
                            focus:outline-none`}
                  onClick={() => setAddDis(!addDis)}
                >
                  {addDis ? "Remove Discount" : "+ Discount"}
                </button>

                <button
                  type="button"
                  className={`ml-3 inline-block rounded border border-current px-3 py-1.5 text-sm font-medium ${
                    addShip ? "text-red-600" : "text-indigo-600"
                  } transition hover:scale-105 hover:cursor-pointer
                            focus:outline-none`}
                  onClick={() => setAddShip(!addShip)}
                >
                  {addShip ? "Remove Shipping" : "+ Shipping"}
                </button>
              </div>

              <div className="flex justify-between font-bold text-base border-t pt-1.5">
                <span>Total Amount:</span>
                <span>
                  &#8377; {Number(invoiceData.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col gap-3 justify-center">
        <InvoiceAction invoiceData={invoiceData} isEditMode={isEditMode} />
      </div>
    </div>
  );
};

export default InvoiceForm;
