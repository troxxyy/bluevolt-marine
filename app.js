/* ==========================================================================
   BLUEVOLT MARIN - INTERACTIVE SCRIPT
   Handles: Bilingual Switcher, Mobile Menu, FAQ Accordion, WhatsApp Generator, Live Telemetry Simulation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // ------------------------------------------------------------------------
  // 1. BILINGUAL CONTROLLER (ENGLISH / TURKISH)
  // ------------------------------------------------------------------------
  const langBtn = document.getElementById('lang-switch-btn');
  const body = document.body;
  const currentLangText = langBtn.querySelector('.current-lang');

  // Load language preference from local storage or default to English
  const savedLang = localStorage.getItem('bluevolt_lang') || 'en';
  setLanguage(savedLang);

  langBtn.addEventListener('click', () => {
    const activeLang = body.classList.contains('lang-en') ? 'tr' : 'en';
    setLanguage(activeLang);
  });

  function setLanguage(lang) {
    if (lang === 'tr') {
      body.classList.remove('lang-en');
      body.classList.add('lang-tr');
      currentLangText.textContent = 'TR';
      localStorage.setItem('bluevolt_lang', 'tr');
      // Update HTML lang attribute for search crawlers (SEO benefit)
      document.documentElement.setAttribute('lang', 'tr');
    } else {
      body.classList.remove('lang-tr');
      body.classList.add('lang-en');
      currentLangText.textContent = 'EN';
      localStorage.setItem('bluevolt_lang', 'en');
      document.documentElement.setAttribute('lang', 'en');
    }
  }

  // ------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // ------------------------------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when navigation item is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // ------------------------------------------------------------------------
  // 3. AEO FAQ ACCORDION (SMOOTH MAX-HEIGHT ANIMATION)
  // ------------------------------------------------------------------------
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', function() {
      const parent = this.parentElement;
      const answer = this.nextElementSibling;
      const isActive = parent.classList.contains('active');

      // Close all other FAQ items for a cleaner accordion feel
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isActive) {
        parent.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ------------------------------------------------------------------------
  // 4. DYNAMIC WHATSAPP TEMPLATE FORM SUBMISSION
  // ------------------------------------------------------------------------
  const form = document.getElementById('yacht-service-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Fetch form details
    const name = document.getElementById('client-name').value.trim();
    const yacht = document.getElementById('yacht-model').value.trim() || 'N/A';
    const location = document.getElementById('yacht-location').value.trim() || 'N/A';
    const serviceSelect = document.getElementById('service-type');
    const serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
    const message = document.getElementById('service-message').value.trim();

    // Determine target language based on active body class
    const isEn = body.classList.contains('lang-en');

    // Create the message template
    let text = '';
    if (isEn) {
      text = `⚡ *Bluevolt Marin Service Request* ⚡\n\n` +
             `• *Captain/Client:* ${name}\n` +
             `• *Yacht Name/Model:* ${yacht}\n` +
             `• *Location:* ${location}\n` +
             `• *Service Needed:* ${serviceText}\n\n` +
             `💬 *Description:* ${message}\n\n` +
             `_Sent via bluevoltmarine.com_`;
    } else {
      text = `⚡ *Bluevolt Marin Teknik Servis Talebi* ⚡\n\n` +
             `• *Kaptan/Müşteri:* ${name}\n` +
             `• *Yat Adı/Modeli:* ${yacht}\n` +
             `• *Mevcut Konum:* ${location}\n` +
             `• *İstenen Hizmet:* ${serviceText}\n\n` +
             `💬 *Açıklama:* ${message}\n\n` +
             `_bluevoltmarine.com üzerinden gönderildi_`;
    }

    // Format for URL query
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/905372429915?text=${encodedText}`;

    // Open WhatsApp in a new window/tab
    window.open(whatsappUrl, '_blank');
  });

  // ------------------------------------------------------------------------
  // 5. LIVE TELEMETRY SIMULATION (Visual Polish / WOW Factor)
  // ------------------------------------------------------------------------
  const gaugeValEl = document.querySelector('.gauge-value');
  const gaugePath = document.getElementById('gauge-active-path');

  // Helper to calculate SVG gauge arc path coordinates based on percentage (0-100)
  function getGaugePathD(percent) {
    // Gauge path starts at left (10, 50) and sweep to right (90, 50)
    // R = 40, Cx = 50, Cy = 50.
    const radius = 40;
    const cx = 50;
    const cy = 50;
    
    // Angle ranges from 180 degrees (left) to 0 degrees (right)
    const startAngle = Math.PI; // 180 deg
    const endAngle = Math.PI - (percent / 100) * Math.PI; // sweep towards 0
    
    const x = cx + radius * Math.cos(endAngle);
    const y = cy - radius * Math.sin(endAngle);
    
    return `M 10 50 A 40 40 0 0 1 ${x} ${y}`;
  }

  // Simulate electrolysis voltage fluctuation (safe range is typically below 0.25V)
  function updateGauge() {
    if (!gaugeValEl || !gaugePath) return;

    // Volts range: 0.12 to 0.19 (safe region)
    const randomVolt = (0.10 + Math.random() * 0.09).toFixed(2);
    gaugeValEl.textContent = `${randomVolt} V`;

    // Map 0.0V - 1.0V to 0% - 100% of the gauge sweep
    // 0.2V would be roughly 20%
    const percentage = parseFloat(randomVolt) * 100;
    gaugePath.setAttribute('d', getGaugePathD(percentage));
  }

  // Run initial update and set interval for micro fluctuations
  updateGauge();
  setInterval(updateGauge, 3000);

  // PCB Board diagnostics console log text simulation
  const teleLines = document.querySelectorAll('.tele-line .t-val');
  if (teleLines.length > 0) {
    setInterval(() => {
      // Fluctuate board temp slightly
      const temp = (33.0 + Math.random() * 3.5).toFixed(1);
      teleLines[0].textContent = `${temp}°C`;
      
      // Fluctuate voltage lines slightly
      const volt = (12.01 + Math.random() * 0.08).toFixed(2);
      teleLines[1].textContent = `${volt} V (STABLE)`;
    }, 4000);
  }
});
