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
        const photoData = event.target.result;

        const logo = new Image();
        logo.src = "logo.png";

        logo.onload = function() {

            const doc = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: [85.6, 54]
            });

            // Border
            doc.rect(1, 1, 83.6, 52);

            // LOGO (top-left)
            doc.addImage(logo, "PNG", 3, 3, 12, 12);

            // Header
            doc.setFontSize(8);
            doc.text("AFRICAN DEMOCRATIC CONGRESS", 43, 7, { align: "center" });
            doc.text("MEMBERSHIP CARD", 43, 11, { align: "center" });

            // Photo
            doc.addImage(photoData, "JPEG", 3, 18, 18, 18);

            // Details
            doc.setFontSize(7);
            doc.text(`Name: ${name}`, 25, 18);
            doc.text(`Card No: ${card}`, 25, 23);
            doc.text(`State: ${state}`, 25, 28);
            doc.text(`LGA: ${lga}`, 25, 33);
            doc.text(`Ward: ${ward}`, 25, 38);

            // QR code
            const qrDiv = document.createElement("div");
            new QRCode(qrDiv, {
                text: `${name} | ${card} | ${state}`,
                width: 80,
                height: 80
            });

            setTimeout(() => {
                const qrImg = qrDiv.querySelector("img").src;

                doc.addImage(qrImg, "PNG", 65, 32, 16, 16);

                doc.setFontSize(6);
                doc.text("Scan to verify", 62, 30);
                doc.text("Chairman   Secretary", 25, 50);

                doc.save("membership_card.pdf");
            }, 500);
        };
    };

    reader.readAsDataURL(photoFile);
});
