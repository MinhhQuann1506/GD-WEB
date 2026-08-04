/**
 * Gwo Dyi Duty VN - 3-Tier Product Hierarchy Catalogue
 * Level 1: Main Category (Danh mục chính - e.g., Vít gỗ đầu tròn)
 * Level 2: Subcategory (Danh mục con - e.g., Đầu tròn răng thưa)
 * Level 3: Product Detail (Sản phẩm cụ thể - e.g., Vít gỗ đầu tròn răng thưa M4x30mm)
 */

const categoriesData = [
  {
    id: "vit-go-dau-tron",
    code: "CAT-WSCW-01",
    name: "Vít gỗ đầu tròn",
    groupLabel: "Ốc Vít Gỗ",
    image: "assets/images/product_screws.jpg",
    shortDesc: "Các dòng vít gỗ đầu tròn phục vụ thi công nội thất, đóng đóng chế tạo đồ gỗ và cơ khí gỗ công nghiệp.",
    subcategories: [
      {
        id: "dau-tron-rang-thua",
        code: "SUB-WSCW-101",
        name: "Đầu tròn răng thưa",
        shortDesc: "Dòng vít gỗ đầu tròn ren thưa ăn sâu vào sớ gỗ tự nhiên và gỗ mút, chống trượt ren và vỡ thớ gỗ.",
        products: [
          {
            id: "vit-go-dau-tron-rang-thua-inox-m4x30",
            code: "GD-WSCW-001",
            name: "Vít Gỗ Đầu Tròn Răng Thưa Inox 304 (M4 x 30mm)",
            shortDesc: "Vít gỗ đầu tròn răng thưa Inox 304 độ bền cao, không nứt thớ gỗ, chống gỉ sét môi trường ngoài trời.",
            fullDesc: "Vít Gỗ Đầu Tròn Răng Thưa Inox 304 Gwo Dyi Duty VN có góc ren sắc bén bám chặt vào bề mặt gỗ tự nhiên, gỗ MDF, HDF. Mũi vít nhọn dễ dàng định vị không bị trượt khi thi công tốc độ cao bằng máy siết pin.",
            mainImage: "assets/images/product_screws.jpg",
            thumbnails: ["assets/images/product_screws.jpg", "assets/images/factory_hero.jpg"],
            specs: {
              "Level 1 (Danh mục chính)": "Vít gỗ đầu tròn",
              "Level 2 (Danh mục con)": "Đầu tròn răng thưa",
              "Level 3 (Sản phẩm cụ thể)": "Vít Gỗ Đầu Tròn Răng Thưa Inox 304 (M4 x 30mm)",
              "Chủng loại ren": "Răng thưa chuyên dụng cho gỗ",
              "Vật liệu chế tạo": "Inox 304 (SUS 304)",
              "Quy cách kích thước": "M4 x 30mm (Gia công theo đơn hàng B2B)",
              "Xử lý bề mặt": "Bóng kim loại tự nhiên",
              "Ứng dụng": "Sản xuất đồ gỗ nội thất, Thi công gỗ ngoài trời"
            },
            features: [
              "Bước ren thưa sắc nét bám sâu chắc chắn vào thớ gỗ",
              "Chất liệu Inox 304 chống gỉ và chịu lực siết mượt mà",
              "Đầu tròn dạng chảo tăng diện tích tiếp xúc ép dính",
              "Sản xuất đồng bộ tiêu chuẩn cơ khí B2B"
            ]
          },
          {
            id: "vit-go-dau-tron-rang-thua-xi-vang-m5x40",
            code: "GD-WSCW-002",
            name: "Vít Gỗ Đầu Tròn Răng Thưa Xi Vàng (M5 x 40mm)",
            shortDesc: "Vít gỗ răng thưa xi mạ kẽm màu vàng thẩm mỹ, bề mặt cứng chịu ứng suất uốn cao.",
            fullDesc: "Dòng vít gỗ xi vàng được ưu chuộng trong ngành sản xuất đồ gỗ xuất khẩu nhờ tính thẩm mỹ đồng màu với gỗ tự nhiên và khả năng gia cố khung kệ gỗ chắc chắn.",
            mainImage: "assets/images/product_screws.jpg",
            thumbnails: ["assets/images/product_screws.jpg", "assets/images/product_bolts.jpg"],
            specs: {
              "Level 1 (Danh mục chính)": "Vít gỗ đầu tròn",
              "Level 2 (Danh mục con)": "Đầu tròn răng thưa",
              "Level 3 (Sản phẩm cụ thể)": "Vít Gỗ Đầu Tròn Răng Thưa Xi Vàng (M5 x 40mm)",
              "Chủng loại ren": "Răng thưa gỗ",
              "Vật liệu chế tạo": "Thép cacbon cường độ cao",
              "Xử lý bề mặt": "Xi mạ kẽm màu vàng (Yellow Zinc)",
              "Ứng dụng": "Gia công đồ gỗ xuất khẩu, Bản lề gỗ"
            },
            features: [
              "Màu mạ xi vàng hòa hợp màu gỗ tự nhiên",
              "Thân vít dẻo dai chống gãy giòn khi bắn máy",
              "Gia công chuẩn xác tiêu chuẩn B2B"
            ]
          }
        ]
      },
      {
        id: "dau-tron-rang-min",
        code: "SUB-WSCW-102",
        name: "Đầu tròn răng mịn",
        shortDesc: "Chủng loại vít gỗ đầu tròn bước ren mịn màng ép chặt ghép nối kim loại với gỗ hoặc gỗ ép mật độ cao.",
        products: [
          {
            id: "vit-go-dau-tron-rang-min-m4x25",
            code: "GD-WSCW-003",
            name: "Vít Gỗ Đầu Tròn Răng Mịn (M4 x 25mm)",
            shortDesc: "Vít gỗ răng mịn chuyên dùng gắn phụ kiện kim loại, tắc-kê nhựa vào khung gỗ.",
            fullDesc: "Vít Gỗ Đầu Tròn Răng Mịn Gwo Dyi Duty VN có mật độ bước ren sát nhau, tăng lực giữ siết khi lắp đặt ray trượt, bản lề lề tủ và phụ kiện kim loại vào thớ gỗ cứng.",
            mainImage: "assets/images/product_screws.jpg",
            thumbnails: ["assets/images/product_screws.jpg", "assets/images/product_nuts.jpg"],
            specs: {
              "Level 1 (Danh mục chính)": "Vít gỗ đầu tròn",
              "Level 2 (Danh mục con)": "Đầu tròn răng mịn",
              "Level 3 (Sản phẩm cụ thể)": "Vít Gỗ Đầu Tròn Răng Mịn (M4 x 25mm)",
              "Vật liệu chế tạo": "Thép mạ kẽm trắng",
              "Ứng dụng": "Bắt bản lề, Ray trượt tủ, Linh kiện nội thất"
            },
            features: [
              "Mật độ ren mịn siết chặt giữ chắc chắn",
              "Đầu tròn chuẩn đẹp chịu ma sát lực siết",
              "Xi mạ kẽm bảo vệ lâu dài"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "bu-long-luc-giac",
    code: "CAT-BLT-01",
    name: "Bu lông lục giác",
    groupLabel: "Bu Lông",
    image: "assets/images/product_bolts.jpg",
    shortDesc: "Các dòng bu lông lục giác chịu ứng suất lực kéo nén lớn phục vụ nhà xưởng, cầu đường và cơ khí nặng.",
    subcategories: [
      {
        id: "luc-giac-cuong-do-cao-88",
        code: "SUB-BLT-101",
        name: "Lục giác cường độ cao 8.8",
        shortDesc: "Bu lông lục giác cấp bền 8.8 chịu ứng suất tải trọng lớn trong kết cấu thép.",
        products: [
          {
            id: "bu-long-luc-giac-88-m12x60",
            code: "GD-BLT-001",
            name: "Bu Lông Lục Giác Cường Độ Cao 8.8 (M12 x 60mm)",
            shortDesc: "Bu lông lục giác cấp bền 8.8 mạ kẽm nhúng nóng chịu lực kéo cắt nén trong công trình.",
            fullDesc: "Bu Lông Lục Giác Cường Độ Cao 8.8 Gwo Dyi Duty VN sản xuất từ hợp kim thép luyện nhiệt khắt khe. Sản phẩm được dùng cho mối nối dầm kèo thép nhà xưởng và cầu đường.",
            mainImage: "assets/images/product_bolts.jpg",
            thumbnails: ["assets/images/product_bolts.jpg", "assets/images/factory_hero.jpg"],
            specs: {
              "Level 1 (Danh mục chính)": "Bu lông lục giác",
              "Level 2 (Danh mục con)": "Lục giác cường độ cao 8.8",
              "Level 3 (Sản phẩm cụ thể)": "Bu Lông Lục Giác Cường Độ Cao 8.8 (M12 x 60mm)",
              "Vật liệu chế tạo": "Hợp kim thép cấp bền 8.8",
              "Xử lý bề mặt": "Mạ kẽm nhúng nóng / Xi đen",
              "Ứng dụng": "Khung nhà xưởng, Kết cấu thép, Cầu đường"
            },
            features: [
              "Cấp bền 8.8 chịu lực nén kéo vượt trội",
              "Lớp mạ nhúng nóng bảo vệ môi trường ngoài trời",
              "Chuẩn xác hệ ren mét B2B"
            ]
          }
        ]
      }
    ]
  },
  {
    id: "tan-va-dai-oc",
    code: "CAT-NUT-01",
    name: "Tán & Đai ốc",
    groupLabel: "Tán / Đai Ốc",
    image: "assets/images/product_nuts.jpg",
    shortDesc: "Các loại đai ốc tiêu chuẩn, đai ốc khóa chống trượt và tán bích ăn khớp mượt mà với bu lông.",
    subcategories: [
      {
        id: "tan-khoa-nylon-chong-truot",
        code: "SUB-NUT-101",
        name: "Tán khóa nylon chống trượt",
        shortDesc: "Tán khóa tích hợp vòng đệm nylon kỹ thuật ngăn ngừa hiện tượng tự tháo lỏng do rung động.",
        products: [
          {
            id: "tan-khoa-nylon-m8",
            code: "GD-NUT-001",
            name: "Tán Khóa Nylon Chống Trượt Inox 304 (M8)",
            shortDesc: "Tán khóa nylon Inox 304 ma sát cao, khóa chặt bu lông dưới rung động cơ khí.",
            fullDesc: "Tán Khóa Nylon Inox 304 Gwo Dyi Duty VN tạo lực ôm siết tự động vào ren bu lông, ngăn tuyệt đối sự nới lỏng khi động cơ rung lắc.",
            mainImage: "assets/images/product_nuts.jpg",
            thumbnails: ["assets/images/product_nuts.jpg", "assets/images/product_screws.jpg"],
            specs: {
              "Level 1 (Danh mục chính)": "Tán & Đai ốc",
              "Level 2 (Danh mục con)": "Tán khóa nylon chống trượt",
              "Level 3 (Sản phẩm cụ thể)": "Tán Khóa Nylon Chống Trượt Inox 304 (M8)",
              "Vật liệu chế tạo": "Inox 304 + Vòng nylon kỹ thuật",
              "Ứng dụng": "Xe máy, Động cơ máy công nghiệp, Thiết bị rung lắc"
            },
            features: [
              "Tự khóa chặt chống nới lỏng cơ khí",
              "Tái sử dụng nhiều lần không mất lực ma sát",
              "Vật liệu Inox 304 kháng ăn mòn"
            ]
          }
        ]
      }
    ]
  }
];

// 3-Tier Data Access Helpers

/** Level 1: Get all Level 1 Main Categories */
function getAllCategories() {
  return categoriesData;
}

/** Level 1 -> Level 2: Get Level 1 Main Category by ID */
function getCategoryById(categoryId) {
  return categoriesData.find(cat => cat.id === categoryId);
}

/** Level 2: Get Subcategory by CategoryID and SubcategoryID */
function getSubcategoryById(categoryId, subcategoryId) {
  const cat = getCategoryById(categoryId);
  if (!cat || !cat.subcategories) return null;
  return cat.subcategories.find(sub => sub.id === subcategoryId);
}

/** Level 3: Get Level 3 Specific Product by ID */
function getProductById(productId) {
  for (const cat of categoriesData) {
    if (!cat.subcategories) continue;
    for (const sub of cat.subcategories) {
      if (!sub.products) continue;
      const found = sub.products.find(p => p.id === productId);
      if (found) {
        return {
          ...found,
          categoryId: cat.id,
          categoryName: cat.name,
          subcategoryId: sub.id,
          subcategoryName: sub.name,
          groupLabel: cat.groupLabel
        };
      }
    }
  }
  return null;
}

/** Get related Level 3 products */
function getRelatedProducts(productId, limit = 3) {
  const current = getProductById(productId);
  if (!current) return [];

  const results = [];
  const cat = getCategoryById(current.categoryId);

  if (cat && cat.subcategories) {
    for (const sub of cat.subcategories) {
      if (!sub.products) continue;
      for (const p of sub.products) {
        if (p.id !== productId) {
          results.push(p);
        }
        if (results.length >= limit) return results;
      }
    }
  }

  return results.slice(0, limit);
}
