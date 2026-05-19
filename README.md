# 🚗 DriveFleet Server - Car Rental Platform API

This is the backend server of the DriveFleet Car Rental Platform. The server handles authentication, car management, booking functionality, JWT security, protected APIs, and MongoDB database operations.

---

## 🌐 Live Server

🔗 Server URL: https://your-server-link.onrender.com

---

## 📌 Features

- 🔐 JWT Authentication with HTTPOnly Cookies
- 🚘 Add, Update, Delete Car APIs
- 📅 Booking Management System
- 🔎 Search & Filter Functionality
- 🛡️ Protected Private Routes & APIs
- 📦 MongoDB CRUD Operations
- ⚡ Booking Count Increment using `$inc`
- 🌍 CORS Configured for Secure Client Access

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- MongoDB
- JWT
- Cookie Parser
- CORS
- dotenv

---

## 📂 API Endpoints

### Authentication
- `POST /jwt`
- `POST /logout`

### Cars
- `GET /all-cars`
- `GET /car/:id`
- `POST /add-car`
- `PATCH /add-car/:id`
- `DELETE /add-car/:id`

### Bookings
- `POST /bookings`
- `GET /bookings/:email`

---

## 🔍 Search & Filter

Implemented:
- Search by car name using `$regex`
- Filter by car type using `$in`

Example:

```txt id="mjlwmf"
/all-cars?search=toyota&carType=SUV
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory and add:

```env
PORT=5000

DB_USER=your_database_user
DB_PASS=your_database_password

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:3000
```

---

## ⚙️ Installation & Setup

### Clone the repository

```bash id="u8xj0p"
git clone https://github.com/your-username/drivefleet-server.git
```

### Navigate to the project folder

```bash id="czcvsv"
cd drivefleet-server
```

### Install dependencies

```bash id="0t6jza"
npm install
```

### Run the server

```bash id="i9nd78"
nodemon index.js
```

---

## 📦 NPM Packages Used

```bash id="y1x8jr"
npm install express mongodb cors dotenv jsonwebtoken cookie-parser
```

---

## 🔒 Security Features

- JWT Token Verification
- HTTPOnly Cookies
- Protected Routes
- MongoDB Credentials Hidden with Environment Variables
- CORS Protection

---

## 👨‍💻 Developer

Developed by Md Rahim Sikdar

```