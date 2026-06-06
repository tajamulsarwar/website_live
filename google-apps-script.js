// ============================================
// WESTERN GB TRAVEL & TOURS
// Google Apps Script — Form Handler
// ============================================
// SETUP:
// 1. Open your Google Sheet
// 2. Go to Extensions → Apps Script
// 3. Paste this entire code
// 4. Click Deploy → New Deployment
// 5. Select Type: Web App
// 6. Set "Execute as": Me
// 7. Set "Who has access": Anyone
// 8. Click Deploy and copy the URL
// 9. Paste the URL in js/form.js (replace YOUR_GOOGLE_APPS_SCRIPT_URL)
// ============================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Bookings");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    }

    var data = JSON.parse(e.postData.contents);

    // Build the row
    var row = [
      new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }), // Timestamp
      data.formType || "",           // Form Type (tour, hotel, car, air-ticket, contact)
      data.fullName || "",           // Full Name
      data.contactNumber || data.phone || "",  // Contact Number
      data.email || "",              // Email
      data.service || data.package || data.vehicleType || data.preferredAirline || "", // Service
      data.destination || data.preferredHotel || data.fromCity + " → " + data.toCity || "", // Destination
      data.travelDate || data.departureDate || data.checkIn || data.arrivalDate || "", // Travel Date
      data.adults || data.passengers || data.travelers || "", // Adults
      data.kids || "",               // Kids
      data.message || data.notes || data.specialRequests || "", // Message
      buildExtraDetails(data)        // Extra Details (all remaining fields)
    ];

    sheet.appendRow(row);

    // Send email notification
    sendNotificationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "success", message: "Data saved" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok", message: "Western GB Travel form handler is running" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Build extra details string from remaining fields
function buildExtraDetails(data) {
  var skipFields = [
    "formType", "fullName", "contactNumber", "phone", "email",
    "service", "package", "vehicleType", "preferredAirline",
    "destination", "preferredHotel", "fromCity", "toCity",
    "travelDate", "departureDate", "checkIn", "arrivalDate",
    "adults", "passengers", "travelers", "kids",
    "message", "notes", "specialRequests", "submittedAt", "pageUrl"
  ];

  var extras = [];
  for (var key in data) {
    if (skipFields.indexOf(key) === -1 && data[key]) {
      var label = key.replace(/([A-Z])/g, " $1").trim();
      extras.push(label + ": " + data[key]);
    }
  }
  return extras.join(" | ");
}

// Send email notification on new booking
function sendNotificationEmail(data) {
  try {
    var emailTo = "westerngbt@gmail.com"; // Change if needed
    var subject = "🌟 New " + (data.formType || "Website").toUpperCase() + " Booking - Western GB Travel";

    var body = "New booking received from the website!\n\n";
    body += "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    body += "📋 BOOKING DETAILS\n";
    body += "━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

    for (var key in data) {
      if (data[key] && key !== "pageUrl" && key !== "submittedAt") {
        var label = key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();
        label = label.charAt(0).toUpperCase() + label.slice(1);
        body += "• " + label + ": " + data[key] + "\n";
      }
    }

    body += "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
    body += "📅 Received: " + new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi" }) + "\n";
    body += "🌐 From: " + (data.pageUrl || "Website") + "\n";
    body += "\n— Western GB Travel & Tours Website";

    MailApp.sendEmail(emailTo, subject, body);
  } catch (err) {
    // Email failed silently — data is still saved in sheet
    Logger.log("Email error: " + err);
  }
}
