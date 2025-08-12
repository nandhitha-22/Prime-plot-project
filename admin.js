// ✅ MERGED admin.js with booking dashboard enhancements (plotName + location)

// Select HTML elements
const loginForm = document.getElementById("loginForm");
const adminPanel = document.getElementById("adminPanel");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const adminUsername = document.getElementById("adminUsername");
const logoutBtn = document.getElementById("logoutBtn");
const loginFormSubmit = document.getElementById("loginFormSubmit");

// Auto-login if already authenticated
if (localStorage.getItem("loggedIn") === "true") {
  showAdminPanel();
  displayUploadedImages();
  displayBookings();
}

// Handle login
loginFormSubmit.addEventListener("submit", function (event) {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (username === "PrimePlots" && password === "prime") {
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("username", username);
    showAdminPanel();
    displayUploadedImages();
    displayBookings();
  } else {
    alert("Invalid username or password.");
  }
});

// Show admin panel
function showAdminPanel() {
  const username = localStorage.getItem("username");
  adminUsername.textContent = username;
  loginForm.style.display = "none";
  adminPanel.style.display = "block";
  logoutBtn.style.display = "block";
}

// Handle logout
logoutBtn.addEventListener("click", function () {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("username");
  loginForm.style.display = "block";
  adminPanel.style.display = "none";
  logoutBtn.style.display = "none";
});

// Handle upload
document.getElementById("uploadBtn").addEventListener("click", function () {
  const plotName = document.getElementById("plotName").value.trim();
  const imageFile = document.getElementById("imageUpload").files[0];
  const ecFile = document.getElementById("plotEC").files[0];
  const location = document.getElementById("plotLocation").value.trim();
  const price = document.getElementById("plotPrice").value.trim();
  const size = document.getElementById("plotSize").value.trim();

  if (!plotName || !imageFile || !ecFile || !location || !price || !size) {
    alert("Please fill all fields and upload EC document.");
    return;
  }

  const imageReader = new FileReader();
  const ecReader = new FileReader();

  imageReader.onload = function (e) {
    const imageData = e.target.result;

    ecReader.onload = function (ecEvent) {
      const ecData = ecEvent.target.result;

      const newPlot = {
        plotName,
        image: imageData,
        location,
        price,
        size,
        ecDocument: ecData,
        ecFileName: ecFile.name,
      };

      const storedPlots =
        JSON.parse(localStorage.getItem("galleryImages")) || [];
      storedPlots.push(newPlot);
      localStorage.setItem("galleryImages", JSON.stringify(storedPlots));

      alert("Plot uploaded successfully!");
      clearForm();
      displayUploadedImages();
    };

    ecReader.readAsDataURL(ecFile);
  };

  imageReader.readAsDataURL(imageFile);
});

// Clear input fields after upload
function clearForm() {
  document.getElementById("plotName").value = "";
  document.getElementById("imageUpload").value = "";
  document.getElementById("plotLocation").value = "";
  document.getElementById("plotPrice").value = "";
  document.getElementById("plotSize").value = "";
  document.getElementById("plotEC").value = "";
  document.getElementById("imagePreview").style.display = "none";
}

// Preview selected image
function previewImage() {
  const file = document.getElementById("imageUpload").files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("previewImg").src = e.target.result;
      document.getElementById("imagePreview").style.display = "block";
    };
    reader.readAsDataURL(file);
  }
}

// Display uploaded plots
function displayUploadedImages() {
  const uploadedImagesDiv = document.getElementById("uploadedImages");
  if (!uploadedImagesDiv) return;
  uploadedImagesDiv.innerHTML = "";

  const storedPlots = JSON.parse(localStorage.getItem("galleryImages")) || [];

  if (storedPlots.length === 0) {
    uploadedImagesDiv.innerHTML = "<p>No plots uploaded yet.</p>";
    return;
  }

  storedPlots.forEach((plot, index) => {
    const colDiv = document.createElement("div");
    colDiv.className = "col-md-4 mb-3";

    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.src = plot.image;
    img.className = "card-img-top";
    img.alt = "Plot Image";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    cardBody.innerHTML = `
      <p><strong>Plot Name:</strong> ${plot.plotName}</p>
      <p><strong>Location:</strong> ${plot.location}</p>
      <p><strong>Price:</strong> ${plot.price}</p>
      <p><strong>Size:</strong> ${plot.size}</p>
      <a href="${plot.ecDocument}" download="${plot.ecFileName}" class="btn btn-secondary btn-sm mb-2">Download EC</a>
      <button class="btn btn-danger btn-sm" onclick="deletePlot(${index})">Delete</button>
    `;

    card.appendChild(img);
    card.appendChild(cardBody);
    colDiv.appendChild(card);
    uploadedImagesDiv.appendChild(colDiv);
  });
}

// Delete a plot
function deletePlot(index) {
  const storedPlots = JSON.parse(localStorage.getItem("galleryImages")) || [];
  storedPlots.splice(index, 1);
  localStorage.setItem("galleryImages", JSON.stringify(storedPlots));
  displayUploadedImages();
}

// Display bookings with plotName and location
function displayBookings() {
  const tableBody = document.getElementById("bookingTableBody");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
  const plots = JSON.parse(localStorage.getItem("galleryImages")) || [];

  bookings.forEach((booking, index) => {
    const matchedPlot = plots.find((p) => p.plotName === booking.plotName);
    const location = matchedPlot ? matchedPlot.location : "N/A";

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${booking.name}</td>
      <td>${booking.email}</td>
      <td>${booking.phone}</td>
      <td>${booking.plotName}</td>
      <td>${location}</td>
      <td>${booking.paymentStatus || "Pending"}</td>
      <td>${booking.date || "-"}</td>
    `;
    tableBody.appendChild(row);
  });
}
