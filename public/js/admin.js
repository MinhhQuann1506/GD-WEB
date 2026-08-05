document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('product-form');
  const productIdInput = document.getElementById('product-id');
  const nameInput = document.getElementById('name');
  const priceInput = document.getElementById('price');
  const descriptionInput = document.getElementById('description');
  const imageInput = document.getElementById('image');
  const imagePreview = document.getElementById('image-preview');
  const previewPlaceholder = document.getElementById('preview-placeholder');
  const submitBtn = document.getElementById('submit-btn');
  const formHeading = document.getElementById('form-heading');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const productList = document.getElementById('product-list');
  const productCount = document.getElementById('product-count');
  const toast = document.getElementById('toast');

  let isEditing = false;

  // Load products on start
  loadProducts();

  // Image input preview handler
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.src = event.target.result;
        imagePreview.style.display = 'block';
        previewPlaceholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    }
  });

  // Handle Form Submission (Create or Update)
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', nameInput.value.trim());
    formData.append('price', priceInput.value);
    formData.append('description', descriptionInput.value.trim());

    if (imageInput.files[0]) {
      formData.append('image', imageInput.files[0]);
    }

    const id = productIdInput.value;
    const url = isEditing ? `/api/products/${id}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      submitBtn.disabled = true;
      submitBtn.innerText = isEditing ? 'Updating...' : 'Saving...';

      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
        resetForm();
        loadProducts();
      } else {
        showToast(result.error || result.message || 'Error processing request', true);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      showToast('Server connection error', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerText = isEditing ? 'Update Product' : 'Save Product';
    }
  });

  // Fetch and display products
  async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();

      if (response.ok && result.success) {
        renderProductTable(result.data);
      } else {
        productList.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--danger);">Failed to load products</td></tr>`;
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      productList.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--danger);">Failed to connect to server</td></tr>`;
    }
  }

  // Render Table Rows
  function renderProductTable(products) {
    productCount.innerText = `${products.length} item${products.length === 1 ? '' : 's'}`;

    if (products.length === 0) {
      productList.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">
            No products found. Add one to get started!
          </td>
        </tr>
      `;
      return;
    }

    productList.innerHTML = products
      .map((product) => {
        const thumbSrc = product.imageUrl || 'https://via.placeholder.com/50?text=No+Img';
        return `
          <tr>
            <td>
              <img src="${thumbSrc}" alt="${escapeHtml(product.name)}" class="product-thumb" />
            </td>
            <td style="font-weight: 600;">${escapeHtml(product.name)}</td>
            <td style="color: #60a5fa; font-weight: 600;">$${product.price.toFixed(2)}</td>
            <td style="color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(product.description || '-')}</td>
            <td>
              <div class="actions-cell">
                <button class="btn btn-warning edit-btn" data-id="${product._id}" data-product='${JSON.stringify(product).replace(/'/g, "&apos;")}'>
                  Edit
                </button>
                <button class="btn btn-danger delete-btn" data-id="${product._id}">
                  Delete
                </button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    // Attach event listeners for Edit & Delete buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const productData = JSON.parse(e.currentTarget.getAttribute('data-product'));
        setEditMode(productData);
      });
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteProduct(id);
      });
    });
  }

  // Edit product setup
  function setEditMode(product) {
    isEditing = true;
    productIdInput.value = product._id;
    nameInput.value = product.name;
    priceInput.value = product.price;
    descriptionInput.value = product.description || '';

    if (product.imageUrl) {
      imagePreview.src = product.imageUrl;
      imagePreview.style.display = 'block';
      previewPlaceholder.style.display = 'none';
    } else {
      imagePreview.src = '';
      imagePreview.style.display = 'none';
      previewPlaceholder.style.display = 'block';
    }

    formHeading.innerText = 'Edit Product';
    submitBtn.innerText = 'Update Product';
    cancelEditBtn.style.display = 'inline-block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cancel edit mode
  cancelEditBtn.addEventListener('click', () => {
    resetForm();
  });

  // Reset form state
  function resetForm() {
    isEditing = false;
    productForm.reset();
    productIdInput.value = '';
    imagePreview.src = '';
    imagePreview.style.display = 'none';
    previewPlaceholder.style.display = 'block';
    formHeading.innerText = 'Add Product';
    submitBtn.innerText = 'Save Product';
    cancelEditBtn.style.display = 'none';
  }

  // Delete product API call
  async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (response.ok && result.success) {
        showToast('Product deleted successfully');
        if (isEditing && productIdInput.value === id) {
          resetForm();
        }
        loadProducts();
      } else {
        showToast(result.message || 'Failed to delete product', true);
      }
    } catch (error) {
      console.error('Delete Error:', error);
      showToast('Error deleting product', true);
    }
  }

  // Notification Toast Helper
  function showToast(message, isError = false) {
    toast.innerText = message;
    toast.style.borderColor = isError ? 'var(--danger)' : 'var(--primary)';
    toast.style.display = 'block';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }

  // Helper to escape HTML characters
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
