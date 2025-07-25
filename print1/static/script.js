document.addEventListener("DOMContentLoaded", function() {
    // Adding the submit listener to the form, with the 'once' option to ensure it only fires once
    document.getElementById("pdfForm").addEventListener("submit", async function(event) {
        event.preventDefault(); // Prevent form submission

        // Get input values from the form
        var customerName = document.getElementById("customerName").value;
        var invoiceDate = document.getElementById("invoiceDate").value;
        var items = document.getElementById("items").value;
        var totalAmount = document.getElementById("totalAmount").value;
        var customerAddress = document.getElementById("customerAddress").value;


        // Generate PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Load images using async function
        async function loadImage(src) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = () => resolve(img);
                img.onerror = () => reject(`Failed to load image: ${src}`);
            });
        }

        try {
            // Load images
            const watermarkLogo = await loadImage('/static/linenoriginalbg.png');
            const companyLogo = await loadImage('/static/linenoriginallogo.png');
            const lastLogo = await loadImage('/static/linenoriginallastlogo.png');

            // Create a temporary canvas to modify watermark opacity
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            canvas.width = watermarkLogo.width;
            canvas.height = watermarkLogo.height;
            ctx.globalAlpha = 0.1; // Reduce opacity
            ctx.drawImage(watermarkLogo, 0, 0, canvas.width, canvas.height);

            // Convert canvas to base64 for watermark image
            const logoBase64 = canvas.toDataURL("image/png");

            // Add watermark to PDF
            doc.addImage(logoBase64, 'PNG', 5, 60, 200, 200);

            // Add Company Logo to the Top-Left Corner
            doc.addImage(companyLogo, 'PNG', 5, 5, 60, 40);

            // Add last logo at the bottom
            doc.addImage(lastLogo, 'PNG', 30, 260, 150, 40);

            // Add Custom Font
            doc.addFileToVFS("CustomFont.ttf", "/static/fonts/jack.ttf"); // Ensure the correct path
            doc.addFont("/static/fonts/jack.ttf", "CustomFont", "bold");
            doc.setFont("CustomFont");  // Apply the custom font

            // Invoice Header
            doc.setFontSize(35);
            doc.text("INVOICE", 150, 40);

            doc.setFontSize(14);
            doc.text(`
                    Mahijas Shopping Unit, 9/72 I
                    Kunduchira, Thalassery,
                    Kannur, Kerala. 670641
                    Ph : +91 907 4328 053
                    Email : linenoriginal@gmail.com`, 50, 15);

            
            doc.line(0, 50, 220, 50);

            // Date & Customer Info
            doc.setFontSize(15);
            doc.text(`Date: ${invoiceDate}`, 150, 65);
            doc.text(`Billed To: ${customerName}`, 20, 65);

            doc.setFontSize(10);
            doc.text(`Address: ${customerAddress}`, 20, 70);


            // Table Headers
            doc.setFontSize(21);
            doc.text("Item", 25, 105);
            doc.text("Quantity", 80, 105);
            doc.text("Unit Price", 112, 105);
            doc.text("Total", 155, 105);

            // Draw lines for headers
            doc.line(20, 107, 190, 107); // Horizontal line after header

            // Table Data
            doc.setFontSize(18);
            let yPos = 120;
            let lines = items.split("\n");
            lines.forEach((line) => {
                let [item, qty, price, total] = line.split(",");
                doc.text(item, 20, yPos);
                doc.text(qty, 90, yPos);
                doc.text(price, 120, yPos);
                doc.text(total, 160, yPos);

                // Draw lines for the data
                doc.line(20, yPos + 2, 190, yPos + 2); // Line below each row
                yPos += 15;
            });

            // Total Section
            doc.setFontSize(20);
            doc.text(`Total Amount: Rs${totalAmount}/-`, 110, yPos + 10);

            // Save the PDF
            doc.save("invoice.pdf");
        } catch (error) {
            console.error("Error loading images: ", error);
            alert("There was an issue loading images. Please try again.");
        }
    }, { once: true }); // The 'once' option ensures the event listener is triggered only once
});
