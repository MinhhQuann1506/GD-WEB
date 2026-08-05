/**
 * category-detail.js
 * Fully independent Tier 2 product page.
 * Reads categoryId from URL: /category-detail.html?id=CATEGORY_MONGO_ID
 * Never shares state with main.js — categoryId is always from URL.
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── URL param ──────────────────────────────────────────────────────────────
  const urlParams = new URLSearchParams(window.location.search);
  const CATEGORY_ID = urlParams.get('id'); // the ONE source of truth

  if (!CATEGORY_ID) {
    showError('Không tìm thấy ID danh mục. Vui lòng quay lại trang chủ.');
    return;
  }

  // ── DOM refs ───────────────────────────────────────────────────────────────
  const mobileToggle      = document.getElementById('mobileToggle');
  const navMenu           = document.getElementById('navMenu');
  const siteHeader        = document.getElementById('siteHeader');

  const adminAuthBtn      = document.getElementById('adminAuthBtn');
  const adminAuthBtnText  = document.getElementById('adminAuthBtnText');
  const adminBar          = document.getElementById('adminBar');
  const addProductBtn     = document.getElementById('addProductBtn');
  const addProductBtnLabel = document.getElementById('addProductBtnLabel');

  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  const catBannerImage    = document.getElementById('catBannerImage');
  const catBannerTag      = document.getElementById('catBannerTag');
  const catBannerTitle    = document.getElementById('catBannerTitle');
  const catBannerDesc     = document.getElementById('catBannerDesc');
  const productCountBadge = document.getElementById('productCountBadge');
  const subProductsGrid   = document.getElementById('subProductsGrid');

  const rfqModal          = document.getElementById('rfqModal');
  const rfqModalClose     = document.getElementById('rfqModalClose');
  const rfqProductName    = document.getElementById('rfqProductName');
  const rfqForm           = document.getElementById('rfqForm');

  const specModal         = document.getElementById('specModal');
  const specModalClose    = document.getElementById('specModalClose');
  const specModalTitle    = document.getElementById('specModalTitle');
  const specModalBody     = document.getElementById('specModalBody');

  const adminLoginModal      = document.getElementById('adminLoginModal');
  const adminLoginModalClose = document.getElementById('adminLoginModalClose');
  const adminLoginForm       = document.getElementById('adminLoginForm');
  const loginUsername        = document.getElementById('loginUsername');
  const loginPassword        = document.getElementById('loginPassword');

  const adminProductModal    = document.getElementById('adminProductModal');
  const adminProductModalClose = document.getElementById('adminProductModalClose');
  const productModalTitle    = document.getElementById('productModalTitle');
  const productCategoryName  = document.getElementById('productCategoryName');
  const adminProductForm     = document.getElementById('adminProductForm');
  const editProductId        = document.getElementById('editProductId');
  const prodName             = document.getElementById('prodName');
  const prodPrice            = document.getElementById('prodPrice');
  const prodMaterial         = document.getElementById('prodMaterial');
  const prodDimensions       = document.getElementById('prodDimensions');
  const prodDescription      = document.getElementById('prodDescription');
  const prodImage            = document.getElementById('prodImage');
  const prodImagePreview     = document.getElementById('prodImagePreview');
  const prodImagePlaceholder = document.getElementById('prodImagePlaceholder');
  const productSubmitBtn     = document.getElementById('productSubmitBtn');
  const toastContainer       = document.getElementById('toastContainer');

  // ── State ──────────────────────────────────────────────────────────────────
  let categoryData  = null;
  let products      = [];
  let isEditingProd = false;

  // ── Init ───────────────────────────────────────────────────────────────────
  checkAdminState();
  loadPage();

  // ── Sticky header ──────────────────────────────────────────────────────────
  window.addEventListener('scroll', () => {
    siteHeader?.classList.toggle('scrolled', window.scrollY > 40);
  });
  mobileToggle?.addEventListener('click', () => navMenu?.classList.toggle('active'));

  // ── Admin auth state ───────────────────────────────────────────────────────
  function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true' || !!localStorage.getItem('adminToken');
  }

  function checkAdminState() {
    if (isAdmin()) {
      if (adminAuthBtnText) adminAuthBtnText.textContent = 'Logout';
      if (adminBar) adminBar.style.display = 'flex';
    } else {
      if (adminAuthBtnText) adminAuthBtnText.textContent = 'Login';
      if (adminBar) adminBar.style.display = 'none';
    }
  }

  adminAuthBtn?.addEventListener('click', () => {
    if (isAdmin()) {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminToken');
      showToast('Đã đăng xuất Admin.', 'info');
      checkAdminState();
      renderProducts();
    } else {
      adminLoginModal?.classList.add('active');
    }
  });

  adminLoginModalClose?.addEventListener('click', () => adminLoginModal?.classList.remove('active'));

  adminLoginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername.value.trim(), password: loginPassword.value.trim() })
      });
      const result = await res.json();
      if (result.success) {
        localStorage.setItem('isAdmin', 'true');
        if (result.token) localStorage.setItem('adminToken', result.token);
        showToast('Đăng nhập Admin thành công!');
        adminLoginModal?.classList.remove('active');
        adminLoginForm.reset();
        checkAdminState();
        renderProducts();
      } else {
        showToast(result.message || 'Đăng nhập thất bại', 'error');
      }
    } catch {
      showToast('Lỗi kết nối server', 'error');
    }
  });

  // ── Load page data ─────────────────────────────────────────────────────────
  async function loadPage() {
    try {
      // 1. Fetch category info
      // Handle legacy IDs (not real MongoDB ObjectIds)
      const isLegacy = CATEGORY_ID.startsWith('legacy-');
      if (isLegacy) {
        categoryData = getLegacyCategory(CATEGORY_ID);
      } else {
        const catRes = await fetch(`/api/categories/${CATEGORY_ID}`);
        if (!catRes.ok) throw new Error('Category not found');
        const catJson = await catRes.json();
        categoryData = catJson.data;
      }

      if (!categoryData) throw new Error('Category not found');

      // 2. Update page metadata
      document.title = `${categoryData.title} - Gwo Dyi Duty VN`;
      if (breadcrumbCategory) breadcrumbCategory.textContent = categoryData.title;
      if (catBannerTitle) catBannerTitle.textContent = categoryData.title;
      if (catBannerDesc) catBannerDesc.textContent = categoryData.description || 'Gia công theo quy cách & bản vẽ công nghiệp.';
      if (catBannerTag) catBannerTag.textContent = categoryData.tag || 'Danh Mục';
      if (catBannerImage && categoryData.imageUrl) catBannerImage.src = categoryData.imageUrl;
      if (productCategoryName) productCategoryName.textContent = categoryData.title;
      if (addProductBtnLabel) addProductBtnLabel.textContent = `Thêm SP vào "${categoryData.title.length > 18 ? categoryData.title.substring(0, 18) + '...' : categoryData.title}"`;

      // 3. Fetch products for THIS category only
      await fetchAndRender();

    } catch (err) {
      console.error('loadPage error:', err);
      showError('Không thể tải dữ liệu danh mục. Vui lòng thử lại sau.');
    }
  }

  async function fetchAndRender() {
    try {
      let url;
      // For legacy IDs, fetch all and filter by slug; for real IDs, filter server-side
      const isLegacy = CATEGORY_ID.startsWith('legacy-');
      if (isLegacy) {
        url = `/api/products`;
      } else {
        url = `/api/products?categoryId=${CATEGORY_ID}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch products');

      let allProducts = json.data || [];

      // For legacy, client-side filter by slug
      if (isLegacy) {
        const slugMap = {
          'legacy-screws': 'screws',
          'legacy-bolts': 'bolts',
          'legacy-nuts': 'nuts'
        };
        const targetSlug = slugMap[CATEGORY_ID];
        allProducts = allProducts.filter(p => p.categorySlug === targetSlug);
      }

      products = allProducts;
      if (productCountBadge) productCountBadge.textContent = products.length;
      renderProducts();
    } catch (err) {
      console.error('fetchAndRender error:', err);
      showError('Lỗi tải sản phẩm.');
    }
  }

  // ── Render product grid ────────────────────────────────────────────────────
  function renderProducts() {
    if (!subProductsGrid) return;
    const admin = isAdmin();

    if (products.length === 0) {
      subProductsGrid.innerHTML = `
        <div style="grid-column:1/-1; text-align:center; padding:4rem 2rem; background:rgba(30,41,59,0.5); border-radius:12px; border:1px dashed #334155;">
          <i class="fa-solid fa-box-open" style="font-size:3rem; margin-bottom:0.75rem; display:block; color:#475569;"></i>
          <h4 style="color:#f8fafc; font-size:1.1rem; margin-bottom:0.4rem;">Chưa có sản phẩm nào trong danh mục này</h4>
          <p style="color:#94a3b8; font-size:0.9rem;">${admin ? 'Bấm "+ Thêm Sản Phẩm" ở trên để thêm mặt hàng mới.' : 'Vui lòng liên hệ bộ phận kinh doanh để được tư vấn.'}</p>
        </div>`;
      return;
    }

    subProductsGrid.innerHTML = products.map(prod => {
      const thumb = prod.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image';
      const adminControls = admin ? `
        <div style="margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed rgba(255,255,255,0.12); display:flex; gap:0.5rem; justify-content:flex-end;">
          <button class="btn btn-sm edit-prod-btn" style="background:#f59e0b;color:#fff;" data-id="${prod._id}">
            <i class="fa-solid fa-pen-to-square"></i> Sửa
          </button>
          <button class="btn btn-sm delete-prod-btn" style="background:#ef4444;color:#fff;" data-id="${prod._id}">
            <i class="fa-solid fa-trash-can"></i> Xóa
          </button>
        </div>` : '';

      return `
        <div class="product-card">
          <div class="product-img-holder">
            <span class="product-tag">Sản Phẩm Chi Tiết</span>
            <img src="${thumb}" alt="${esc(prod.name)}" loading="lazy">
          </div>
          <div class="product-body">
            <h3 class="product-title">${esc(prod.name)}</h3>
            <p class="product-desc">${esc(prod.description || 'Gia công sản xuất theo quy cách & bản vẽ công nghiệp.')}</p>
            <div class="product-specs-list">
              <div class="spec-row">
                <span class="spec-name">Đơn giá:</span>
                <span class="spec-val" style="color:#60a5fa;font-weight:700;">$${Number(prod.price).toFixed(2)}</span>
              </div>
              <div class="spec-row">
                <span class="spec-name">Vật liệu:</span>
                <span class="spec-val">${esc(prod.specifications?.material || 'Inox 304 / Thép cacbon')}</span>
              </div>
              <div class="spec-row">
                <span class="spec-name">Kích thước:</span>
                <span class="spec-val">${esc(prod.specifications?.dimensions || 'Theo yêu cầu')}</span>
              </div>
            </div>
            <div class="product-footer">
              <button class="btn btn-outline btn-sm view-spec-btn" data-id="${prod._id}">Xem Chi Tiết</button>
              <button class="btn btn-primary btn-sm open-rfq-btn" data-product="${esc(prod.name)}">Báo Giá</button>
            </div>
            ${adminControls}
          </div>
        </div>`;
    }).join('');

    attachProductListeners();
  }

  function attachProductListeners() {
    document.querySelectorAll('.view-spec-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = `/product-detail.html?id=${btn.dataset.id}`;
      });
    });

    document.querySelectorAll('.open-rfq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (rfqProductName) rfqProductName.value = btn.dataset.product || categoryData?.title || '';
        rfqModal?.classList.add('active');
      });
    });

    document.querySelectorAll('.edit-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = products.find(p => p._id === btn.dataset.id);
        if (prod) openProductModalForEdit(prod);
      });
    });

    document.querySelectorAll('.delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
    });
  }

  // ── Spec modal ─────────────────────────────────────────────────────────────
  function openSpecModal(prod) {
    if (specModalTitle) specModalTitle.textContent = prod.name;
    if (specModalBody) {
      specModalBody.innerHTML = `
        <div style="display:flex;gap:1rem;flex-wrap:wrap;margin-bottom:1rem;">
          <img src="${prod.imageUrl || 'https://via.placeholder.com/200'}" style="width:150px;height:150px;object-fit:cover;border-radius:8px;background:#0f172a;">
          <div style="flex:1;min-width:200px;">
            <p style="color:#cbd5e1;margin-bottom:0.5rem;">${esc(prod.description || 'Chưa có mô tả.')}</p>
            <div style="font-size:0.9rem;color:#60a5fa;font-weight:700;margin-bottom:0.5rem;">Đơn giá: $${Number(prod.price).toFixed(2)}</div>
            <div style="background:rgba(15,23,42,0.6);padding:0.75rem;border-radius:6px;border:1px solid #334155;">
              <div style="margin-bottom:0.25rem;"><strong>Vật liệu:</strong> ${esc(prod.specifications?.material || 'N/A')}</div>
              <div style="margin-bottom:0.25rem;"><strong>Kích thước:</strong> ${esc(prod.specifications?.dimensions || 'N/A')}</div>
              <div><strong>Cấp bền / Grade:</strong> ${esc(prod.specifications?.grade || '8.8')}</div>
            </div>
          </div>
        </div>`;
    }
    specModal?.classList.add('active');
  }

  specModalClose?.addEventListener('click', () => specModal?.classList.remove('active'));

  // ── RFQ modal ──────────────────────────────────────────────────────────────
  rfqModalClose?.addEventListener('click', () => rfqModal?.classList.remove('active'));
  rfqForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Yêu cầu báo giá đã được gửi thành công.');
    rfqForm.reset();
    rfqModal?.classList.remove('active');
  });

  // ── Admin product modal ────────────────────────────────────────────────────
  addProductBtn?.addEventListener('click', () => openProductModalForAdd());
  adminProductModalClose?.addEventListener('click', () => adminProductModal?.classList.remove('active'));

  prodImage?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        prodImagePreview.src = ev.target.result;
        prodImagePreview.style.display = 'block';
        prodImagePlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  function resetProductModal() {
    adminProductForm.reset();
    editProductId.value = '';
    prodImagePreview.src = '';
    prodImagePreview.style.display = 'none';
    prodImagePlaceholder.style.display = 'block';
  }

  function openProductModalForAdd() {
    isEditingProd = false;
    resetProductModal();
    if (productModalTitle) productModalTitle.innerHTML = '<i class="fa-solid fa-box" style="color:#60a5fa;"></i> Thêm Sản Phẩm Chi Tiết';
    if (productSubmitBtn) productSubmitBtn.textContent = 'Lưu Sản Phẩm';
    adminProductModal?.classList.add('active');
  }

  function openProductModalForEdit(prod) {
    isEditingProd = true;
    resetProductModal();
    editProductId.value = prod._id;
    prodName.value = prod.name;
    prodPrice.value = prod.price;
    if (prodMaterial) prodMaterial.value = prod.specifications?.material || '';
    if (prodDimensions) prodDimensions.value = prod.specifications?.dimensions || '';
    if (prodDescription) prodDescription.value = prod.description || '';
    if (prod.imageUrl) {
      prodImagePreview.src = prod.imageUrl;
      prodImagePreview.style.display = 'block';
      prodImagePlaceholder.style.display = 'none';
    }
    if (productModalTitle) productModalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:#f59e0b;"></i> Sửa Sản Phẩm';
    if (productSubmitBtn) productSubmitBtn.textContent = 'Cập nhật Sản Phẩm';
    adminProductModal?.classList.add('active');
  }

  adminProductForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', prodName.value.trim());
    formData.append('price', prodPrice.value);
    // categoryId comes DIRECTLY from the URL — no dropdown needed, no mistakes possible
    formData.append('categoryId', CATEGORY_ID);
    if (prodMaterial) formData.append('specsMaterial', prodMaterial.value.trim());
    if (prodDimensions) formData.append('specsDimensions', prodDimensions.value.trim());
    if (prodDescription) formData.append('description', prodDescription.value.trim());
    if (prodImage.files[0]) formData.append('image', prodImage.files[0]);

    const id = editProductId.value;
    const url = isEditingProd ? `/api/products/${id}` : '/api/products';
    const method = isEditingProd ? 'PUT' : 'POST';

    try {
      productSubmitBtn.disabled = true;
      productSubmitBtn.textContent = 'Đang lưu...';

      const res = await fetch(url, { method, body: formData });
      const result = await res.json();

      if (res.ok && result.success) {
        showToast(isEditingProd ? 'Cập nhật sản phẩm thành công!' : 'Thêm sản phẩm thành công!');
        adminProductModal?.classList.remove('active');
        // Refresh product list — same categoryId from URL
        await fetchAndRender();
      } else {
        showToast(result.error || 'Lưu thất bại', 'error');
      }
    } catch {
      showToast('Lỗi kết nối server', 'error');
    } finally {
      productSubmitBtn.disabled = false;
      productSubmitBtn.textContent = isEditingProd ? 'Cập nhật Sản Phẩm' : 'Lưu Sản Phẩm';
    }
  });

  async function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast('Đã xóa sản phẩm thành công.');
        await fetchAndRender();
      } else {
        showToast(result.error || 'Xóa thất bại', 'error');
      }
    } catch {
      showToast('Lỗi kết nối server', 'error');
    }
  }

  // ── Legacy category data ───────────────────────────────────────────────────
  function getLegacyCategory(id) {
    const map = {
      'legacy-screws': {
        _id: 'legacy-screws', title: 'Vít Gỗ Đầu Tròn (Round Head Wood Screw)',
        tag: 'Ốc Vít', description: 'Các dòng vít gỗ đầu tròn phục vụ thi công nội thất, đóng chế tạo đồ gỗ và cơ khí gỗ công nghiệp.',
        imageUrl: '/assets/images/product_screws.jpg'
      },
      'legacy-bolts': {
        _id: 'legacy-bolts', title: 'Bu Lông Lục Giác (Hex Bolt)',
        tag: 'Bu Lông', description: 'Các dòng bu lông lục giác chịu ứng suất lực kéo nén lớn phục vụ nhà xưởng, cầu đường và cơ khí nặng.',
        imageUrl: '/assets/images/product_bolts.jpg'
      },
      'legacy-nuts': {
        _id: 'legacy-nuts', title: 'Tán & Đai Ốc (Nut & Lock Nut)',
        tag: 'Tán / Đai Ốc', description: 'Các loại đai ốc tiêu chuẩn, đai ốc khóa chống trượt và tán bích ăn khớp mượt mà với bu lông.',
        imageUrl: '/assets/images/product_nuts.jpg'
      }
    };
    return map[id] || null;
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  function showError(msg) {
    if (subProductsGrid) {
      subProductsGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:4rem 2rem;color:#ef4444;">
          <i class="fa-solid fa-circle-exclamation" style="font-size:3rem;margin-bottom:1rem;display:block;"></i>
          <p>${msg}</p>
          <a href="/index.html#products" class="btn btn-outline btn-sm" style="margin-top:1rem;">Quay lại trang chủ</a>
        </div>`;
    }
  }

  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconClass = type === 'error' ? 'fa-circle-exclamation' : type === 'info' ? 'fa-circle-info' : 'fa-circle-check';
    const iconColor = type === 'error' ? '#ef4444' : type === 'info' ? '#3b82f6' : '#10b981';
    toast.innerHTML = `
      <i class="fa-solid ${iconClass}" style="font-size:1.25rem;color:${iconColor};"></i>
      <div>
        <strong style="display:block;font-size:0.95rem;color:#fff;">${type === 'error' ? 'Lỗi' : 'Thông báo'}</strong>
        <span style="font-size:0.85rem;color:#CBD5E1;">${message}</span>
      </div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
