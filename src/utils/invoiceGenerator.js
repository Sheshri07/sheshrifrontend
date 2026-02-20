import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateInvoicePDF = (order) => {
    const doc = new jsPDF();

    // Add Logo or Brand Name
    doc.setFontSize(20);
    doc.text("Kalki Fashion Clone", 14, 22);

    // Invoice Title
    doc.setFontSize(16);
    doc.text("INVOICE", 150, 22);

    // Order Details
    doc.setFontSize(10);
    doc.text(`Order ID: #${order._id.slice(-8)}`, 150, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 36);

    // Bill To
    doc.text("Bill To:", 14, 45);
    doc.setFont("helvetica", "bold");
    doc.text(order.shippingAddress.name, 14, 50);
    doc.setFont("helvetica", "normal");
    doc.text(order.shippingAddress.address, 14, 55);
    doc.text(
        `${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`,
        14,
        60
    );
    doc.text(order.shippingAddress.country, 14, 65);
    doc.text(`Phone: ${order.shippingAddress.phone}`, 14, 70);

    // Payment Information
    if (order.isPaid && order.paymentMethod !== 'COD') {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Payment Information:", 14, 80);
        doc.setFont("helvetica", "normal");
        doc.text(`Method: ${order.paymentMethod.toUpperCase()}`, 14, 85);
        if (order.paymentResult?.id) {
            doc.text(`Transaction ID: ${order.paymentResult.id}`, 14, 90);
        }
        if (order.paymentResult?.razorpay_order_id) {
            doc.text(`Razorpay ID: ${order.paymentResult.razorpay_order_id}`, 14, 95);
        }
    }

    // Items Table
    const tableColumn = ["Item", "Size", "Qty", "Price", "Total"];
    const tableRows = [];

    order.orderItems.forEach((item) => {
        // Main Item
        tableRows.push([
            item.name,
            item.size || "N/A",
            item.qty,
            `Rs. ${item.price.toLocaleString()}`,
            `Rs. ${(item.price * item.qty).toLocaleString()}`,
        ]);

        // Pre-Drape Add-on
        if (item.sareeAddOns?.preDrape) {
            tableRows.push([
                "  + Pre-Drape Service",
                "-",
                item.qty,
                "Rs. 1,750",
                `Rs. ${(1750 * item.qty).toLocaleString()}`,
            ]);
        }

        // Petticoat Add-on
        if (item.sareeAddOns?.petticoat) {
            tableRows.push([
                "  + Satin Petticoat",
                "-",
                item.qty,
                "Rs. 1,245",
                `Rs. ${(1245 * item.qty).toLocaleString()}`,
            ]);
        }

        // Stitching Details
        if (item.stitchingDetails?.option === 'Stitched') {
            tableRows.push([
                `  + Custom Stitching (${item.stitchingDetails.stitchingSize})`,
                "-",
                item.qty,
                "Included",
                "Rs. 0",
            ]);
        }
    });

    // AutoTable
    autoTable(doc, {
        startY: (order.isPaid && order.paymentMethod !== 'COD') ? 105 : 80,
        head: [tableColumn],
        body: tableRows,
        theme: "grid",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [66, 66, 66] },
    });

    // Summary
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.text(`Subtotal: Rs. ${order.itemsPrice.toLocaleString()}`, 140, finalY);
    doc.text(`Tax: Rs. ${order.taxPrice.toLocaleString()}`, 140, finalY + 6);
    doc.text(`Shipping: Rs. ${order.shippingPrice.toLocaleString()}`, 140, finalY + 12);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total: Rs. ${order.totalPrice.toLocaleString()}`, 140, finalY + 20);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for your business!", 14, finalY + 30);

    // Save PDF
    doc.save(`Invoice_${order._id}.pdf`);
};
