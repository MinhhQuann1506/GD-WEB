/**
 * Gwo Dyi Duty VN - Pure Frontend Main Script (No Backend Fetch)
 * Handles Category Filtering, Search, Weight Estimator, RFQ Modal, and Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.getElementById('siteHeader');
  const navMenu = document.getElementById('navMenu');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Category Filtering & Search
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productSearch = document.getElementById('productSearch');
  const productCards = document.querySelectorAll('.product-card');

  // Modals & RFQ
  const rfqModal = document.getElementById('rfqModal');
  const rfqModalClose = document.getElementById('rfqModalClose');
  const openRfqBtns = document.querySelectorAll('.open-rfq-btn');
  const rfqProductNameInput = document.getElementById('rfqProductName');
  const rfqForm = document.getElementById('rfqForm');
  const contactForm = document.getElementById('contactForm');
  const toastContainer = document.getElementById('toastContainer');

  // Calculator
  const calcType = document.getElementById('calcType');
  const calcSize = document.getElementById('calcSize');
  const calcLength = document.getElementById('calcLength');
  const calcQty = document.getElementById('calcQty');
  const calcWeightResult = document.getElementById('calcWeightResult');

  // 1. Sticky Header & Scroll Spy
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // 2. Category Tab Filtering & Search (Instant Local Filtering)
  function filterProducts() {
    const activeTab = document.querySelector('.tab-btn.active')?.getAttribute('data-filter') || 'all';
    const searchTerm = (productSearch?.value || '').toLowerCase().trim();

    productCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const name = (card.getAttribute('data-name') || '').toLowerCase();

      const matchesCategory = (activeTab === 'all' || category === activeTab);
      const matchesSearch = name.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProducts();
    });
  });

  if (productSearch) {
    productSearch.addEventListener('input', filterProducts);
  }

  // 3. RFQ Modal Handlers
  openRfqBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const productName = btn.getAttribute('data-product');
      if (productName && rfqProductNameInput) {
        rfqProductNameInput.value = productName;
      }
      rfqModal?.classList.add('active');
    });
  });

  if (rfqModalClose) {
    rfqModalClose.addEventListener('click', () => {
      rfqModal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === rfqModal) rfqModal.classList.remove('active');
  });

  // 4. Weight Estimator Calculator
  function calculateWeight() {
    if (!calcSize || !calcLength || !calcQty || !calcWeightResult) return;

    const type = calcType.value;
    const diameter = parseFloat(calcSize.value);
    const length = parseFloat(calcLength.value) || 0;
    const qty = parseFloat(calcQty.value) || 0;

    let approxVolumeCm3 = 0;
    if (type === 'bolt') {
      const shaftVol = Math.PI * Math.pow(diameter / 20, 2) * (length / 10);
      const headVol = 0.7 * Math.PI * Math.pow(diameter / 10, 2) * (diameter * 0.6 / 10);
      approxVolumeCm3 = shaftVol + headVol;
    } else if (type === 'screw') {
      const shaftVol = Math.PI * Math.pow(diameter / 20, 2) * (length / 10);
      const headVol = 0.5 * Math.PI * Math.pow(diameter / 15, 2) * (diameter * 0.5 / 10);
      approxVolumeCm3 = shaftVol + headVol;
    } else if (type === 'nut') {
      const outerVol = Math.PI * Math.pow(diameter / 10, 2) * (diameter * 0.8 / 10);
      const holeVol = Math.PI * Math.pow(diameter / 20, 2) * (diameter * 0.8 / 10);
      approxVolumeCm3 = outerVol - holeVol;
    }

    const weightPerPieceGrams = approxVolumeCm3 * 7.85;
    const totalWeightKg = (weightPerPieceGrams * qty) / 1000;

    calcWeightResult.textContent = `${totalWeightKg.toLocaleString('vi-VN', { maximumFractionDigits: 1 })} kg`;
  }

  [calcType, calcSize, calcLength, calcQty].forEach(input => {
    if (input) {
      input.addEventListener('input', calculateWeight);
      input.addEventListener('change', calculateWeight);
    }
  });

  calculateWeight();

  // 5. Toast Notifications
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <i class="fa-solid fa-circle-check text-crimson" style="font-size: 1.25rem;"></i>
      <div>
        <strong style="display: block; font-size: 0.95rem;">Gửi Thành Công!</strong>
        <span style="font-size: 0.85rem; color: #CBD5E1;">${message}</span>
      </div>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value || 'Quý khách';
      showToast(`Cảm ơn ${name}! Gwo Dyi Duty VN đã nhận lời nhắn và sẽ phản hồi ngay.`);
      contactForm.reset();
    });
  }

  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Yêu cầu báo giá của bạn đã được gửi thành công.');
      rfqForm.reset();
      rfqModal?.classList.remove('active');
    });
  }
});
