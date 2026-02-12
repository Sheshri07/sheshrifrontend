import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (order) => {
    try {
        // Robust check for different import structures
        const JsPDFClass = jsPDF.jsPDF || jsPDF;
        const doc = new JsPDFClass();

        // Company Logo/Name
        doc.setFontSize(26);
        doc.setTextColor(231, 76, 60); // Primary Red Color
        doc.text('Sheshri Fashion', 14, 22);

        // Invoice Title
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text('INVOICE', 14, 35);
        doc.setFontSize(10);
        doc.text(`Order ID: #${order._id || 'N/A'}`, 14, 42);
        doc.text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 14, 48);

        // Bill To Section
        doc.setFontSize(12);
        doc.text('Bill To:', 140, 35);
        doc.setFontSize(10);
        const shipping = order.shippingAddress || {};
        doc.text(shipping.name || '', 140, 42);
        doc.text(shipping.address || '', 140, 48);
        doc.text(`${shipping.city || ''}, ${shipping.postalCode || ''}`, 140, 54);
        doc.text(shipping.country || '', 140, 60);
        doc.text(`Phone: ${shipping.phone || ''}`, 140, 66);

        // Table Data & Calculation
        const tableColumn = ["Item", "Quantity", "Unit Price", "Total"];
        const tableRows = [];

        let productBaseTotal = 0;
        let preDrapeTotal = 0;
        let petticoatTotal = 0;

        (order.orderItems || []).forEach(item => {
            const price = item.price || 0;
            const qty = item.qty || 0;

            // --- Main Product Row ---
            let itemName = item.name || 'Unknown Item';

            // Stitching Details (stays with main item)
            if (item.stitchingDetails && item.stitchingDetails.option === 'Stitched') {
                itemName += `\n(Stitching: Stitched)`;
            }

            // Push Main Item
            tableRows.push([
                itemName,
                qty,
                `INR ${price.toLocaleString()}`,
                `INR ${(price * qty).toLocaleString()}`
            ]);
            productBaseTotal += (price * qty);

            // --- Add-on Rows ---
            if (item.sareeAddOns) {
                // Pre-Drape Row
                if (item.sareeAddOns.preDrape) {
                    const addOnPrice = 1750;
                    tableRows.push([
                        `Ready to Wear Service (for ${item.name || 'Item'})`,
                        qty,
                        `INR ${addOnPrice.toLocaleString()}`,
                        `INR ${(addOnPrice * qty).toLocaleString()}`
                    ]);
                    preDrapeTotal += (addOnPrice * qty);
                }

                // Petticoat Row
                if (item.sareeAddOns.petticoat) {
                    const addOnPrice = 1245;
                    tableRows.push([
                        `Satin Petticoat (for ${item.name || 'Item'})`,
                        qty,
                        `INR ${addOnPrice.toLocaleString()}`,
                        `INR ${(addOnPrice * qty).toLocaleString()}`
                    ]);
                    petticoatTotal += (addOnPrice * qty);
                }
            }
        });

        // Generate Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 80,
            theme: 'grid',
            headStyles: { fillColor: [231, 76, 60] },
            bodyStyles: { valign: 'top' },
            columnStyles: {
                0: { cellWidth: 90 }, // Give more width to Item column
            }
        });

        // Summary Information
        const finalY = doc.lastAutoTable?.finalY || 80;
        let currentY = finalY + 15;
        const summaryX = 140;

        // Subtotal (Product Base) matches the breakdown logic
        doc.text(`Subtotal: INR ${productBaseTotal.toLocaleString()}`, summaryX, currentY);
        currentY += 7;

        // Add-ons Summary (Redundant if in table, but requested to appear in breakdown previously. 
        // Keeping it ensures specific breakdown visibility, though strictly "Subtotal" usually sums the whole table.
        // Given the design image showed "Subtotal" distinct from "Ready to Wear", we will maintain that distinction in the footer labels
        // even though they are now line items.)

        if (preDrapeTotal > 0) {
            doc.text(`Ready to Wear: INR ${preDrapeTotal.toLocaleString()}`, summaryX, currentY);
            currentY += 7;
        }

        if (petticoatTotal > 0) {
            doc.text(`Satin Petticoat: INR ${petticoatTotal.toLocaleString()}`, summaryX, currentY);
            currentY += 7;
        }

        // Tax
        doc.text(`Tax: INR ${(order.taxPrice || 0).toLocaleString()}`, summaryX, currentY);
        currentY += 7;

        // Shipping (Explicitly Free as per design)
        doc.text(`Shipping: INR 0`, summaryX, currentY);
        currentY += 10;

        // Total Amount
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Amount: INR ${(order.totalPrice || 0).toLocaleString()}`, 100, currentY); // Adjusted X for larger text

        // Payment Status
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const paymentStatus = order.isPaid ? "PAID" : "UNPAID (COD)";
        doc.text(`Payment Status: ${paymentStatus}`, 14, finalY + 15);
        if (order.paymentMethod) {
            doc.text(`Payment Method: ${order.paymentMethod}`, 14, finalY + 22);
        }

        // Footer
        doc.setFontSize(10);
        doc.text('Thank you for shopping with us!', 14, doc.internal.pageSize.height - 20);

        // Save the PDF
        doc.save(`Invoice_${order._id || 'unknown'}.pdf`);
    } catch (error) {
        console.error("Internal PDF generation error:", error);
        throw error;
    }
};
