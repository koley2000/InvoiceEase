export interface InvoiceItem {
  des: string;
  qty: number;
  price: number;
  amount: number;
}

export interface Invoice {
  invoiceNumber: number;
  docType: string;
  customerDetails: string;
  sellerDetails: string;
  customerEmail?: string;
  payType: string;
  payStatus: string;
  items: InvoiceItem[];
  date: Date;
  tax: number;
  taxAmount: number;
  discount: number;
  discountAmount: number;
  shipCharges: number;
  subTotal: number;
  totalAmount: number;
  updatedAt?: Date;
  id?: number;
}