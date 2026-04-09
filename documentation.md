# 🚀 E-commerce Backend API Documentation (Frontend Integration)

This document provides all the details required for the frontend team to integrate with the backend.

## 📌 Global Configuration
- **Base URL:** `http://localhost:5000/api/v1`
- **Default Port:** `5000`
- **Content-Type:** `application/json`
- **Authentication:** Bearer Token (JWT) in `Authorization` header.
  - Frequency: Access Token in header, Refresh Token in HttpOnly Cookie.

---

## 🔐 1. Authentication Module (`/auth`)

### Register User
- **Endpoint:** `POST /auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password@123"
}
```
- **Response:** `201 Created`. Triggers a verification email.

### Login
- **Endpoint:** `POST /auth/login`
- **Body:** `{ "email": "john@example.com", "password": "Password@123" }`
- **Response:**
```json
{
  "success": true,
  "accessToken": "eyJhbGci...",
  "user": { "id": "...", "name": "John Doe", "email": "...", "role": "user" }
}
```

### Logout
- **Endpoint:** `POST /auth/logout`
- **Access:** Public
- **Response:** Clears the HttpOnly Refresh Token cookie.

### Verify Email
- **Endpoint:** `GET /auth/verify-email?token=SECRET_TOKEN`
- **Access:** Public (Link sent via email)

---

## 🔍 2. Product & AI Search (`/products`)

### AI-Enhanced Search
- **Endpoint:** `GET /products/search?q=query_string`
- **Query Params:** `q` (e.g., "red gym shoes under 3000")
- **Response:**
```json
{
  "success": true,
  "count": 5,
  "aiParsed": true,
  "appliedFilters": { "color": "red", "maxPrice": 3000, "category": "shoes" },
  "data": [ ...productObjects ]
}
```

---

## 👤 3. User & Recommendations (`/user`)

### Track Product View (For AI)
- **Endpoint:** `POST /user/track-view/:productId`
- **Access:** Private (Bearer Token)
- **Note:** Call this whenever a user clicks/views a product detail page.

### Get AI Recommendations
- **Endpoint:** `GET /user/recommendations`
- **Access:** Private (Bearer Token)
- **Response:** Returns personalized products based on viewing history.

---

## 📦 4. Order Management (`/orders`)

### Place Order
- **Endpoint:** `POST /orders`
- **Access:** Private (Bearer Token)
- **Body:**
```json
{
  "orderItems": [{ "product": "ID", "qty": 1, "name": "...", "price": 100, "image": "..." }],
  "shippingAddress": { "street": "...", "city": "...", "zipCode": "...", "country": "..." },
  "paymentMethod": "Stripe",
  "totalPrice": 100
}
```

### Get Order Details
- **Endpoint:** `GET /orders/:id`
- **Access:** Private (Owner or Admin)

---

## 🛠️ 5. Admin Panel (`/admin`)

### Dashboard Stats
- **Endpoint:** `GET /admin/stats`
- **Access:** Admin Only
- **Response:** Total revenue, active orders, low stock alerts.

### Update Order Status
- **Endpoint:** `PUT /admin/orders/:id/status`
- **Access:** Admin Only
- **Body:** `{ "status": "Shipped" }` (Options: Processing, Shipped, Delivered, Cancelled)

---

## ⚠️ Standard Error Format
All errors follow this structure:
```json
{
  "success": false,
  "statusCode": 401,
  "message": "Invalid token. Please login again",
  "stack": "..." // Only in development
}
```

---
**Happy Coding!**
