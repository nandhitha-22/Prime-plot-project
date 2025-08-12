// ✅ UPDATED plots.js (upload logic + display plotName)

// Preview image when file selected
document.getElementById("imageUpload").addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("imagePreview");
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }
});

// Display all saved plots from localStorage
function displayUploadedImages() {
  const container = document.getElementById("plotsContainer");
  container.innerHTML = "";

  const storedPlots = JSON.parse(localStorage.getItem("galleryImages")) || [];
  if (storedPlots.length === 0) {
    container.innerHTML = "<p>No plots uploaded yet.</p>";
    return;
  }

  storedPlots.forEach((plot, index) => {
    const div = document.createElement("div");
    div.className = "plot-item";
    div.innerHTML = `
      <img src="${plot.image}" alt="Plot Image ${index + 1}" />
      <div class="plot-details">
        <strong>Plot Name:</strong> ${plot.plotName || "N/A"}<br/>
        <strong>Location:</strong> ${plot.location}<br/>
        <strong>Price:</strong> ${plot.price}<br/>
        <strong>Size:</strong> ${plot.size} acres
      </div>
    `;
    container.appendChild(div);
  });
}

// Upload button click handler
document.getElementById("uploadBtn").addEventListener("click", function () {
  const imageFile = document.getElementById("imageUpload").files[0];
  const location = document.getElementById("locationInput").value;
  const price = document.getElementById("priceInput").value;
  const size = document.getElementById("sizeInput").value;
  const plotName = document.getElementById("plotNameInput").value;

  if (!imageFile || !location || !price || !size || !plotName) {
    alert("Please fill in all fields including Plot Name and upload an image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;
    const newPlot = {
      image: imageData,
      location: location,
      price: price,
      size: size,
      plotName: plotName,
    };

    const existingPlots =
      JSON.parse(localStorage.getItem("galleryImages")) || [];
    existingPlots.push(newPlot);
    localStorage.setItem("galleryImages", JSON.stringify(existingPlots));

    alert("Plot uploaded successfully!");
    displayUploadedImages();
  };

  reader.readAsDataURL(imageFile);
});

// Call display on page load
window.addEventListener("load", displayUploadedImages);
