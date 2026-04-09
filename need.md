# 📋 Backend API Expansion Requirements - v1.1

This document outlines the specific endpoints and data structures required from the backend team to support advanced AI features, premium user experience, and full admin analytics.

---

## 🤖 1. AI Intelligent Modules (`/ai`)

### A. AI Visual Search
- **Endpoint:** `POST /ai/visual-search`
- **Description:** Search products using an image. Use vector embeddings to find similar items.
- **Request:** `Multipart/Form-Data` (Key: `image`)
- **Expected Response:**
```json
{
  "success": true,
  "data": [
    { "productId": "id", "matchScore": 0.98, "productDetails": { ... } }
  ]
}
```

### B. Conversational Shopping Assistant
- **Endpoint:** `POST /ai/assistant`
- **Description:** Natural language interface for product discovery.
- **Body:** `{ "message": "I need red running shoes for men under 5000" }`
- **Expected Response:**
```json
{
  "success": true,
  "reply": "I found 3 great options for you. The Nike Air Max is highly recommended!",
  "suggestedProducts": ["ID1", "ID2", "ID3"],
  "intent": "search_shoes"
}
```

### C. AI Review Analysis
- **Endpoint:** `GET /products/:id/ai-summary`
- **Description:** Summarize all user reviews into a concise TL;DR.
- **Expected Response:**
```json
{
  "success": true,
  "summary": "Most users love the comfort, but suggest ordering half a size larger.",
  "sentimentScore": 4.5,
  "pros": ["Comfort", "Breathable"],
  "cons": ["Sizing runs small"]
}
```

---

## 👤 2. Enhanced User Profile & Trust (`/user`)

### A. Address Book Management
- **GET `/user/addresses`**: Fetch all saved addresses.
- **POST `/user/addresses`**: Add new address (`street`, `city`, `zipCode`, `country`, `isDefault`).
- **PUT `/user/addresses/:id`**: Update specific address.
- **DELETE `/user/addresses/:id`**: Remove address.

### B. Product Review System
- **GET `/products/:id/reviews`**: List all reviews with pagination.
- **POST `/products/:id/reviews`**: Add a review (`rating: 1-5`, `comment: string`).
- **DELETE `/reviews/:id`**: Remove user's own review.

### C. Persistent Wishlist (Verification)
- **Endpoint:** `POST /user/wishlist/toggle/:productId`
- **Description:** Add to wishlist if it doesn't exist, otherwise remove it. Return updated wishlist.

---

## 📊 3. Admin "Mission Control" Dashboards (`/admin`)

### A. Revenue Analytics (TimeSeries)
- **Endpoint:** `GET /admin/analytics/revenue`
- **Query Params:** `period` (daily, weekly, monthly)
- **Expected Response:**
```json
{
  "success": true,
  "data": [
    { "date": "2024-03-01", "total": 15000 },
    { "date": "2024-03-02", "total": 22000 }
  ]
}
```

### B. Hot-Selling Products
- **Endpoint:** `GET /admin/analytics/top-products`
- **Description:** Top 5-10 products by sales volume.

### C. Bulk Inventory Tool
- **Endpoint:** `POST /admin/products/bulk-upload`
- **Description:** Accepts a JSON array of products for massive database updates.

---

## 🛡️ 4. System Improvements

### A. Advanced Product Filtering / Pagination
- Update `GET /products` to support:
  - `page` & `limit` params.
  - `minPrice` & `maxPrice`.
  - `category` & `brand`.
  - `sort` (price_asc, price_desc, newest, top_rated).

### B. Order Lifecycle Webhooks
- Support for real-time status updates via Socket.io or standardized polling for:
  - `Status: Shipped`
  - `Status: Out for Delivery`

---
> [!IMPORTANT]
> All new endpoints must follow the standard error format defined in `documentation.md` and require `Authorization: Bearer <token>` where applicable.
