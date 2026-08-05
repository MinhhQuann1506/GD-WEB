/**
 * Gwo Dyi Duty VN - Full Dynamic Multi-Level (2-Tier) Hierarchy & Clean Full Page View Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.getElementById('siteHeader');
  const navMenu = document.getElementById('navMenu');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Category Filtering & Search
  const categoryTabs  = document.getElementById('categoryTabs');  // dynamic tabs container
  const productSearch = document.getElementById('productSearch');
  const productsGrid  = document.getElementById('productsGrid');

  // Full Page View Containers
  const mainCategoriesView = document.getElementById('main-categories-view');
  const subcategoryPageView = document.getElementById('subcategory-page-view');
  const backToCategoriesBtn = document.getElementById('backToCategoriesBtn');
  const subCategoryPageTitle = document.getElementById('subCategoryPageTitle');
  const subCategoryPageDesc = document.getElementById('subCategoryPageDesc');
  const subCategoryPageImage = document.getElementById('subCategoryPageImage');
  const pageAddSubProductBtn = document.getElementById('pageAddSubProductBtn');
  const pageSubProductsGrid = document.getElementById('pageSubProductsGrid');

  // Modals & RFQ
  const rfqModal = document.getElementById('rfqModal');
  const rfqModalClose = document.getElementById('rfqModalClose');
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

  // Admin Auth Elements
  const adminAuthBtn = document.getElementById('adminAuthBtn');
  const adminAuthBtnText = document.getElementById('adminAuthBtnText');
  const adminAuthBtnMobile = document.getElementById('adminAuthBtnMobile');
  const adminAuthBtnMobileText = document.getElementById('adminAuthBtnMobileText');
  const adminControlBar = document.getElementById('adminControlBar');
  const openAddCategoryModalBtn = document.getElementById('openAddCategoryModalBtn');
  
  const adminLoginModal = document.getElementById('adminLoginModal');
  const adminLoginModalClose = document.getElementById('adminLoginModalClose');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const loginUsernameInput = document.getElementById('loginUsername');
  const loginPasswordInput = document.getElementById('loginPassword');

  // Tier 1 Category Modal Elements
  const adminCategoryModal = document.getElementById('adminCategoryModal');
  const adminCategoryModalClose = document.getElementById('adminCategoryModalClose');
  const inlineCategoryForm = document.getElementById('inlineCategoryForm');
  const inlineCategoryIdInput = document.getElementById('inlineCategoryId');
  const categoryTitleInput = document.getElementById('categoryTitle');
  const categoryTagInput = document.getElementById('categoryTag');
  const categoryMaterialInput = document.getElementById('categoryMaterial');
  const categoryDescriptionInput = document.getElementById('categoryDescription');
  const categoryImageInput = document.getElementById('categoryImage');
  const categoryModalTitle = document.getElementById('categoryModalTitle');
  const categorySubmitBtn = document.getElementById('categorySubmitBtn');

  // Tier 2 Product Modal Elements
  const adminProductModal = document.getElementById('adminProductModal');
  const adminProductModalClose = document.getElementById('adminProductModalClose');
  const inlineProductForm = document.getElementById('inlineProductForm');
  const inlineProductIdInput = document.getElementById('inlineProductId');
  const inlineNameInput = document.getElementById('inlineName');
  const inlinePriceInput = document.getElementById('inlinePrice');
  const inlineCategorySelect = document.getElementById('inlineCategorySelect');
  const inlineSpecsMaterialInput = document.getElementById('inlineSpecsMaterial');
  const inlineSpecsDimensionsInput = document.getElementById('inlineSpecsDimensions');
  const inlineDescriptionInput = document.getElementById('inlineDescription');
  const inlineImageInput = document.getElementById('inlineImage');
  const inlineImagePreview = document.getElementById('inlineImagePreview');
  const inlineImagePlaceholder = document.getElementById('inlineImagePlaceholder');
  const productModalTitle = document.getElementById('productModalTitle');
  const inlineProductSubmitBtn = document.getElementById('inlineProductSubmitBtn');

  let dbCategories = [];
  let dbProducts = [];
  let currentActiveParentCategory = null;
  let isEditingCategory = false;
  let isEditingProduct = false;

  // Default hardcoded initial legacy categories to merge if DB is empty
  const defaultLegacyCategories = [
    {
      _id: 'legacy-screws',
      title: 'Vít Gỗ Đầu Tròn (Round Head Wood Screw)',
      tag: 'Ốc Vít',
      slug: 'vit-go-dau-tron',
      filterCategory: 'screws',
      description: 'Các dòng vít gỗ đầu tròn phục vụ thi công nội thất, đóng chế tạo đồ gỗ và cơ khí gỗ công nghiệp.',
      specsOverview: { material: 'Inox 304, Thép xi vàng', range: 'Đa dạng sản phẩm cụ thể' },
      imageUrl: '/assets/images/product_screws.jpg',
      isLegacy: true,
    },
    {
      _id: 'legacy-bolts',
      title: 'Bu Lông Lục Giác (Hex Bolt)',
      tag: 'Bu Lông',
      slug: 'bu-long-luc-giac',
      filterCategory: 'bolts',
      description: 'Các dòng bu lông lục giác chịu ứng suất lực kéo nén lớn phục vụ nhà xưởng, cầu đường và cơ khí nặng.',
      specsOverview: { material: 'Cấp bền 8.8, 10.9, 12.9', range: 'Gia công theo bản vẽ B2B' },
      imageUrl: '/assets/images/product_bolts.jpg',
      isLegacy: true,
    },
    {
      _id: 'legacy-nuts',
      title: 'Tán & Đai Ốc (Nut & Lock Nut)',
      tag: 'Tán / Đai Ốc',
      slug: 'tan-va-dai-oc',
      filterCategory: 'nuts',
      description: 'Các loại đai ốc tiêu chuẩn, đai ốc khóa chống trượt và tán bích ăn khớp mượt mà với bu lông.',
      specsOverview: { material: 'Thép cacbon, Inox 304/316', range: 'Chống trượt ren & nới lỏng' },
      imageUrl: '/assets/images/product_nuts.jpg',
      isLegacy: true,
    },
  ];

  // Startup initializations
  checkAdminState();
  loadAllData();

  // Check URL parameters for direct category view (e.g. index.html?category=CATEGORY_ID)
  const urlParams = new URLSearchParams(window.location.search);
  const categoryUrlParam = urlParams.get('category');

  // 1. Sticky Header & Navigation
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) siteHeader?.classList.add('scrolled');
    else siteHeader?.classList.remove('scrolled');

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
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  });

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
  }

  // 2. Admin Authentication State Management
  function checkAdminState() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('adminToken');
    if (isAdmin) {
      if (adminAuthBtnText) adminAuthBtnText.textContent = 'Logout';
      if (adminAuthBtnMobileText) adminAuthBtnMobileText.textContent = 'Đăng Xuất';
      if (adminControlBar) adminControlBar.style.display = 'flex';
      if (pageAddSubProductBtn) pageAddSubProductBtn.style.display = 'inline-flex';
    } else {
      if (adminAuthBtnText) adminAuthBtnText.textContent = 'Login';
      if (adminAuthBtnMobileText) adminAuthBtnMobileText.textContent = 'Đăng Nhập';
      if (adminControlBar) adminControlBar.style.display = 'none';
      if (pageAddSubProductBtn) pageAddSubProductBtn.style.display = 'none';
    }
  }

  // Desktop login button
  adminAuthBtn?.addEventListener('click', () => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('adminToken');
    if (isAdmin) {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('adminToken');
      showToast('Admin logged out.', 'info');
      checkAdminState();
      renderTier1Categories();
      if (currentActiveParentCategory) {
        renderTier2SubCategoryPageView(currentActiveParentCategory._id);
      }
    } else {
      adminLoginModal?.classList.add('active');
    }
  });

  // Mobile nav login button — mirrors desktop
  adminAuthBtnMobile?.addEventListener('click', () => {
    navMenu?.classList.remove('active');
    adminAuthBtn?.click();
  });

  adminLoginModalClose?.addEventListener('click', () => adminLoginModal?.classList.remove('active'));

  adminLoginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Server error' }));
        showToast(errorData.message || errorData.error || 'Login failed', 'error');
        return;
      }

      const result = await response.json();
      if (result.success) {
        localStorage.setItem('isAdmin', 'true');
        if (result.token) localStorage.setItem('adminToken', result.token);

        showToast(result.message || 'Logged in successfully as Admin!');
        adminLoginModal?.classList.remove('active');
        adminLoginForm.reset();
        checkAdminState();
        renderTier1Categories();
        if (currentActiveParentCategory) {
          renderTier2SubCategoryPageView(currentActiveParentCategory._id);
        }
      } else {
        showToast(result.message || 'Login failed', 'error');
      }
    } catch (error) {
      console.error('Login Error:', error);
      showToast('Error connecting to server', 'error');
    }
  });

  // 3. Load Data API
  async function loadAllData() {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);

      const catData = await catRes.json();
      const prodData = await prodRes.json();

      if (catRes.ok && catData.success) {
        dbCategories = catData.data;
      }

      if (prodRes.ok && prodData.success) {
        dbProducts = prodData.data;
      }

      populateCategorySelectOptions();
      renderTier1Categories();

      if (categoryUrlParam) {
        renderTier2SubCategoryPageView(categoryUrlParam);
      }
    } catch (error) {
      console.error('Data Fetch Error:', error);
    }
  }

  // Returns the active category list:
  // - If DB has categories: use ONLY DB categories (they are fully manageable)
  // - If DB is empty: fall back to legacy static categories as placeholder
  function getActiveCategories() {
    return dbCategories.length > 0 ? dbCategories : defaultLegacyCategories;
  }

  function populateCategorySelectOptions() {
    if (!inlineCategorySelect) return;
    const cats = getActiveCategories();
    inlineCategorySelect.innerHTML = cats
      .map(c => `<option value="${c._id}">${escapeHtml(c.title)}</option>`)
      .join('');
  }

  // NOTE: renderFilterTabs also uses getActiveCategories()
  function renderFilterTabs() {
    if (!categoryTabs) return;
    const allCategories = getActiveCategories();

    // Build unique tag list (preserve order: legacy first, then DB)
    const seen = new Set();
    const tags = [];
    allCategories.forEach(cat => {
      const tag = (cat.tag || '').trim();
      if (tag && !seen.has(tag)) {
        seen.add(tag);
        tags.push(tag);
      }
    });

    // Keep current active filter if possible
    const currentActive = categoryTabs.querySelector('.tab-btn.active')?.getAttribute('data-filter') || 'all';

    categoryTabs.innerHTML =
      `<button class="tab-btn${currentActive === 'all' ? ' active' : ''}" data-filter="all">Tất cả</button>` +
      tags.map(tag =>
        `<button class="tab-btn${currentActive === tag ? ' active' : ''}" data-filter="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
      ).join('');
  }

  // 4b. Render Tier 1 Categories Grid
  function renderTier1Categories() {
    if (!productsGrid) return;
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('adminToken');

    // Only show legacy if DB is completely empty (fallback/demo mode)
    const allCategories = getActiveCategories();

    productsGrid.innerHTML = allCategories.map(cat => {
      const thumb = cat.imageUrl || 'https://via.placeholder.com/400x250?text=No+Image';
      const categoryTag = cat.tag || 'Danh Mục';
      // Use the tag directly as filter key — matches what renderFilterTabs() puts in data-filter
      const filterCat = categoryTag;

      const adminControls = isAdmin ? `
        <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed rgba(255,255,255,0.15); display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button class="btn btn-sm edit-cat-btn" style="background: #f59e0b; color: #fff;" data-id="${cat._id}">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button class="btn btn-sm delete-cat-btn" style="background: #ef4444; color: #fff;" data-id="${cat._id}">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </div>
      ` : '';

      return `
        <div class="product-card" data-category="${filterCat}" data-name="${escapeHtml(cat.title).toLowerCase()}">
          <div class="product-img-holder">
            <span class="product-tag">${escapeHtml(categoryTag)}</span>
            <img src="${thumb}" alt="${escapeHtml(cat.title)}">
          </div>
          <div class="product-body">
            <h3 class="product-title">${escapeHtml(cat.title)}</h3>
            <p class="product-desc">${escapeHtml(cat.description || 'Gia công sản xuất theo quy cách & bản vẽ công nghiệp.')}</p>
            <div class="product-specs-list">
              <div class="spec-row"><span class="spec-name">Vật liệu:</span><span class="spec-val">${escapeHtml(cat.specsOverview?.material || 'Inox 304, Thép cacbon')}</span></div>
              <div class="spec-row"><span class="spec-name">Quy cách:</span><span class="spec-val">${escapeHtml(cat.specsOverview?.range || 'Theo bản vẽ B2B')}</span></div>
            </div>
            <div class="product-footer">
              <button class="btn btn-outline btn-sm view-tier2-btn" data-id="${cat._id}">Xem Chi Tiết</button>
              <button class="btn btn-primary btn-sm open-rfq-btn" data-product="${escapeHtml(cat.title)}">Báo Giá</button>
            </div>
            ${adminControls}
          </div>
        </div>
      `;
    }).join('');

    attachTier1Listeners();
    renderFilterTabs();   // rebuild tabs whenever grid is re-rendered
    filterProducts();
  }

  function attachTier1Listeners() {
    // "Xem Chi Tiết" → navigate to independent category subpage
    document.querySelectorAll('.view-tier2-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-id');
        window.location.href = `/category-detail.html?id=${encodeURIComponent(catId)}`;
      });
    });

    // Edit Category (Tier 1)
    document.querySelectorAll('.edit-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-id');
        const cat = [...defaultLegacyCategories, ...dbCategories].find(c => c._id === catId);
        if (cat) openCategoryModalForEdit(cat);
      });
    });

    // Delete Category (Tier 1)
    document.querySelectorAll('.delete-cat-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const catId = e.currentTarget.getAttribute('data-id');
        deleteCategory(catId);
      });
    });

    // RFQ Trigger
    document.querySelectorAll('.open-rfq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productName = btn.getAttribute('data-product');
        if (productName && rfqProductNameInput) {
          rfqProductNameInput.value = productName;
        }
        rfqModal?.classList.add('active');
      });
    });
  }

  // 5. [REMOVED] Tier 2 in-page view — now handled by category-detail.html
  // Navigation: window.location.href = `/category-detail.html?id=${catId}`

  // Dead code stub kept to prevent reference errors during transition
  function renderTier2SubCategoryPageView(catId) {
    const parentCat = [...defaultLegacyCategories, ...dbCategories].find(c => c._id === catId);
    currentActiveParentCategory = parentCat;

    if (!parentCat) {
      showToast('Category not found', 'error');
      return;
    }

    // Hide Main Tier 1 Catalog View & Show Full Page Tier 2 SubCategory View
    if (mainCategoriesView) mainCategoriesView.style.display = 'none';
    if (subcategoryPageView) subcategoryPageView.style.display = 'block';

    // Scroll cleanly to products section top
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });

    // Populate Parent Banner details
    if (subCategoryPageTitle) subCategoryPageTitle.textContent = parentCat.title;
    if (subCategoryPageDesc) subCategoryPageDesc.textContent = parentCat.description || 'Chi tiết chủng loại và danh mục sản phẩm con phục vụ sản xuất công nghiệp.';
    if (subCategoryPageImage) subCategoryPageImage.src = parentCat.imageUrl || '/assets/images/product_screws.jpg';

    // Update Admin button
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('adminToken');
    if (pageAddSubProductBtn) {
      pageAddSubProductBtn.style.display = isAdmin ? 'inline-flex' : 'none';
      pageAddSubProductBtn.setAttribute('data-category-id', parentCat._id);
      pageAddSubProductBtn.innerHTML = `<i class="fa-solid fa-plus-circle"></i> + Thêm Sản Phẩm Con vào "${escapeHtml(parentCat.title.length > 20 ? parentCat.title.substring(0, 20) + '...' : parentCat.title)}"`;
    }

    renderTier2ProductsFullGrid(catId);
  }

  // Back to Main Categories Button Handler
  backToCategoriesBtn?.addEventListener('click', () => {
    currentActiveParentCategory = null;
    if (subcategoryPageView) subcategoryPageView.style.display = 'none';
    if (mainCategoriesView) mainCategoriesView.style.display = 'block';
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  });

  function renderTier2ProductsFullGrid(catId) {
    if (!pageSubProductsGrid) return;
    const isAdmin = localStorage.getItem('isAdmin') === 'true' || localStorage.getItem('adminToken');

    const subProducts = dbProducts.filter(p => {
      // Normalize categoryId to a plain string for safe comparison
      // (API may return populated object OR raw ObjectId string)
      const pCatId = p.categoryId?._id
        ? String(p.categoryId._id)
        : p.categoryId
          ? String(p.categoryId)
          : null;

      const targetId = String(catId);

      // Primary match: categoryId matches directly
      if (pCatId && pCatId === targetId) return true;

      // Slug fallback: ONLY for legacy static categories, not for DB categories
      // (prevents slug 'screws' default from pulling products into the wrong category)
      const isLegacyTarget = catId.startsWith('legacy-');
      if (isLegacyTarget && p.categorySlug && parentCatSlugMatches(p.categorySlug, catId)) return true;

      return false;
    });

    if (subProducts.length === 0) {
      pageSubProductsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: rgba(30,41,59,0.5); border-radius: 12px; border: 1px dashed #334155;">
          <i class="fa-solid fa-box-open" style="font-size: 3rem; margin-bottom: 0.75rem; display: block; color: #475569;"></i>
          <h4 style="color: #f8fafc; font-size: 1.1rem; margin-bottom: 0.3rem;">Chưa có sản phẩm con nào trong mục này</h4>
          <p style="color: #94a3b8; font-size: 0.9rem;">${isAdmin ? 'Bấm vào "+ Thêm Sản Phẩm Con" ở trên để bổ sung sản phẩm mới.' : 'Vui lòng quay lại sau hoặc liên hệ bộ phận kinh doanh để đặt hàng theo yêu cầu.'}</p>
        </div>
      `;
      return;
    }

    pageSubProductsGrid.innerHTML = subProducts.map(prod => {
      const thumb = prod.imageUrl || 'https://via.placeholder.com/400x250?text=Sub+Product';
      const adminControls = isAdmin ? `
        <div style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px dashed rgba(255,255,255,0.15); display: flex; gap: 0.5rem; justify-content: flex-end;">
          <button class="btn btn-sm edit-subprod-btn" style="background: #f59e0b; color: #fff;" data-id="${prod._id}">
            <i class="fa-solid fa-pen-to-square"></i> Edit
          </button>
          <button class="btn btn-sm delete-subprod-btn" style="background: #ef4444; color: #fff;" data-id="${prod._id}">
            <i class="fa-solid fa-trash-can"></i> Delete
          </button>
        </div>
      ` : '';

      return `
        <div class="product-card">
          <div class="product-img-holder">
            <span class="product-tag">Sản Phẩm Chi Tiết</span>
            <img src="${thumb}" alt="${escapeHtml(prod.name)}">
          </div>
          <div class="product-body">
            <h3 class="product-title">${escapeHtml(prod.name)}</h3>
            <p class="product-desc">${escapeHtml(prod.description || 'Gia công sản xuất theo quy cách & bản vẽ công nghiệp.')}</p>
            <div class="product-specs-list">
              <div class="spec-row"><span class="spec-name">Giá niêm yết:</span><span class="spec-val" style="color: #60a5fa; font-weight: bold;">$${prod.price.toFixed(2)}</span></div>
              <div class="spec-row"><span class="spec-name">Vật liệu:</span><span class="spec-val">${escapeHtml(prod.specifications?.material || 'Inox 304 / Thép cacbon')}</span></div>
              <div class="spec-row"><span class="spec-name">Kích thước:</span><span class="spec-val">${escapeHtml(prod.specifications?.dimensions || 'M4 - M16')}</span></div>
            </div>
            <div class="product-footer">
              <button class="btn btn-outline btn-sm view-subprod-spec-btn" data-id="${prod._id}">Xem Chi Tiết</button>
              <button class="btn btn-primary btn-sm open-rfq-btn" data-product="${escapeHtml(prod.name)}">Báo giá</button>
            </div>
            ${adminControls}
          </div>
        </div>
      `;
    }).join('');

    attachTier2SubProductListeners();
  }

  function parentCatSlugMatches(slug, catId) {
    if (catId === 'legacy-screws' && slug === 'screws') return true;
    if (catId === 'legacy-bolts' && slug === 'bolts') return true;
    if (catId === 'legacy-nuts' && slug === 'nuts') return true;
    return false;
  }

  function attachTier2SubProductListeners() {
    document.querySelectorAll('.view-subprod-spec-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.getAttribute('data-id');
        const prod = dbProducts.find(p => p._id === prodId);
        if (prod) openSpecDetailModal(prod);
      });
    });

    document.querySelectorAll('.edit-subprod-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.getAttribute('data-id');
        const prod = dbProducts.find(p => p._id === prodId);
        if (prod) openProductModalForEdit(prod);
      });
    });

    document.querySelectorAll('.delete-subprod-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const prodId = e.currentTarget.getAttribute('data-id');
        deleteProduct(prodId);
      });
    });

    document.querySelectorAll('.open-rfq-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productName = btn.getAttribute('data-product');
        if (productName && rfqProductNameInput) {
          rfqProductNameInput.value = productName;
        }
        rfqModal?.classList.add('active');
      });
    });
  }

  function openSpecDetailModal(prod) {
    const specModalTitle = document.getElementById('specModalTitle');
    const specModalBody = document.getElementById('specModalBody');
    const specModal = document.getElementById('specModal');

    if (specModalTitle) specModalTitle.textContent = prod.name;
    if (specModalBody) {
      specModalBody.innerHTML = `
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
          <img src="${prod.imageUrl || 'https://via.placeholder.com/200'}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; background: #0f172a;" />
          <div style="flex: 1; min-width: 200px;">
            <p style="color: #cbd5e1; margin-bottom: 0.5rem;">${escapeHtml(prod.description || 'Chưa có mô tả chi tiết.')}</p>
            <div style="font-size: 0.9rem; color: #60a5fa; font-weight: bold; margin-bottom: 0.5rem;">Đơn giá: $${prod.price.toFixed(2)}</div>
            <div style="background: rgba(15,23,42,0.6); padding: 0.75rem; border-radius: 6px; border: 1px solid #334155;">
              <div style="margin-bottom: 0.25rem;"><strong>Vật liệu:</strong> ${escapeHtml(prod.specifications?.material || 'N/A')}</div>
              <div style="margin-bottom: 0.25rem;"><strong>Kích thước:</strong> ${escapeHtml(prod.specifications?.dimensions || 'N/A')}</div>
              <div><strong>Cấp bền / Grade:</strong> ${escapeHtml(prod.specifications?.grade || '8.8')}</div>
            </div>
          </div>
        </div>
      `;
    }

    specModal?.classList.add('active');
  }

  const specModalClose = document.getElementById('specModalClose');
  specModalClose?.addEventListener('click', () => {
    document.getElementById('specModal')?.classList.remove('active');
  });

  // 6. Admin Tier 1 Category Modal Handlers
  openAddCategoryModalBtn?.addEventListener('click', () => {
    isEditingCategory = false;
    inlineCategoryForm.reset();
    inlineCategoryIdInput.value = '';
    categoryModalTitle.innerHTML = '<i class="fa-solid fa-folder-plus" style="color: #60a5fa;"></i> Add Category (Tier 1)';
    categorySubmitBtn.textContent = 'Save Category';
    adminCategoryModal?.classList.add('active');
  });

  adminCategoryModalClose?.addEventListener('click', () => adminCategoryModal?.classList.remove('active'));

  function openCategoryModalForEdit(cat) {
    isEditingCategory = true;
    inlineCategoryIdInput.value = cat._id;
    categoryTitleInput.value = cat.title;
    categoryTagInput.value = cat.tag || '';
    categoryMaterialInput.value = cat.specsOverview?.material || '';
    categoryDescriptionInput.value = cat.description || '';

    categoryModalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: #f59e0b;"></i> Edit Category';
    categorySubmitBtn.textContent = 'Update Category';
    adminCategoryModal?.classList.add('active');
  }

  inlineCategoryForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', categoryTitleInput.value.trim());
    formData.append('tag', categoryTagInput.value.trim());
    formData.append('specsMaterial', categoryMaterialInput.value.trim());
    formData.append('description', categoryDescriptionInput.value.trim());

    if (categoryImageInput.files[0]) {
      formData.append('image', categoryImageInput.files[0]);
    }

    const id = inlineCategoryIdInput.value;
    const isLegacy = id.startsWith('legacy-');
    const url = isEditingCategory && !isLegacy ? `/api/categories/${id}` : '/api/categories';
    const method = isEditingCategory && !isLegacy ? 'PUT' : 'POST';

    try {
      categorySubmitBtn.disabled = true;
      categorySubmitBtn.textContent = 'Processing...';

      const response = await fetch(url, { method, body: formData });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Category saved successfully!');
        adminCategoryModal?.classList.remove('active');
        inlineCategoryForm.reset();
        await loadAllData();
      } else {
        showToast(result.error || 'Failed to save category', 'error');
      }
    } catch (error) {
      console.error('Category Save Error:', error);
      showToast('Connection error saving category', 'error');
    } finally {
      categorySubmitBtn.disabled = false;
      categorySubmitBtn.textContent = isEditingCategory ? 'Update Category' : 'Save Category';
    }
  });

  async function deleteCategory(id) {
    if (id.startsWith('legacy-')) {
      showToast('Static legacy categories can be customized by creating a new category.', 'info');
      return;
    }

    if (!confirm('Are you sure you want to delete this Category and all its sub-products?')) return;

    try {
      const response = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (response.ok && result.success) {
        showToast('Category deleted successfully');
        await loadAllData();
      } else {
        showToast(result.error || 'Failed to delete category', 'error');
      }
    } catch (error) {
      console.error('Delete Category Error:', error);
      showToast('Error deleting category', 'error');
    }
  }

  // 7. Admin Tier 2 Product Modal Handlers
  pageAddSubProductBtn?.addEventListener('click', (e) => {
    // Read data-category-id directly from the button (set when entering Tier 2 view)
    const btnCatId = e.currentTarget.getAttribute('data-category-id');
    // Prefer the button's data-category-id; fall back to currentActiveParentCategory
    const resolvedCatId = (btnCatId && btnCatId.length > 0) ? btnCatId : currentActiveParentCategory?._id;
    openAddProductModalForParent(resolvedCatId);
  });

  function openAddProductModalForParent(parentId) {
    isEditingProduct = false;
    inlineProductForm.reset();
    inlineProductIdInput.value = '';
    inlineImagePreview.src = '';
    inlineImagePreview.style.display = 'none';
    inlineImagePlaceholder.style.display = 'block';

    // Re-populate the dropdown FIRST to ensure options are current
    populateCategorySelectOptions();

    // Then explicitly assign the active category ID AFTER reset & repopulate
    const activeCatId = parentId || currentActiveParentCategory?._id;
    if (activeCatId && inlineCategorySelect) {
      // Force-set the value so the correct parent is pre-selected
      inlineCategorySelect.value = activeCatId;

      // Fallback: if browser didn't accept the value (option not found), add it temporarily
      if (inlineCategorySelect.value !== activeCatId) {
        const parentCat = [...defaultLegacyCategories, ...dbCategories].find(c => c._id === activeCatId);
        if (parentCat) {
          const tempOption = document.createElement('option');
          tempOption.value = parentCat._id;
          tempOption.textContent = parentCat.title;
          tempOption.setAttribute('data-temp', 'true');
          inlineCategorySelect.insertBefore(tempOption, inlineCategorySelect.firstChild);
        }
        inlineCategorySelect.value = activeCatId;
      }

      // Lock the dropdown so admin can't accidentally switch category
      inlineCategorySelect.setAttribute('data-locked-cat', activeCatId);
    }

    productModalTitle.innerHTML = `<i class="fa-solid fa-box" style="color: #60a5fa;"></i> Add Sub-Product (Tier 2)${activeCatId ? ` — <small style="font-size:0.8em;color:#94a3b8">${escapeHtml(([...defaultLegacyCategories,...dbCategories].find(c=>c._id===activeCatId)?.title)||'')}</small>` : ''}`;
    inlineProductSubmitBtn.textContent = 'Save Sub-Product';
    adminProductModal?.classList.add('active');
  }

  adminProductModalClose?.addEventListener('click', () => adminProductModal?.classList.remove('active'));

  inlineImageInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        inlineImagePreview.src = event.target.result;
        inlineImagePreview.style.display = 'block';
        inlineImagePlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  function openProductModalForEdit(prod) {
    isEditingProduct = true;
    inlineProductIdInput.value = prod._id;
    inlineNameInput.value = prod.name;
    inlinePriceInput.value = prod.price;
    if (inlineCategorySelect) inlineCategorySelect.value = prod.categoryId?._id || prod.categoryId || '';
    if (inlineSpecsMaterialInput) inlineSpecsMaterialInput.value = prod.specifications?.material || '';
    if (inlineSpecsDimensionsInput) inlineSpecsDimensionsInput.value = prod.specifications?.dimensions || '';
    inlineDescriptionInput.value = prod.description || '';

    if (prod.imageUrl) {
      inlineImagePreview.src = prod.imageUrl;
      inlineImagePreview.style.display = 'block';
      inlineImagePlaceholder.style.display = 'none';
    } else {
      inlineImagePreview.src = '';
      inlineImagePreview.style.display = 'none';
      inlineImagePlaceholder.style.display = 'block';
    }

    productModalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color: #f59e0b;"></i> Edit Sub-Product';
    inlineProductSubmitBtn.textContent = 'Update Sub-Product';
    adminProductModal?.classList.add('active');
  }

  inlineProductForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Capture the active category ID BEFORE form reset clears anything
    const submittedCatId = inlineCategorySelect?.getAttribute('data-locked-cat') || inlineCategorySelect?.value || currentActiveParentCategory?._id;

    const formData = new FormData();
    formData.append('name', inlineNameInput.value.trim());
    formData.append('price', inlinePriceInput.value);
    // Always use the locked/active category — never let a stale dropdown value slip through
    formData.append('categoryId', submittedCatId || inlineCategorySelect.value);
    formData.append('specsMaterial', inlineSpecsMaterialInput ? inlineSpecsMaterialInput.value.trim() : '');
    formData.append('specsDimensions', inlineSpecsDimensionsInput ? inlineSpecsDimensionsInput.value.trim() : '');
    formData.append('description', inlineDescriptionInput.value.trim());

    if (inlineImageInput.files[0]) {
      formData.append('image', inlineImageInput.files[0]);
    }

    const id = inlineProductIdInput.value;
    const url = isEditingProduct ? `/api/products/${id}` : '/api/products';
    const method = isEditingProduct ? 'PUT' : 'POST';

    try {
      inlineProductSubmitBtn.disabled = true;
      inlineProductSubmitBtn.textContent = isEditingProduct ? 'Updating...' : 'Saving...';

      const response = await fetch(url, { method, body: formData });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Sub-product saved successfully!');
        adminProductModal?.classList.remove('active');
        inlineProductForm.reset();
        // Clear temp options and lock attribute
        if (inlineCategorySelect) {
          Array.from(inlineCategorySelect.options).forEach(o => { if (o.getAttribute('data-temp')) o.remove(); });
          inlineCategorySelect.removeAttribute('data-locked-cat');
        }

        // Re-fetch all data first, THEN re-render the CORRECT Tier 2 view
        await loadAllData();

        // Use the submittedCatId (not currentActiveParentCategory which may have been reset by loadAllData)
        const refreshCatId = submittedCatId || currentActiveParentCategory?._id;
        if (refreshCatId) {
          renderTier2SubCategoryPageView(refreshCatId);
        }
      } else {
        showToast(result.error || 'Failed to save product', 'error');
      }
    } catch (error) {
      console.error('Product Save Error:', error);
      showToast('Connection error saving product', 'error');
    } finally {
      inlineProductSubmitBtn.disabled = false;
      inlineProductSubmitBtn.textContent = isEditingProduct ? 'Update Sub-Product' : 'Save Sub-Product';
    }
  });

  async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this sub-product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Sub-product deleted successfully');
        await loadAllData();
        if (currentActiveParentCategory) {
          renderTier2SubCategoryPageView(currentActiveParentCategory._id);
        }
      } else {
        showToast(result.error || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error('Delete Product Error:', error);
      showToast('Error deleting sub-product', 'error');
    }
  }

  // 8. Filter & Search
  function filterProducts() {
    const activeTab = categoryTabs?.querySelector('.tab-btn.active')?.getAttribute('data-filter') || 'all';
    const searchTerm = (productSearch?.value || '').toLowerCase().trim();
    const cards = document.querySelectorAll('#productsGrid .product-card');

    cards.forEach(card => {
      const cardCat = card.getAttribute('data-category');
      const name = (card.getAttribute('data-name') || '').toLowerCase();

      const matchesCategory = (activeTab === 'all' || cardCat === activeTab);
      const matchesSearch = name.includes(searchTerm);

      card.style.display = (matchesCategory && matchesSearch) ? 'flex' : 'none';
    });
  }

  // Event delegation on the container — works for dynamically created tab buttons
  categoryTabs?.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterProducts();
  });

  if (productSearch) productSearch.addEventListener('input', filterProducts);

  // 9. Calculator
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

  // 10. Toast Helper
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    const iconClass = type === 'error' ? 'fa-circle-exclamation' : type === 'info' ? 'fa-circle-info' : 'fa-circle-check';
    const iconColor = type === 'error' ? '#ef4444' : type === 'info' ? '#3b82f6' : '#10b981';

    toast.innerHTML = `
      <i class="fa-solid ${iconClass}" style="font-size: 1.25rem; color: ${iconColor};"></i>
      <div>
        <strong style="display: block; font-size: 0.95rem; color: #fff;">${type === 'error' ? 'Notification' : 'Success'}</strong>
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

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
