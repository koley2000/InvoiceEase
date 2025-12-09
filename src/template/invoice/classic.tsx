// components/pdf/InvoicePdf.tsx
import React from "react";
import { Page, View, Text, StyleSheet, Svg, Path } from "@react-pdf/renderer";
import { Invoice } from "@/model/Invoice";

const FONT_FAMILY = "Helvetica";

const styles = StyleSheet.create({
  // page-level
  page: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 48,
    backgroundColor: "#ffffff",
    // ensure the page matches A4 visually
  },

  // container (like .page with card shadow in HTML; card shadow ignored on PDF)
  card: {
    // in HTML you had a centered card with max width; here we just use full page padding
    width: "100%",
    minHeight: "100%",
  },

  // header
  headerWrap: {
    marginBottom: 24,
    alignItems: "center",
  },
  docType: {
    fontSize: 40, // text-5xl ~ 48 in tailwind; 40 is close in PDF scale
    fontWeight: 800,
    letterSpacing: -0.5,
    color: "#111827", // dark-gray
  },

  // date/invoice row
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaLeft: {
    fontSize: 10,
    color: "#6b7280", // muted
  },
  metaRight: {
    fontSize: 10,
    color: "#6b7280",
    textAlign: "right",
  },
  metaLabel: {
    fontWeight: 600,
    color: "#111827",
  },

  // billed/from
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  partyBlock: {
    width: "48%",
  },
  partyTitle: {
    fontWeight: 700,
    color: "#111827",
    marginBottom: 6,
  },
  partyText: {
    color: "#374151", // gray-700
    lineHeight: 1.4,
    fontSize: 11,
  },

  // table wrapper
  tableWrapper: {
    borderWidth: 1,
    borderColor: "#e5e7eb", // gray-200
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
  },

  // table header (grid with 12 cols)
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6", // gray-100
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    fontSize: 11,
    fontWeight: 600,
    color: "#374151",
  },

  // table row
  tableRow: {
    flexDirection: "row",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    color: "#374151",
    fontSize: 11,
    borderBottomWidth: 1,
    borderColor: "#f3f4f6", // divide-gray-100
  },

  // column widths (12-grid)
  col6: { width: "50%" }, // 6/12
  col2: { width: "16.6667%" }, // 2/12
  col2Right: { width: "20%", textAlign: "right" },

  // totals section (right-aligned block)
  totalsAreaOuter: {
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalsAreaInner: {
    width: "50%",
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    color: "#374151",
    fontSize: 11,
  },
  totalsDividerTop: {
    borderTopWidth: 1,
    borderColor: "#d1d5db",
    paddingTop: 8,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  // payment & note
  paymentBlock: {
    marginTop: 18,
    fontSize: 11,
    color: "#374151",
  },
  paymentLabel: {
    fontWeight: 700,
    color: "#111827",
  },

  // footer curve container (positioning trick: place near bottom)
  footerWrap: {
    // place near bottom by adding marginTop (page height minus content). We can't absolute pos easily,
    // so render it at the end; it will appear near bottom of the page.
    marginTop: 32,
    width: "100%",
    height: 120,
  },
  svgStyle: {
    width: "100%",
    height: 120,
  },

  // small helpers
  rightText: { textAlign: "right" },
  bold: { fontWeight: 700 },
});

const currencyNumber = (n: number) => {
  const rounded = Math.round((n || 0) * 100) / 100;
  return rounded.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Rupee = ({
  size = 12,
  color = "#374151",
}: {
  size?: number;
  color?: string;
}) => (
  <Svg
    viewBox="0 0 24 24"
    style={{ width: size, height: size, marginRight: 2 }}
  >
    <Path
      d="M12.9494914,6 C13.4853936,6.52514205 13.8531598,7.2212202 13.9645556,8 L17.5,8 C17.7761424,8 18,8.22385763 18,8.5 C18,
    8.77614237 17.7761424,9 17.5,9 L13.9645556,9 C13.7219407,10.6961471 12.263236,12 10.5,12 L7.70710678,12 L13.8535534,18.1464466 
    C14.0488155,18.3417088 14.0488155,18.6582912 13.8535534,18.8535534 C13.6582912,19.0488155 13.3417088,19.0488155 13.1464466,18.8535534 
    L6.14644661,11.8535534 C5.83146418,11.538571 6.05454757,11 6.5,11 L10.5,11 C11.709479,11 12.7183558,10.1411202 12.9499909,9 L6.5,9 
    C6.22385763,9 6,8.77614237 6,8.5 C6,8.22385763 6.22385763,8 6.5,8 L12.9499909,8 C12.7183558,6.85887984 11.709479,6 10.5,6 L6.5,
    6 C6.22385763,6 6,5.77614237 6,5.5 C6,5.22385763 6.22385763,5 6.5,5 L10.5,5 L17.5,5 C17.7761424,5 18,5.22385763 18,5.5 C18,5.77614237 
    17.7761424,6 17.5,6 L12.9494914,6 L12.9494914,6 Z"
      fill={color}
    />
  </Svg>
);

// const rupee = String.fromCharCode(8377); // ₹

export default function InvoicePdf({ invoice }: { invoice: Invoice }) {
  const items = Array.isArray(invoice.items) ? invoice.items : [];

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerWrap}>
          <Text style={styles.docType}>{invoice.docType || "INVOICE"}</Text>
        </View>

        {/* Date and Invoice Number */}
        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLeft}>
              <Text style={styles.metaLabel}>Date: </Text>
              {new Date(invoice.date).toLocaleDateString("en-IN")}
            </Text>
          </View>
          <View>
            <Text style={styles.metaRight}>
              <Text style={styles.metaLabel}>INVOICE NO. </Text>
              {invoice.invoiceNumber}
            </Text>
          </View>
        </View>

        {/* Billed To / From */}
        <View style={styles.partiesRow}>
          <View style={styles.partyBlock}>
            <Text style={styles.partyTitle}>Billed To:</Text>
            <Text style={styles.partyText}>
              {invoice.customerDetails || ""}
            </Text>
          </View>

          <View style={[styles.partyBlock, { alignItems: "flex-end" }]}>
            <Text style={styles.partyTitle}>From:</Text>
            <Text style={styles.partyText}>{invoice.sellerDetails || ""}</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableHeader}>
            <Text style={styles.col6}>Item</Text>
            <Text style={[styles.col2, { textAlign: "center" }]}>Quantity</Text>
            <Text style={styles.col2Right}>Price</Text>
            <Text style={styles.col2Right}>Amount</Text>
          </View>

          <View>
            {items.length === 0 ? (
              <View style={[styles.tableRow]}>
                <Text style={styles.col6}>No items</Text>
                <Text style={[styles.col2, { textAlign: "center" }]}>-</Text>
                <Text style={styles.col2Right}>-</Text>
                <Text style={styles.col2Right}>-</Text>
              </View>
            ) : (
              items.map((item, idx) => (
                <View style={styles.tableRow} key={idx}>
                  <Text style={styles.col6}>{item.des || ""}</Text>
                  <Text style={[styles.col2, { textAlign: "center" }]}>
                    {item.qty || 0}
                  </Text>
                  <View
                    style={[
                      styles.col2Right,
                      {
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Rupee />
                    <Text>{currencyNumber(item.price || 0)}</Text>
                  </View>
                  <View
                    style={[
                      styles.col2Right,
                      {
                        flexDirection: "row",
                        justifyContent: "flex-end",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Rupee />
                    <Text>
                      {currencyNumber(item.amount || 0)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Totals area */}
          <View style={styles.totalsAreaOuter}>
            <View style={styles.totalsAreaInner}>
              <View style={styles.totalsRow}>
                <Text>SubTotal</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Rupee />
                  <Text> {currencyNumber(invoice.subTotal || 0)}</Text>
                </View>
              </View>

              {(invoice.discount || 0) > 0 && (
                <View style={styles.totalsRow}>
                  <Text>Discount {invoice.discount || 0}%</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Rupee />
                    <Text>{currencyNumber(invoice.discountAmount || 0)}</Text>
                  </View>
                </View>
              )}

              {(invoice.tax || 0) > 0 && (
                <View style={styles.totalsRow}>
                  <Text>Tax {invoice.tax || 0}%</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Rupee />
                    <Text> {currencyNumber(invoice.taxAmount || 0)}</Text>
                  </View>
                </View>
              )}

              {(invoice.shipCharges || 0) > 0 && (
                <View style={styles.totalsRow}>
                  <Text>Shipping Charges</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Rupee />
                    <Text> {currencyNumber(invoice.shipCharges || 0)}</Text>
                  </View>
                </View>
              )}

              <View style={styles.totalsDividerTop}>
                <Text style={[styles.bold, { fontSize: 12 }]}>
                  Total Amount
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Rupee color="#000000"/>
                  <Text style={[styles.bold, { fontSize: 12 }]}>
                    {currencyNumber(invoice.totalAmount || 0)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Payment and Note */}
        <View style={styles.paymentBlock}>
          <Text>
            <Text style={styles.paymentLabel}>Payment method: </Text>
            <Text>{invoice.payType || "Not specified"}</Text>
          </Text>

          <Text style={{ marginTop: 8 }}>
            <Text style={styles.paymentLabel}>Note: </Text>
            <Text>Thank you for choosing us!</Text>
          </Text>
        </View>
      </View>
    </Page>
  );
}
