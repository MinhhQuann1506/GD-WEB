/**
 * Gwo Dyi Duty VN - Level 2 Logic (Subcategories & Specific Products Listing)
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  let categoryId = urlParams.get('id');

  let category = getCategoryById(categoryId);
  if (!category) {
    category = categoriesData[0];
    categoryId = category.id;
  }

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
  }

  // Update Page Title
  document.title = `${category.name} - Gwo Dyi Duty VN`;

  // DOM Elements
  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  const catGroupLabel = document.getElementById('catGroupLabel');
  const catCode = document.getElementById('catCode');
  const catTitle = document.getElementById('catTitle');
  const catDesc = document.getElementById('catDesc');
  const catProductCount = document.getElementById('catProductCount');
  const subProductsGrid = document.getElementById('subProductsGrid');

  // RFQ Modal Elements
  const rfqModal = document.getElementById('rfqModal');
  const rfqModalClose = document.getElementById('rfqModalClose');
  const rfqProductNameInput = document.getElementById('rfqProductName');
  const rfqForm = document.getElementById('rfqForm');
  const toastContainer = document.getElementById('toastContainer');

  // 1. Populate Level 1 Category Header Info
  if (breadcrumbCategory) breadcrumbCategory.textContent = category.name;
  if (catGroupLabel) catGroupLabel.textContent = category.groupLabel;
  if (catCode) catCode.textContent = `Mã Nhóm: ${category.code}`;
  if (catTitle) catTitle.textContent = category.name;
  if (catDesc) catDesc.textContent = category.shortDesc;

  // Calculate total sub-items count across subcategories
  let totalItems = 0;
  if (category.subcategories) {
    category.subcategories.forEach(sub => {
      if (sub.products) totalItems += sub.products.length;
    });
  }
  if (catProductCount) catProductCount.textContent = totalItems;

  // 2. Render Level 2 Subcategories & Level 3 Products
  if (subProductsGrid && category.subcategories) {
    subProductsGrid.innerHTML = '';

    category.subcategories.forEach(sub => {
      // Subcategory Section Heading
      const subHeader = document.createElement('div');
      subHeader.style.cssText = 'grid-column: 1 / -1; margin-top: 1.5rem; margin-bottom: 0.5rem; border-bottom: 2px solid var(--color-navy); padding-bottom: 0.5rem;';
      subHeader.innerHTML = `
        <div class="section-tag" style="margin-bottom: 0.4rem;">Level 2 - Danh Mục Con</div>
        <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--color-navy-dark);">${sub.name} <span style="font-size: 0.9rem; color: #64748B; font-weight: 500;">(${sub.code})</span></h3>
        <p style="color: #475569; font-size: 0.92rem; margin-top: 0.2rem;">${sub.shortDesc}</p>
      `;
      subProductsGrid.appendChild(subHeader);

      // Render Level 3 Specific Products under this Subcategory
      if (sub.products && sub.products.length > 0) {
        sub.products.forEach(item => {
          const card = document.createElement('div');
          card.className = 'product-card';
          card.innerHTML = `
            <div class="product-img-holder">
              <span class="product-tag">${item.code}</span>
              <img src="${item.mainImage}" alt="${item.name}">
            </div>
            <div class="product-body">
              <h3 class="product-title">${item.name}</h3>
              <p class="product-desc">${item.shortDesc}</p>
              <div class="product-specs-list">
                <div class="spec-row">
                  <span class="spec-name">Level 1:</span>
                  <span class="spec-val">${category.name}</span>
                </div>
                <div class="spec-row">
                  <span class="spec-name">Level 2:</span>
                  <span class="spec-val">${sub.name}</span>
                </div>
              </div>
              <div class="product-footer">
                <a href="/product-detail.html?id=${item.id}" class="btn btn-outline btn-sm" style="flex: 1; text-align: center;">
                  Xem Chi Tiết (Level 3)
                </a>
                <button class="btn btn-primary btn-sm open-rfq-btn" data-product="${item.name} (${item.code})">
                  Báo Giá
                </button>
              </div>
            </div>
          `;
          subProductsGrid.appendChild(card);
        });
      }
    });
  }

  // 3. Setup RFQ Listeners
  function openRfqWithProduct(productName) {
    if (rfqProductNameInput) {
      rfqProductNameInput.value = productName || category.name;
    }
    if (rfqModal) {
      rfqModal.classList.add('active');
    }
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.open-rfq-btn');
    if (btn) {
      const prodName = btn.getAttribute('data-product');
      openRfqWithProduct(prodName);
    }
  });

  if (rfqModalClose) {
    rfqModalClose.addEventListener('click', () => {
      rfqModal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === rfqModal) rfqModal.classList.remove('active');
  });

  // 4. Toast Notification
  function showToast(message) {
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

  if (rfqForm) {
    rfqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast(`Yêu cầu báo giá đã được gửi thành công.`);
      rfqForm.reset();
      if (rfqModal) rfqModal.classList.remove('active');
    });
  }
});
