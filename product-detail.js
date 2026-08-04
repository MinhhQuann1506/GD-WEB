/**
 * Gwo Dyi Duty VN - Level 3 Logic (Specific Product Detail Page)
 */

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  let productId = urlParams.get('id');

  let product = getProductById(productId);
  if (!product) {
    product = getProductById('vit-go-dau-tron-rang-thua-inox-m4x30');
    productId = product.id;
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
  document.title = `${product.name} - Gwo Dyi Duty VN`;

  // DOM Elements
  const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
  const breadcrumbCategoryLink = document.getElementById('breadcrumbCategoryLink');
  const detailBackBtn = document.getElementById('detailBackBtn');
  const detailBadge = document.getElementById('detailBadge');
  const detailCode = document.getElementById('detailCode');
  const detailTitle = document.getElementById('detailTitle');
  const detailShortDesc = document.getElementById('detailShortDesc');
  const detailMainImg = document.getElementById('detailMainImg');
  const detailThumbnails = document.getElementById('detailThumbnails');
  const detailFeatures = document.getElementById('detailFeatures');
  const detailSpecsTable = document.getElementById('detailSpecsTable');
  const detailFullDesc = document.getElementById('detailFullDesc');
  const detailRfqBtn = document.getElementById('detailRfqBtn');
  const relatedProductsGrid = document.getElementById('relatedProductsGrid');

  // RFQ Modal Elements
  const rfqModal = document.getElementById('rfqModal');
  const rfqModalClose = document.getElementById('rfqModalClose');
  const rfqProductNameInput = document.getElementById('rfqProductName');
  const rfqForm = document.getElementById('rfqForm');
  const openRfqBtns = document.querySelectorAll('.open-rfq-btn');
  const toastContainer = document.getElementById('toastContainer');

  // 1. Populate Basic Info & Level 2 Back Link
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = product.name;
  if (product.categoryId) {
    if (detailBackBtn) {
      detailBackBtn.href = `category-detail.html?id=${product.categoryId}`;
      detailBackBtn.querySelector('span').textContent = `Quay lại ${product.categoryName || 'nhóm danh mục'}`;
    }
    if (breadcrumbCategoryLink) {
      breadcrumbCategoryLink.href = `category-detail.html?id=${product.categoryId}`;
      breadcrumbCategoryLink.textContent = product.categoryName || 'Nhóm danh mục';
    }
  }

  if (detailBadge) detailBadge.textContent = product.subcategoryName || product.groupLabel || 'Ốc Vít Gỗ';
  if (detailCode) detailCode.textContent = `Mã SP: ${product.code}`;
  if (detailTitle) detailTitle.textContent = product.name;
  if (detailShortDesc) detailShortDesc.textContent = product.shortDesc;

  // 2. Populate Gallery
  if (detailMainImg) {
    detailMainImg.src = product.mainImage;
    detailMainImg.alt = product.name;
  }

  if (detailThumbnails && product.thumbnails) {
    detailThumbnails.innerHTML = '';
    product.thumbnails.forEach((thumbSrc, index) => {
      const thumb = document.createElement('img');
      thumb.src = thumbSrc;
      thumb.alt = `${product.name} thumbnail ${index + 1}`;
      thumb.className = `thumb-img ${index === 0 ? 'active' : ''}`;
      
      thumb.addEventListener('click', () => {
        detailMainImg.src = thumbSrc;
        document.querySelectorAll('.thumb-img').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });

      detailThumbnails.appendChild(thumb);
    });
  }

  // 3. Populate Features List
  if (detailFeatures && product.features) {
    detailFeatures.innerHTML = '';
    product.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fa-solid fa-circle-check text-crimson"></i> <span>${feature}</span>`;
      detailFeatures.appendChild(li);
    });
  }

  // 4. Populate 3-Tier Technical Specs Table
  if (detailSpecsTable && product.specs) {
    let tableHtml = `
      <thead>
        <tr>
          <th>Hạng Mục Kỹ Thuật (3 Tầng Catalogue)</th>
          <th>Thông Số & Năng Lực Cung Ứng</th>
        </tr>
      </thead>
      <tbody>
    `;

    Object.entries(product.specs).forEach(([key, value], idx) => {
      const bgClass = idx % 2 === 1 ? 'style="background-color: #F8FAFC;"' : '';
      tableHtml += `
        <tr ${bgClass}>
          <td class="spec-key-col">${key}</td>
          <td class="spec-val-col">${value}</td>
        </tr>
      `;
    });

    tableHtml += `</tbody>`;
    detailSpecsTable.innerHTML = tableHtml;
  }

  // 5. Populate Full Description Box
  if (detailFullDesc && product.fullDesc) {
    detailFullDesc.innerHTML = `
      <h3 style="font-family: var(--font-display); color: var(--color-navy); margin-bottom: 0.75rem; font-size: 1.2rem;">
        <i class="fa-solid fa-circle-info text-crimson"></i> Mô Tả Ứng Dụng Kỹ Thuật B2B
      </h3>
      <p style="color: #475569; line-height: 1.7; font-size: 0.98rem;">${product.fullDesc}</p>
    `;
  }

  // 6. Setup RFQ Actions
  function openRfqWithProduct() {
    if (rfqProductNameInput) {
      rfqProductNameInput.value = `${product.name} (${product.code})`;
    }
    if (rfqModal) {
      rfqModal.classList.add('active');
    }
  }

  if (detailRfqBtn) {
    detailRfqBtn.addEventListener('click', openRfqWithProduct);
  }

  openRfqBtns.forEach(btn => {
    btn.addEventListener('click', openRfqWithProduct);
  });

  if (rfqModalClose) {
    rfqModalClose.addEventListener('click', () => {
      rfqModal.classList.remove('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === rfqModal) rfqModal.classList.remove('active');
  });

  // 7. Toast Notification helper
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
      showToast(`Yêu cầu báo giá cho sản phẩm ${product.code} đã được gửi thành công.`);
      rfqForm.reset();
      if (rfqModal) rfqModal.classList.remove('active');
    });
  }

  // 8. Related Level 3 Products
  if (relatedProductsGrid) {
    const relatedList = getRelatedProducts(product.id, 3);
    relatedProductsGrid.innerHTML = '';

    relatedList.forEach(item => {
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
          <div class="product-footer">
            <a href="product-detail.html?id=${item.id}" class="btn btn-outline btn-sm" style="flex: 1; text-align: center;">Xem Chi Tiết</a>
            <button class="btn btn-primary btn-sm open-rfq-btn" onclick="location.href='product-detail.html?id=${item.id}'">Báo Giá</button>
          </div>
        </div>
      `;
      relatedProductsGrid.appendChild(card);
    });
  }
});
