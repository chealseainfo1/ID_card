document.getElementById("cardForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const { jsPDF } = window.jspdf;

    const name = document.getElementById("name").value;
    const card = document.getElementById("card").value;
    const state = document.getElementById("state").value;
    const lga = document.getElementById("lga").value;
    const ward = document.getElementById("ward").value;
    const photoFile = document.getElementById("photo").files[0];

    const reader = new FileReader();

    reader.onload = function(event) {
        const imgData = event.target.result;

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: [85.6, 54]
        });

        // Border
        doc.rect(1, 1, 83.6, 52);

        // Header
        doc.setFontSize(8);
        doc.text("NZE ELUGWU UMUEZEKPOKO", 43, 6, { align: "center" });
        doc.text("MEMBERSHIP CARD", 43, 10, { align: "center" });

        // Photo
        doc.addImage(imgData, "JPEG", 5, 12, 20, 20);

        // Text details
        doc.setFontSize(7);
        doc.text(`Name: ${name}`, 28, 16);
        doc.text(`Card No: ${card}`, 28, 21);
        doc.text(`State: ${state}`, 28, 26);
        doc.text(`LGA: ${lga}`, 28, 31);
        doc.text(`Ward: ${ward}`, 28, 36);

        // Generate QR code (temporary canvas)
        const qrDiv = document.createElement("div");
        new QRCode(qrDiv, {
            text: `${name} | ${card} | ${state}`,
            width: 80,
            height: 80
        });

        setTimeout(() => {
            const qrImg = qrDiv.querySelector("img").src;

            // Add QR to PDF
            doc.addImage(qrImg, "PNG", 65, 30, 18, 18);

            // Footer
            doc.text("Scan to verify", 65, 28);
            doc.text("Chairman      Secretary", 30, 50);

            doc.save("membership_card.pdf");
        }, 500);
    };

    reader.readAsDataURL(photoFile);
});
