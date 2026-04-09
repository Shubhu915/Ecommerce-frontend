# 🚀 E-commerce Backend API v1.0 - Production Documentation

This document serves as the single source of truth for the frontend and admin panel integration. It follows industry standards for RESTful API design, security, and scalability.

---

## 📌 1. Project Overview & Standards

### 🗺️ Base URLs
- **Development:** `http://localhost:5000/api/v1`
- **Production:** `https://your-api-domain.com/api/v1`

### 🔑 Authentication Standards
- **Header:** `Authorization: Bearer <access_token>`
- **Token Type:** JSON Web Token (JWT)
- **Token Refreshing:** 
    - `accessToken` is short-lived (e.g., 21h).
    - `refreshToken` is long-lived (e.g., 27d) and stored in a **HttpOnly, Secure, SameSite=Strict cookie**.
- **Role System:** 
    - `user`: Standard customer access.
    - `admin`: Full access to dashboard and management APIs.

### 📦 Standardized Response Format

#### ✅ Success Response (2xx)
```json
{
  "success": true,
  "message": "Action completed successfully", // Optional
  "data": { ... }, // Main payload
  "meta": { // Pagination/Metadata
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "totalItems": 50
  }
}
```

#### ❌ Error Response (4xx/5xx)
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Unauthorized access",
  "errors": [ // Details of validation/logic errors
    { "field": "email", "message": "Email is already taken" }
  ],
  "stack": "..." // Visible only in development mode
}
```

---

## 🔐 2. Authentication & Security (`/auth`)

### 📋 Endpoint Table
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | Public | Create a new user account |
| POST | `/auth/login` | Public | Login and receive accessToken |
| POST | `/auth/logout` | Public | Clear session and cookies |
| GET | `/auth/verify-email` | Public | Verify email via token from link |
| POST | `/auth/refresh-token` | Public | Uses cookie to issue new accessToken |
| POST | `/auth/forgot-password` | Public | Send reset link via email |
| PUT | `/auth/reset-password/:token`| Public | Set new password using token |
| GET | `/auth/me` | Private | Get current logged-in user details |

### 💡 Notable Behaviors
1. **Email Verification:** Users **cannot login** until `isVerified` is `true`.
2. **Auto-Login:** Registration does not auto-login; it requires email confirmation first.

---

## 🔍 3. Product Discovery (`/products`)

### 🛒 Product Object Schema
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique identifier |
| `name` | String | Commercial name of the product |
| `slug` | String | URL-friendly name (unique) |
| `price` | Number | Current selling price |
| `description` | String | Detailed product info (Markdown supported) |
| `category` | ObjectId | Reference to Category model |
| `images` | Array | Objects with `url` and `alt` tags |
| `stock` | Number | Physical inventory remaining |
| `ratings` | Number | Average user rating (0-5) |
| `numReviews` | Number | Total count of reviews |
| `aiMetadata` | Object | Smart attributes (primaryColor, style, etc.) |

### 🤖 AI-Powered Smart Search
**Endpoint:** `GET /products/search?q=query_string`

The backend uses a combination of natural language processing (OpenAI) and fuzzy matching.
- **Example Queries:** 
    - `"red gym shoes under 3000"` -> Automatically sets filters for color, price, and category.
    - `"latest laptops for gaming"` -> Sorts by date and price.
- **Fallback:** If AI parsing fails, it defaults to a standard `regex` search across name and description.

---

## 👤 4. User Profile & Preferences (`/user`)

### 📋 Endpoint Table
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| GET | `/user/profile` | Private | Full profile details |
| PUT | `/user/profile` | Private | Update name, avatar, etc. |
| POST | `/user/addresses` | Private | Add a shipping address |
| GET | `/user/recommendations` | Private | Get AI-personalized products |
| POST | `/user/track-view/:id` | Private | Inform AI of user interests |

---

## 🛒 5. Cart & Wishlist (`/cart`, `/wishlist`)

### 📋 Cart Management
- `GET /cart`: View current items and subtotal.
- `POST /cart/add`: Add `{ productId, qty }`.
- `PUT /cart/update/:id`: Update quantity of an item.
- `DELETE /cart/:id`: Remove item.

### 📋 Wishlist
- `GET /wishlist`: List of saved products.
- `POST /wishlist/:id`: Toggle product in/out of wishlist.

---

## 📦 6. Order Lifecycle (`/orders`)

### 🚩 Lifecycle States
`Pending` → `Processing` → `Shipped` → `Delivered` → `Returned` (or `Cancelled`)

### 📋 Endpoint Table
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| POST | `/orders` | Private | Checkout and create order |
| GET | `/orders/my-orders` | Private | History of user orders |
| GET | `/orders/:id` | Private | Full order breakdown |
| PUT | `/orders/:id/cancel` | Private | User cancel (only if status is Pending) |

---

## 🛠️ 7. Admin Panel Dashboard (`/admin`)

Strictly restricted to users with `role: admin`.

### 📋 Administrative Operations
- **Inventory:** `GET /admin/stats` - Returns revenue, order counts, and low-stock alerts.
- **Order Control:** `PUT /admin/orders/:id/status` - Move order through lifecycle.
- **Product CRUD:** 
    - `POST /admin/products`
    - `PUT /admin/products/:id`
    - `DELETE /admin/products/:id`
- **Analytics:** `GET /admin/analytics` - Sales velocity and popular categories.

---

## ⚠️ 8. Error Handling & Validation Rules

### 🛡️ Validation Constraints
- **Passwords:** Min 8 characters, must include 1 uppercase and 1 number.
- **Emails:** Valid email format required.
- **Stock:** Cannot order more than available inventory.

### 🚥 HTTP Status Codes
- `200 OK`: Success with payload.
- `201 Created`: Resource successfully created (POST).
- `400 Bad Request`: Validation failure or logic error.
- `401 Unauthorized`: Token missing or expired.
- `403 Forbidden`: Authenticated but lack permission (e.g., user accessing admin).
- `404 Not Found`: Item/URL does not exist.
- `500 Server Error`: Unexpected backend crash.

---

## 💡 9. Frontend Integration Notes

1. **Caching:** Suggest using `React Query` or `SWR` for products to reduce server load.
2. **Debounce Search:** Implement a 500ms debounce on the AI search input to prevent API rate limiting.
3. **Image Handling:** All images are served via CDN (Cloudinary). Frontend should use the `thumbnail` transformation where possible.
4. **Token Refresh:** If an API call fails with `401`, retry once after calling `/auth/refresh-token`.

---
**Prepared by Antigravity Senior Architecture Team.**
