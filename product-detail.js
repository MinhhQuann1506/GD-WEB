/**
 * product-detail.js
 * Fully independent product specification detail page.
 * Reads productId from URL: /product-detail.html?id=PRODUCT_MONGO_ID
 */

document.addEventListener('DOMContentLoaded', () => {

  const urlParams = new URLSearchParams(window.location.search);
  const PRODUCT_ID = urlParams.get('id');

  if (!PRODUCT_ID) {
    showError('Không tìm thấy ID sản phẩm. Vui lòng quay lại trang chủ.');
    return;
  }

  // DOM elements
  const siteHeader        = document.getElementById('siteHeader');
  const navMenu           = document.getElementById('navMenu');
  const mobileToggle      = document.getElementById('mobileToggle');

  const adminAuthBtn      = document.getElementById('adminAuthBtn');
  const adminAuthBtnText  = document.getElementById('adminAuthBtnText');

  const backToProductsBtn = document.getElementById('backToProductsBtn');
  const breadcrumbCategory = document.getElementById('breadcrumbCategory');
  const breadcrumbProduct  = document.getElementById('breadcrumbProduct');

  const productImage     = document.getElementById('productImage');
  const productName      = document.getElementById('productName');
  const productPrice     = document.getElementById('productPrice');
  const productDescription = document.getElementById('productDescription');

  const specMaterial     = document.getElementById('specMaterial');
  const specDimensions   = document.getElementById('specDimensions');
  const specUnitWeight   = document.getElementById('specUnitWeight');
  const productPriceNote = document.getElementById('productPriceNote');
  const unitPriceDisplay = document.getElementById('unitPriceDisplay');
  const unitWeightDisplay = document.getElementById('unitWeightDisplay');
  const totalPriceDisplay = document.getElementById('totalPriceDisplay');
  const specsTableBody   = document.getElementById('specsTableBody');

  const rfqModal          = document.getElementById('rfqModal');
  const rfqModalClose     = document.getElementById('rfqModalClose');
  const rfqProductName    = document.getElementById('rfqProductName');
  const rfqForm           = document.getElementById('rfqForm');
  const rfqButton         = document.getElementById('rfqButton');
  const openRfqBtnHeader  = document.querySelector('.open-rfq-btn');

  const adminLoginModal      = document.getElementById('adminLoginModal');
  const adminLoginModalClose = document.getElementById('adminLoginModalClose');
  const adminLoginForm       = document.getElementById('adminLoginForm');
  const loginUsername        = document.getElementById('loginUsername');
  const loginPassword        = document.getElementById('loginPassword');
  const toastContainer       = document.getElementById('toastContainer');

  let productData = null;
  let categoryData = null;


  // Admin specific DOM elements
  const adminProductActions  = document.getElementById('adminProductActions');
  const editProductBtn       = document.getElementById('editProductBtn');
  const deleteProductBtn     = document.getElementById('deleteProductBtn');

  const adminProductModal    = document.getElementById('adminProductModal');
  const adminProductModalClose = document.getElementById('adminProductModalClose');
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

  // Init
  checkAdminState();
  loadProduct();

  // Sticky header
  window.addEventListener('scroll', () => {
    siteHeader?.classList.toggle('scrolled', window.scrollY > 40);
  });
  mobileToggle?.addEventListener('click', () => navMenu?.classList.toggle('active'));

  // Admin login check
  function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true' || !!localStorage.getItem('adminToken');
  }

  function checkAdminState() {
    const admin = isAdmin();
    if (admin) {
      if (adminAuthBtnText) adminAuthBtnText.textContent = 'Logout';
      if (adminProductActions) adminProductActions.style.display = 'flex';
    } else {
      if (adminAuthBtnText) adminAuthBtnText.textContent = 'Login';
      if (adminProductActions) adminProductActions.style.display = 'none';
    }
  }

  adminAuthBtn?.addEventListener('click', () => {
    if (isAdmin()) {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminToken');
      showToast('Đã đăng xuất Admin.', 'info');
      checkAdminState();
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
      } else {
        showToast(result.message || 'Đăng nhập thất bại', 'error');
      }
    } catch {
      showToast('Lỗi kết nối server', 'error');
    }
  });

  // Admin Product Actions (Edit & Delete)
  // Inline edit specs table
  let isEditingSpecs = false;

  editProductBtn?.addEventListener('click', () => {
    if (!productData) return;
    if (!isEditingSpecs) {
      enterEditMode();
    } else {
      saveSpecsInline();
    }
  });

  function enterEditMode() {
    isEditingSpecs = true;
    editProductBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu Thay Đổi';
    editProductBtn.style.background = '#10b981';

    // Convert each editable value cell to an input
    document.querySelectorAll('[data-edit-field]').forEach(td => {
      const currentVal = td.textContent.trim();
      td.innerHTML = `<input type="text"
        value="${esc(currentVal)}"
        style="width:100%;padding:0.35rem 0.5rem;border:1.5px solid #3b82f6;border-radius:6px;font-size:0.95rem;color:#0f2c59;outline:none;background:#fff;"
        data-field="${td.dataset.editField}"
      >`;
    });
  }

  async function saveSpecsInline() {
    if (!productData) return;

    // Helper to get input value directly by data-field
    const getVal = (field) => {
      const el = document.querySelector(`input[data-field="${field}"]`);
      return el ? el.value.trim() : null;
    };

    const updatedName        = getVal('name') ?? productData.name;
    const updatedMaterial    = getVal('material') ?? '';
    const updatedDimensions  = getVal('dimensions') ?? '';
    const updatedUnitWeight  = getVal('unitWeight') ?? '0';
    const updatedMfg         = getVal('manufacturer') ?? '';
    const updatedCustom      = getVal('custom') ?? '';
    const updatedWarranty    = getVal('warranty') ?? '';

    try {
      editProductBtn.disabled = true;
      editProductBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';

      const formData = new FormData();
      formData.append('name', updatedName);
      formData.append('price', productData.price);
      formData.append('categoryId', productData.categoryId?._id || productData.categoryId || '');
      formData.append('description', productData.description || '');
      formData.append('specsMaterial', updatedMaterial);
      formData.append('specsDimensions', updatedDimensions);
      formData.append('unitWeight', parseFloat(updatedUnitWeight) || 0);
      formData.append('specsManufacturer', updatedMfg);
      formData.append('specsCustomWork', updatedCustom);
      formData.append('specsWarranty', updatedWarranty);

      const res = await fetch(`/api/products/${productData._id}`, { method: 'PUT', body: formData });
      const result = await res.json();

      if (res.ok && result.success) {
        showToast('Đã lưu bảng quy cách thành công!');
        isEditingSpecs = false;
        await loadProduct(); // reload fresh data
      } else {
        showToast(result.error || 'Lưu thất bại', 'error');
        cancelEditMode();
      }
    } catch (err) {
      console.error(err);
      showToast('Lỗi kết nối server', 'error');
      cancelEditMode();
    } finally {
      editProductBtn.disabled = false;
      editProductBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Sửa Bảng Quy Cách';
      editProductBtn.style.background = '#f59e0b';
    }
  }

  function cancelEditMode() {
    isEditingSpecs = false;
    editProductBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Sửa Bảng Quy Cách';
    editProductBtn.style.background = '#f59e0b';
    if (productData) buildSpecsTable(productData); // restore original values
  }

  // Load product detail
  async function loadProduct() {
    try {
      const res = await fetch(`/api/products/${PRODUCT_ID}`);
      if (!res.ok) throw new Error('Product not found');
      const json = await res.json();
      productData = json.data;

      if (!productData) throw new Error('Product not found');

      // Update main info
      document.title = `${productData.name} - Gwo Dyi Duty`;
      if (productName) productName.textContent = productData.name;
      if (breadcrumbProduct) breadcrumbProduct.textContent = productData.name;
      // Price & Weight calculation
      const unitPrice = Number(productData.price) || 0;
      const specs = productData.specifications || {};
      const unitWeight = Number(specs.unitWeight) || 0;
      const calcPrice = unitPrice * unitWeight;

      if (unitWeight > 0) {
        if (productPrice) productPrice.textContent = `$${calcPrice.toFixed(2)}`;
        if (productPriceNote) productPriceNote.style.display = 'block';
        if (unitPriceDisplay) unitPriceDisplay.textContent = `$${unitPrice.toFixed(2)}`;
        if (unitWeightDisplay) unitWeightDisplay.textContent = `${unitWeight}`;
        if (totalPriceDisplay) totalPriceDisplay.textContent = `$${calcPrice.toFixed(2)}`;
      } else {
        if (productPrice) productPrice.textContent = `$${unitPrice.toFixed(2)}`;
        if (productPriceNote) productPriceNote.style.display = 'none';
      }

      if (productDescription) productDescription.textContent = productData.description || 'Gia công chế tạo cơ khí phụ trợ công nghiệp.';
      if (productImage && productData.imageUrl) productImage.src = productData.imageUrl;

      // Update specifications highlights
      if (specMaterial) specMaterial.textContent = specs.material || 'Inox 304 / Thép cacbon';
      if (specDimensions) specDimensions.textContent = specs.dimensions || 'Theo bản vẽ';
      if (specUnitWeight) specUnitWeight.textContent = unitWeight ? `${unitWeight} g` : '—';

      // Load category info for breadcrumb
      let catId = productData.categoryId?._id || productData.categoryId;
      if (!catId && productData.categorySlug) {
        // Fallback for legacy categories
        const slugMap = {
          'screws': { id: 'legacy-screws', title: 'Vít Gỗ Đầu Tròn (Round Head Wood Screw)' },
          'bolts':  { id: 'legacy-bolts',  title: 'Bu Lông Lục Giác (Hex Bolt)' },
          'nuts':   { id: 'legacy-nuts',   title: 'Tán & Đai Ốc (Nut & Lock Nut)' }
        };
        categoryData = slugMap[productData.categorySlug];
      } else if (catId) {
        try {
          const catRes = await fetch(`/api/categories/${catId}`);
          if (catRes.ok) {
            const catJson = await catRes.json();
            categoryData = catJson.data;
          }
        } catch (err) {
          console.error('Error fetching category info:', err);
        }
      }

      if (categoryData) {
        if (breadcrumbCategory) {
          breadcrumbCategory.textContent = categoryData.title;
          breadcrumbCategory.href = `/category-detail.html?id=${categoryData._id || categoryData.id}`;
        }
        if (backToProductsBtn) {
          backToProductsBtn.addEventListener('click', () => {
            window.location.href = `/category-detail.html?id=${categoryData._id || categoryData.id}`;
          });
        }
      } else {
        if (breadcrumbCategory) {
          breadcrumbCategory.textContent = 'Danh mục';
          breadcrumbCategory.href = '/index.html#products';
        }
        if (backToProductsBtn) {
          backToProductsBtn.addEventListener('click', () => {
            window.location.href = '/index.html#products';
          });
        }
      }

      // Build detailed specs table
      buildSpecsTable(productData);

    } catch (err) {
      console.error('loadProduct error:', err);
      showError('Không thể tải chi tiết sản phẩm. Vui lòng thử lại sau.');
    }
  }

  function buildSpecsTable(prod) {
    if (!specsTableBody) return;
    const specs = prod.specifications || {};
    // data-edit-field marks cells that admin can edit inline
    const rows = [
      { key: 'Tên thương mại',        val: prod.name,                                                   field: 'name' },
      { key: 'Vật liệu cấu tạo',      val: specs.material    || 'Inox 304, Thép cacbon',                field: 'material' },
      { key: 'Quy cách kích thước',   val: specs.dimensions  || 'M3 - M24, Chiều dài tùy chọn',        field: 'dimensions' },
      { key: 'Đơn trọng',             val: specs.unitWeight !== undefined ? specs.unitWeight : 0, field: 'unitWeight' },
      { key: 'Nhà sản xuất',          val: specs.manufacturer || 'GWO DYI DUTY Co., Ltd',            field: 'manufacturer' },
      { key: 'Gia công theo yêu cầu', val: specs.customWork  || 'Có (Bản vẽ CAD/PDF, mẫu sản phẩm)',   field: 'custom' },
      { key: 'Bảo hành kỹ thuật',     val: specs.warranty    || 'Cam kết đổi mới với sản phẩm lỗi dung sai', field: 'warranty' },
    ];

    specsTableBody.innerHTML = rows.map(row => `
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:0.75rem 1.25rem;font-weight:600;color:#475569;background:#f8fafc;width:35%;">${esc(row.key)}</td>
        <td style="padding:0.75rem 1.25rem;color:#0f2c59;font-weight:500;" data-edit-field="${row.field}">${esc(row.val)}</td>
      </tr>
    `).join('');
  }

  // RFQ Event Listeners
  const triggerRfqModal = () => {
    if (rfqProductName && productData) {
      rfqProductName.value = productData.name;
    }
    rfqModal?.classList.add('active');
  };

  rfqButton?.addEventListener('click', triggerRfqModal);
  openRfqBtnHeader?.addEventListener('click', triggerRfqModal);
  rfqModalClose?.addEventListener('click', () => rfqModal?.classList.remove('active'));

  rfqForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Yêu cầu báo giá của bạn đã được gửi thành công.');
    rfqForm.reset();
    rfqModal?.classList.remove('active');
  });

  // Helpers
  function showError(msg) {
    const container = document.querySelector('main .container');
    if (container) {
      container.innerHTML = `
        <div style="text-align:center;padding:6rem 2rem;color:#ef4444;">
          <i class="fa-solid fa-circle-exclamation" style="font-size:3.5rem;margin-bottom:1.5rem;display:block;"></i>
          <h2 style="color:#f8fafc;margin-bottom:0.5rem;">Không Thể Tải Sản Phẩm</h2>
          <p style="color:#94a3b8;margin-bottom:1.5rem;">${msg}</p>
          <a href="/index.html#products" class="btn btn-primary btn-sm">Quay lại trang chủ</a>
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
