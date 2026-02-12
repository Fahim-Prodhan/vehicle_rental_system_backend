# 🚗 Smart Vehicle Rental System

**Live URL:** https://vehicle-rental-system-delta-seven.vercel.app

Smart Vehicle Rental System is a backend REST API for managing a vehicle rental business.  
It provides secure role-based access control and handles vehicles, customers, and bookings efficiently.

---

## ✨ Features

### 🚘 Vehicles Management
- Add, update, delete vehicles (Admin only)
- Track availability status (`available` / `booked`)
- View all vehicles or single vehicle details (Public)

### 👤 Customers Management
- Register & login with secure authentication
- Update own profile
- Admin can manage all users

### 📅 Bookings Management
- Create vehicle bookings
- Validate vehicle availability
- Auto-calculate total rental cost (daily price × duration)
- Cancel booking (before start date only)
- Admin can mark booking as returned
- Automatically updates vehicle availability

### 🔐 Authentication & Authorization
- Password hashing using **bcrypt**
- JWT-based authentication
- Role-based access control:
  - **Admin** – Full system access
  - **Customer** – Manage own bookings & profile
- Protected routes require:



---

## 🛠️ Technology Stack

- **Node.js**
- **TypeScript**
- **Express.js**
- **PostgreSQL**
- **bcrypt**
- **jsonwebtoken (JWT)**

---


## ⚙️ Setup & Usage Instructions

### 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd vehicle_rental_system_backend
npm install

PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key

