# Saffron Table - Restaurant Ordering Platform

A full-stack restaurant ordering application built with React, TypeScript, and Express. This project showcases modern web development practices with complete user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

### Frontend

- **User Authentication** - Complete login/register system with JWT cookie-based authentication
- **Product Catalog** - Browse restaurant menu items with filtering and search
- **Shopping Cart** - Add/remove items, adjust quantities, real-time price calculations
- **Order Management** - Place orders, track order status, view order history
- **User Dashboard** - Personal profile management and order tracking
- **Blog System** - Multi-layout blog pages with posts and comments
- **Responsive Design** - Mobile-first approach with Bootstrap 5

### Backend Integration

- **RESTful API** - Full Express.js backend with MongoDB
- **State Management** - Redux Toolkit with localStorage persistence
- **Service Layer** - Clean API abstraction with TypeScript types
- **Image Upload** - Product image handling with upload directory
- **Protected Routes** - Authentication middleware on both frontend and backend

## 🛠️ Tech Stack

### Frontend

- **React 18.3** - Modern React with hooks
- **TypeScript 5.7** - Type-safe development
- **Vite 7.0** - Lightning-fast build tool
- **Redux Toolkit 2.8** - State management
- **React Router v6** - Client-side routing
- **Bootstrap 5.3** - Responsive styling
- **Axios** - HTTP client

### Backend

- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **JWT** - Token-based authentication
- **Cookie-parser** - Secure cookie handling

## 📦 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── header/       # Navigation components
│   ├── banner/       # Hero sections
│   ├── menu/         # Food menu displays
│   ├── cart/         # Shopping cart UI
│   ├── shop/         # Product catalog
│   └── ...
├── pages/            # Page-level components
│   ├── homePages/    # Landing pages
│   ├── innerPages/   # Core app pages
│   ├── shopPage/     # E-commerce pages
│   └── blogPages/    # Blog layouts
├── store/            # Redux state management
│   └── slices/       # Redux slices (auth, cart, products, etc.)
├── services/         # API service layer
│   ├── api.service.ts    # Base API client
│   ├── member.api.ts     # Auth endpoints
│   ├── product.api.ts    # Product endpoints
│   └── order.api.ts      # Order endpoints
├── types/            # TypeScript definitions
└── hooks/            # Custom React hooks
```

## 🚦 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- MongoDB instance running

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd source
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
# Create .env file in root
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:3003
VITE_UPLOAD_URL=http://localhost:3003/uploads
```

4. **Start the backend server** (in separate terminal)

```bash
# Navigate to backend directory and start
npm run dev
```

5. **Start the development server**

```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔑 Key Features Implementation

### Authentication Flow

```typescript
// Login with Redux Toolkit
const result = await dispatch(
  loginUser({
    memberNick: username,
    memberPassword: password,
  }),
);

// JWT stored in HTTP-only cookie
// User data persisted in Redux + localStorage
```

### Shopping Cart

```typescript
// Add to cart with Redux
dispatch(
  addToCart({
    productId: product._id,
    quantity: 1,
    name: product.productName,
    price: product.productPrice,
  }),
);
```

### Order Processing

```typescript
// Create order via API
const order = await orderApi.createOrder({
  orderItems: cartItems,
  orderTotal: calculateTotal(),
  orderDelivery: deliveryAddress,
});
```

## 📱 API Endpoints

### Authentication

- `POST /member/login` - User login
- `POST /member/signup` - User registration
- `GET /member/logout` - User logout
- `GET /member/detail` - Get user profile

### Products

- `GET /product` - Get all products
- `GET /product/:id` - Get single product

### Orders

- `POST /order/create` - Create new order
- `GET /order/all` - Get user orders
- `PATCH /order/:id` - Update order status

## 🎨 Redux State Structure

```typescript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean
  },
  cart: {
    items: CartItem[],
    totalPrice: number
  },
  products: {
    items: Product[],
    selectedProduct: Product | null
  },
  orders: Order[]
}
```

## 🔒 Security Features

- HTTP-only cookies for JWT tokens
- Password hashing (backend)
- Protected API routes
- CORS configuration
- Input validation and sanitization

## 📄 License

This project is open source and available for portfolio purposes.

## 👨‍💻 Author

Portfolio project demonstrating full-stack development skills with modern React ecosystem and backend integration.

---

**Note:** This is a portfolio/demonstration project. For production use, additional security measures, testing, and optimizations would be recommended.
