# 🏦 MIDAS VAULT - Platform Marketplace Modern

Platform e-commerce dengan fitur **Marketplace**, **Barter**, dan **Tukar Tambah** yang terintegrasi.

## 🚀 Fitur Utama

### 🛍️ Marketplace
- Jual beli produk dengan sistem escrow
- Verifikasi produk oleh admin
- Filtering dan pencarian produk
- Review dan rating system

### ⚖️ Sistem Barter  
- Tukar barang dengan barang
- Konfirmasi 2 arah
- Validasi ketersediaan produk
- History transaksi barter

### 🔄 Tukar Tambah
- Tukar barang + bayar selisih harga
- Kalkulasi otomatis nilai tukar
- Multiple payment methods
- Fleksibel preferensi

## 🏗️ Architecture

### Tech Stack
**Backend:**
- Laravel 11 + PHP 8.3
- MySQL Database
- Laravel Sanctum (Auth)
- Local Filesystem Storage

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- React Router DOM
- Axios HTTP Client

## 📁 Project Structure

### Backend (Laravel)
```
midas-vault-backend/
├── 📄 .env                          # Environment variables (contoh)
├── 📄 artisan                       # Laravel CLI
├── 📄 composer.json                 # PHP dependencies
├── 📁 app/
│   ├── 📁 Http/
│   │   ├── 📁 Controllers/
│   │   │   ├── 📄 Controller.php               # Base Controller (default Laravel)
│   │   │   └── 📁 Api/
│   │   │       ├── 📄 AdminController.php
│   │   │       ├── 📄 AuthController.php
│   │   │       ├── 📄 ProductController.php
│   │   │       ├── 📄 TransactionController.php
│   │   │       ├── 📄 BarterController.php
│   │   │       ├── 📄 TradeInController.php
│   │   │       └── 📄 VerificationController.php
│   │   └── 📁 Requests/
│   │       ├── 📄 ProductRequest.php
│   │       └── 📄 UpdateProductRequest.php
│   └── 📁 Models/
│       ├── 📄 User.php
│       ├── 📄 Product.php
│       ├── 📄 Transaction.php
│       ├── 📄 Barter.php
│       └── 📄 TradeIn.php
├── 📁 bootstrap/
│   ├── 📄 app.php                  # Application bootstrap
│   └── 📁 cache/                   # Cache directory
├── 📁 database/
│   ├── 📁 migrations/
│   │   ├── 📄 create_users_table.php
│   │   ├── 📄 create_products_table.php
│   │   ├── 📄 create_transactions_table.php
│   │   ├── 📄 create_barters_table.php
│   │   └── 📄 create_trade_ins_table.php
│   └── 📁 seeders/
│       └── 📄 DatabaseSeeder.php
├── 📁 public/
│   ├── 📄 index.php                # Entry point
│   └── 📄 .htaccess
├── 📁 routes/
│   ├── 📄 api.php                  # API routes
│   ├── 📄 web.php                  # Web routes
│   └── 📄 console.php              # Console routes
├── 📁 storage/                     # Storage folder
└── 📁 vendor/                      # Composer dependencies
```


### Frontend (React)
```
midas-vault-frontend/
├── 📄 index.html                    # Entry point
├── 📄 package.json                  # Node.js dependencies
├── 📄 vite.config.js                # Vite configuration
├── 📄 tailwind.config.js            # Tailwind CSS config
├── 📄 .env                          # Environment variables
└── 📁 src/
    ├── 📄 main.jsx                  # React entry point
    ├── 📄 App.jsx                   # Main App component
    ├── 📄 index.css                 # Global styles
    ├── 📁 components/               # Reusable UI components
    │   ├── 📄 Navbar.jsx
    │   ├── 📄 Footer.jsx
    │   ├── 📄 ProductCard.jsx
    │   └── 📄 Loader.jsx
    ├── 📁 pages/                    # Page components
    │   ├── 📄 Home.jsx
    │   ├── 📄 Marketplace.jsx
    │   ├── 📄 Login.jsx
    │   ├── 📄 Register.jsx
    │   ├── 📄 Dashboard.jsx
    │   ├── 📄 ProductDetail.jsx
    │   ├── 📄 EditProduct.jsx
    │   ├── 📄 AdminDashboard.jsx
    │   ├── 📄 VerificationPage.jsx
    │   ├── 📄 Barter.jsx
    │   └── 📄 TradeIn.jsx
    └── 📁 services/                 # API utilities
        └── 📄 api.js
```


## 🌐 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/register` | Register user baru |
| `POST` | `/api/v1/login` | Login user |
| `POST` | `/api/v1/logout` | Logout user |
| `GET` | `/api/v1/user` | Get user data |
| `PUT` | `/api/v1/user` | Update profile |

### 🛍️ Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/products` | List products |
| `GET` | `/api/v1/products/{id}` | Detail product |
| `POST` | `/api/v1/products` | Upload product |
| `POST` | `/api/v1/products/{id}` | Update product |
| `DELETE` | `/api/v1/products/{id}` | Delete product |
| `GET` | `/api/v1/my-products` | User's products |

### 💰 Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/transactions` | Create transaction |
| `GET` | `/api/v1/my-transactions` | User transactions |
| `PATCH` | `/api/v1/transactions/{id}/confirm` | Confirm completion |
| `PATCH` | `/api/v1/transactions/{id}/cancel` | Cancel transaction |

### ⚖️ Barter
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/barters` | Create barter |
| `GET` | `/api/v1/my-barters` | User barters |
| `PATCH` | `/api/v1/barters/{id}/accept` | Accept barter |
| `PATCH` | `/api/v1/barters/{id}/reject` | Reject barter |
| `PATCH` | `/api/v1/barters/{id}/complete` | Complete barter |
| `PATCH` | `/api/v1/barters/{id}/cancel` | Cancel barter |

### 🔄 Trade-In
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/trade-ins` | Create trade-in |
| `GET` | `/api/v1/my-trade-ins` | User trade-ins |
| `PATCH` | `/api/v1/trade-ins/{id}/accept` | Accept trade-in |
| `PATCH` | `/api/v1/trade-ins/{id}/reject` | Reject trade-in |
| `PATCH` | `/api/v1/trade-ins/{id}/pay` | Pay difference |
| `PATCH` | `/api/v1/trade-ins/{id}/cancel` | Cancel trade-in |

### 👑 Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/admin/overview` | Dashboard overview |
| `GET` | `/api/v1/verifications/pending` | Pending verifications |
| `PATCH` | `/api/v1/verifications/{id}` | Verify product |
| `GET` | `/api/v1/verifications/verified` | Verified products |

## 🗃️ Database Schema

### Users
sql
id, name, email, password, role, reputation_score, created_at, updated_at


### Products
id, user_id, name, description, category, condition, price, image_url,
verification_status, status, allow_barter, barter_preferences,
allow_trade_in, trade_in_value, trade_in_preferences, created_at, updated_at

### Transactions
id, buyer_id, seller_id, product_id, amount, status, 
payment_method, payment_reference, completed_at, created_at, updated_at

### Barters
id, requester_id, receiver_id, requester_product_id, receiver_product_id,
status, notes, requester_confirmed, receiver_confirmed, created_at, updated_at

### TradeIns
id, buyer_id, seller_id, old_product_id, new_product_id, price_difference,
status, payment_status, created_at, updated_at

## 👥 User Roles
### 🧑‍💼 User
Upload dan kelola produk
Beli produk marketplace
Ajukan barter dan trade-in
Beri review dan rating

### 👑 Admin
Verifikasi produk user
Monitoring sistem
Dashboard analytics
Kelola user reports

### 🔄 Business Flow
#### Normal Transaction
Buyer Order → Escrow System → Seller Confirm → Funds Release → Review

#### Barter Flow
User A Offer → User B Accept → Both Confirm → Exchange Complete → Review

#### Trade-In Flow
Offer Trade-In → Seller Accept → Calculate Difference → Pay → Complete → Review

# 🛡️ Security Features
1. Authentication: Laravel Sanctum tokens
2. Authorization: Role-based access control
3. Validation: Form request validation
4. CORS: Configured for frontend
5. File Upload: Secure image handling

# 🚀 Installation
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve

# Frontend Setup
npm install
cp .env.example .env
npm run dev

# Environment Variables
## Backend (.env):
APP_NAME=MidasVault
APP_URL=http://localhost:8000
DB_DATABASE=midas_vault

## Frontend (.env):
VITE_API_URL=http://localhost:8000/api/v1
