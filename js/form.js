/* ============================================
   WESTERN GB TRAVEL & TOURS - Form Handler
   Sends form data to Google Sheets
   ============================================ */

// Google Apps Script Web App URL — Replace with your actual URL after setup
// IMPORTANT: Set this to your deployed Google Apps Script URL before going live
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';

/**
 * Handle form submission
 * @param {Event} e - Form submit event
 * @param {string} formType - Type of form (tour, hotel, car, contact)
 */
async function handleFormSubmit(e, formType) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const formContainer = form.closest('.form-container');
  const successMessage = formContainer ? formContainer.querySelector('.form-success') : null;

  // Disable button and show loading
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;

  // Collect form data
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Add metadata
  data.formType = formType;
  data.submittedAt = new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' });
  data.pageUrl = window.location.href;

  try {
    // Guard: ensure the script URL has been configured
    if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL') {
      console.warn('Google Apps Script URL not configured. Falling back to WhatsApp.');
      openWhatsAppFallback(data, formType);
      return;
    }

    // Send to Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Show success (no-cors always returns opaque response)
    form.style.display = 'none';
    if (successMessage) {
      successMessage.classList.add('show');
    }

    // Reset form for potential reuse
    form.reset();

  } catch (error) {
    // Fallback: open WhatsApp with the booking details
    console.error('Form submission error:', error);
    openWhatsAppFallback(data, formType);
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

/**
 * Fallback: Send booking via WhatsApp if Google Sheets fails
 */
function openWhatsAppFallback(data, formType) {
  const phone = '923409333238';
  let message = `🌟 *New ${formType.toUpperCase()} Booking Request* 🌟\n\n`;

  for (const [key, value] of Object.entries(data)) {
    if (value && key !== 'formType' && key !== 'pageUrl' && key !== 'submittedAt') {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').trim();
      message += `*${label}:* ${value}\n`;
    }
  }

  message += `\n📅 Submitted: ${data.submittedAt}`;
  message += `\n\n_Sent from Western GB Travel Website_`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');

  alert('We are redirecting you to WhatsApp to complete your booking. Thank you!');
}

/**
 * Initialize all forms on the page
 */
document.addEventListener('DOMContentLoaded', () => {
  // Tour booking form
  const tourForm = document.getElementById('tour-booking-form');
  if (tourForm) {
    tourForm.addEventListener('submit', (e) => handleFormSubmit(e, 'tour'));
  }

  // Hotel booking form
  const hotelForm = document.getElementById('hotel-booking-form');
  if (hotelForm) {
    hotelForm.addEventListener('submit', (e) => handleFormSubmit(e, 'hotel'));
  }

  // Car rental form
  const carForm = document.getElementById('car-booking-form');
  if (carForm) {
    carForm.addEventListener('submit', (e) => handleFormSubmit(e, 'car'));
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, 'contact'));
  }

  // Air ticket form
  const airForm = document.getElementById('air-ticket-form');
  if (airForm) {
    airForm.addEventListener('submit', (e) => handleFormSubmit(e, 'air-ticket'));
  }
});
