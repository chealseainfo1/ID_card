const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");

let latestImage = null;

document.getElementById("cardForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const card = document.getElementById("card").value;
    const state = document.getElementById("state").value;
    const lga = document.getElementById("lga").value;
    const ward = document.getElementById("ward").value;
    const file = document.getElementById("photo").files[0];

    const reader = new FileReader();

    reader.onload = function(evt) {
        const img = new Image();
        img.onload = function() {

            // Background (green theme)
            ctx.fillStyle = "#0a7d2c";
            ctx.fillRect(0, 0, 340, 60);

            ctx.fillStyle = "white";
            ctx.fillRect(0, 60, 340, 155);

            // Header text
            ctx.fillStyle = "white";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.fillText("AFRICAN DEMOCRATIC CONGRESS", 170, 20);
            ctx.font = "10px Arial";
            ctx.fillText("MEMBERSHIP CARD", 170, 40);

            // Photo
            ctx.drawImage(img, 10, 75, 70, 70);

            // Text
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.font = "10px Arial";

            ctx.fillText("Name: " + name, 90, 90);
            ctx.fillText("Card: " + card, 90, 105);
            ctx.fillText("State: " + state, 90, 120);
            ctx.fillText("LGA: " + lga, 90, 135);
            ctx.fillText("Ward: " + ward, 90, 150);

            // QR
            const qrDiv = document.createElement("div");
            new QRCode(qrDiv, {
                text: `${name}|${card}|${state}`,
                width: 80,
                height: 80
            });

            setTimeout(() => {
                const qrImg = new Image();
                qrImg.src = qrDiv.querySelector("img").src;

                qrImg.onload = function() {
                    ctx.drawImage(qrImg, 250, 100, 70, 70);
                };
            }, 300);

            latestImage = canvas.toDataURL("image/png");
        };

        img.src = evt.target.result;
    };

    reader.readAsDataURL(file);
});

document.getElementById("downloadBtn").addEventListener("click", function() {
    if (!latestImage) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [85.6, 54]
    });

    doc.addImage(latestImage, "PNG", 0, 0, 85.6, 54);
    doc.save("adc_card.pdf");
});
