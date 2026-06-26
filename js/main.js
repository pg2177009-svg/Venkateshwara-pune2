const SHOP_LAT = 17.9784;
const SHOP_LNG = 79.5941;
const WHATSAPP_NUMBER = '916302323693';
const EMAILJS_SERVICE_ID = 'service_e981oyo';
const EMAILJS_TEMPLATE_ID = 'template_7s7g4up';
const EMAILJS_PUBLIC_KEY = 'kQz3u3cf1bT4VUxwQ';

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggle || !navLinks) {
    return;
  }

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
}

function setActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.toLowerCase();
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const normalized = href.toLowerCase();
    if (
      (currentPath.endsWith('index.html') && normalized.includes('index.html')) ||
      (currentPath.endsWith('/') && normalized.includes('index.html')) ||
      (currentPath.includes(normalized) && normalized !== 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}

function initIntersectionObserver() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  elements.forEach(element => observer.observe(element));
}

function showFieldError(input, message) {
  const error = input.parentElement.querySelector('.error-text');
  if (error) {
    error.textContent = message;
  }
  input.classList.add('invalid');
}

function clearFieldError(input) {
  const error = input.parentElement.querySelector('.error-text');
  if (error) {
    error.textContent = '';
  }
  input.classList.remove('invalid');
}

function buildWhatsAppUrl(details) {
  const encodedText = encodeURIComponent(details);
  return `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodedText}`;
}

function openWhatsAppChat(details) {
  const url = buildWhatsAppUrl(details);
  const popup = window.open(url, '_blank', 'noopener,noreferrer');
  if (!popup) {
    window.location.href = url;
  }
}

function initEmailJS() {
  if (window.emailjs) {
    window.emailjs.init(EMAILJS_PUBLIC_KEY);
  }
}

function validateContactForm() {
  const form = document.getElementById('enquiry-form');
  if (!form) {
    return;
  }

  const nameInput = document.getElementById('full-name');
  const emailInput = document.getElementById('email-address');
  const phoneInput = document.getElementById('phone-number');
  const gstInput = document.getElementById('gst-number');
  const typeSelect = document.getElementById('enquiry-type');
  const successBox = document.getElementById('form-success');
  const submitButton = document.getElementById('submit-enquiry');

  form.addEventListener('submit', event => {
    event.preventDefault();

    let valid = true;
    const nameValue = nameInput.value.trim();
    const emailValue = emailInput.value.trim();
    const phoneValue = phoneInput.value.trim();
    const gstValue = gstInput.value.trim().toUpperCase();
    const typeValue = typeSelect.value;

    clearFieldError(nameInput);
    clearFieldError(emailInput);
    clearFieldError(phoneInput);
    clearFieldError(gstInput);
    clearFieldError(typeSelect);

    if (nameValue.length < 3) {
      showFieldError(nameInput, 'Please enter your full name (min 3 characters)');
      valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      showFieldError(emailInput, 'Please enter a valid email address');
      valid = false;
    }

    if (!/^[0-9]{10}$/.test(phoneValue)) {
      showFieldError(phoneInput, 'Please enter a valid 10-digit phone number');
      valid = false;
    }

    if (!/^[0-9A-Z]{15}$/.test(gstValue)) {
      showFieldError(gstInput, 'Please enter a valid 15-character GST number');
      valid = false;
    }

    if (!typeValue || typeValue === 'default') {
      showFieldError(typeSelect, 'Please select an enquiry type');
      valid = false;
    }

    if (!valid) {
      return;
    }

    const businessValue = document.getElementById('business-name').value.trim();
    const locationValue = document.getElementById('location').value.trim();
    const quantityValue = document.getElementById('quantity').value.trim();
    const messageValue = document.getElementById('message').value.trim();

    const templateParams = {
      full_name: nameValue,
      email: emailValue,
      phone_number: phoneValue,
      gst_number: gstValue,
      business_name: businessValue,
      location: locationValue,
      enquiry_type: typeSelect.options[typeSelect.selectedIndex].text,
      quantity: quantityValue,
      message: messageValue,
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    if (!window.emailjs) {
      if (successBox) {
        successBox.innerHTML = `<div class="success-box fade-in visible" style="border-color:#c62828;color:#c62828;">
          <p>⚠️ Unable to send enquiry</p>
          <p>Email service is currently unavailable. Please try again shortly.</p>
        </div>`;
        successBox.scrollIntoView({ behavior: 'smooth' });
      }
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = '📨 Send Enquiry';
      }
      return;
    }

    window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(() => {
        form.reset();
        if (successBox) {
          successBox.innerHTML = `<div class="success-box fade-in visible">
            <p>✅ Thank you, ${nameValue}!</p>
            <p>Your enquiry has been sent successfully. We will get back to you soon.</p>
            <p>— Venkateshwara Beedi Puna, Hanamkonda</p>
            <p>📞 +91 96401 90330</p>
          </div>`;
          successBox.scrollIntoView({ behavior: 'smooth' });
        }
      })
      .catch(error => {
        console.error('EmailJS send failed:', error);
        if (successBox) {
          successBox.innerHTML = `<div class="success-box fade-in visible" style="border-color:#c62828;color:#c62828;">
            <p>⚠️ Unable to send enquiry</p>
            <p>Please try again or contact us directly on WhatsApp.</p>
          </div>`;
          successBox.scrollIntoView({ behavior: 'smooth' });
        }
      })
      .finally(() => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = '📨 Send Enquiry';
        }
      });
  });
}

function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}

function initLocationPage() {
  const locationButton = document.getElementById('find-location-btn');
  const locationResult = document.getElementById('location-result');

  if (!locationButton || !locationResult) {
    return;
  }

  function renderMessage(type, html) {
    locationResult.innerHTML = `<div class="result-box ${type}">${html}</div>`;
  }

  function createMapsUrl(lat, lng) {
    return `https://www.google.com/maps/dir/${lat},${lng}/${SHOP_LAT},${SHOP_LNG}`;
  }

  function renderManualButton(label, url) {
    return `<div style="margin-top:18px; display:flex; justify-content:center;">
      <a class="btn btn-primary" href="${url}" target="_blank" rel="noreferrer noopener">${label}</a>
    </div>`;
  }

  locationButton.addEventListener('click', () => {
    renderMessage('info', '📡 Fetching your location...');

    if (!navigator.geolocation) {
      renderMessage('error', '❌ Geolocation is not supported by your browser. Please use the address below or open Google Maps manually.' + renderManualButton('🗺️ Open in Google Maps', `https://www.google.com/maps/search/Brahmana+Wada+Hanamkonda+Telangana+506001`));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const distance = haversineDistance(userLat, userLng, SHOP_LAT, SHOP_LNG);
        const mapUrl = createMapsUrl(userLat, userLng);
        renderMessage('success', `📍 You are ${distance} km away from Venkateshwara Beedi Puna.` + renderManualButton('🗺️ Open Google Maps Directions', mapUrl));
        window.open(mapUrl, '_blank');
      },
      error => {
        if (error.code === error.PERMISSION_DENIED) {
          renderMessage('warning', '⚠️ Location access was denied. Please use the address below or open Google Maps manually.' + renderManualButton('🗺️ Open in Google Maps', `https://www.google.com/maps/search/Brahmana+Wada+Hanamkonda+Telangana+506001`));
          return;
        }
        renderMessage('error', '❌ Unable to fetch your location. Please check GPS settings and try again.' + renderManualButton('🗺️ Open in Google Maps', `https://www.google.com/maps/search/Brahmana+Wada+Hanamkonda+Telangana+506001`));
      },
      {
        timeout: 20000,
      }
    );
  });
}

function closeNavOnLinkClick() {
  const links = document.querySelectorAll('.nav-link');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (toggle && navLinks && navLinks.classList.contains('open')) {
        toggle.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  setActiveNavLink();
  initIntersectionObserver();
  initEmailJS();
  validateContactForm();
  initLocationPage();
  closeNavOnLinkClick();
});
