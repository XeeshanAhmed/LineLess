# LineLess – Smart Token Management System

> **Say goodbye to waiting in line!**

LineLess is a modern, real-time digital queue management system that eliminates the hassle of physical waiting lines. Built with the MERN stack, it provides seamless token generation, live queue tracking, and analytics for businesses and their customers.

---

## 🎯 Problem / Objective

**The Problem:**
- Traditional queuing systems force customers to wait physically in long lines
- No transparency on wait times or queue position
- Inefficient crowd management leading to customer dissatisfaction
- Lack of data-driven insights for businesses to optimize service delivery

**Our Solution:**
LineLess digitizes the entire queuing experience by allowing users to:
- Generate tokens remotely and track their position in real-time
- Receive notifications when their turn approaches
- Provide feedback to help businesses improve service quality
- Enable businesses to manage queues efficiently with analytics and insights

---

## 🛠️ Tech Stack

### **Frontend**
- **React.js** - UI framework
- **Redux Toolkit** - State management
- **React Router** - Navigation and routing
- **Tailwind CSS** - Styling framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time communication
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **React Toastify** - Notifications
- **Lucide React & React Icons** - Icon libraries
- **date-fns** - Date formatting

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.IO** - Real-time bidirectional communication
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt/bcryptjs** - Password hashing
- **Nodemailer** - Email notifications
- **dotenv** - Environment variable management
- **cookie-parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

### **Development Tools**
- **Nodemon** - Backend hot reload
- **ESLint** - Code linting

---

## ✨ Features

### **For Users:**
- 🔐 **Secure Authentication** - Register and login with email and password
- 🏢 **Business Selection** - Browse and select from available businesses
- 🏬 **Department Selection** - Choose specific departments within businesses
- 🎟️ **Token Generation** - Generate virtual queue tokens instantly
- 📊 **Real-time Queue Tracking** - Monitor your position and estimated wait time
- 🔔 **Email Notifications** - Receive alerts when your turn is near (3rd in line)
- ⏰ **Active Token Management** - View all your active tokens across different businesses
- 📸 **Queue Snapshots** - View current queue statistics and wait times
- ⭐ **Feedback System** - Rate and review your experience after service
- 👤 **Profile Management** - Update personal information and credentials

### **For Businesses:**
- 🔐 **Business Authentication** - Secure registration and login for business accounts
- 🏪 **Department Management** - Create and manage multiple departments
- 📋 **Token Queue Management** - View and manage pending tokens in real-time
- ✅ **Token Status Updates** - Mark tokens as completed or cancelled
- 📊 **Analytics Dashboard** - Track daily token trends and patterns
- 📈 **Performance Metrics** - Monitor total tokens, processing times, and efficiency
- 💬 **Feedback Analytics** - View customer ratings and feedback distribution
- ⚡ **Real-time Updates** - Automatic queue updates via WebSocket
- 🎯 **Average Processing Time** - Set and track service time per department
- 📧 **Automated Email Notifications** - System sends emails to users in queue

### **Technical Features:**
- 🔄 **Real-time Communication** - Socket.IO for instant updates
- 🛡️ **Role-based Access Control** - Separate user and business authentication
- 🔒 **JWT Authentication** - Secure token-based auth with HTTP-only cookies
- 📱 **Responsive Design** - Mobile-friendly interface
- 🎨 **Modern UI/UX** - Clean, intuitive design with smooth animations
- 🔐 **Password Reset** - OTP-based forgot password functionality
- 🚀 **Optimized Performance** - Fast loading and efficient data handling


---

## 🚀 How to Run the Project

### **Prerequisites**
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**
- **Gmail account** (for email notifications)

### **Step 1: Clone the Repository**

```bash
git clone https://github.com/XeeshanAhmed/LineLess.git
cd LineLess
```

### **Step 2: Backend Setup**

#### 2.1 Navigate to backend directory
```bash
cd backend
```

#### 2.2 Install dependencies
```bash
npm install
```

#### 2.3 Create `.env` file in the `backend` directory

Create a `.env` file and add the following environment variables:

```env
# Server Configuration
PORT=5000

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

# JWT Secret (generate a random secure string)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Important Notes:**
- For `EMAIL_PASS`, use a Gmail App Password, not your regular password
  - Go to Google Account → Security → 2-Step Verification → App passwords
  - Generate a new app password for "Mail"
- For `JWT_SECRET`, generate a strong random string (e.g., using `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)

#### 2.4 Start MongoDB
Make sure MongoDB is running:
- **Local MongoDB:** Start MongoDB service
- **MongoDB Atlas:** Ensure your cluster is running and connection string is correct

#### 2.5 Run the backend server
```bash
npm run dev
```

The backend server should start at `http://localhost:5000`

### **Step 3: Frontend Setup**

#### 3.1 Open a new terminal and navigate to frontend directory
```bash
cd frontend
```

#### 3.2 Install dependencies
```bash
npm install
```

#### 3.3 Run the frontend development server
```bash
npm run dev
```

The frontend should start at `http://localhost:5173`

### **Step 4: Access the Application**

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📝 Environment Variables Reference

### **(.env)**

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://localhost:27017` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_random_secret_key` |
| `EMAIL_USER` | Gmail address for notifications | `yourapp@gmail.com` |
| `EMAIL_PASS` | Gmail app password | `abcd efgh ijkl mnop` |


---

## 🎮 Usage Guide

### **For Users:**
1. Navigate to the home page and select **"User"**
2. **Sign up** with email and password or **Login** if you have an account
3. **Select a Business** from the available list
4. **Choose a Department** within that business
5. **Generate a Token** and track your queue position
6. Receive **email notifications** when you're 3rd in line
7. **View your active tokens** in the dashboard
8. **Submit feedback** after your service is completed

### **For Businesses:**
1. Navigate to the home page and select **"Business"**
2. **Sign up** with business details or **Login**
3. **Create Departments** (optional) or use default "General" department
4. **View Token Queue** - see all pending tokens
5. **Manage Tokens** - mark tokens as completed or cancelled
6. **View Analytics** - track daily token trends, processing times
7. **Review Feedback** - see customer ratings and comments
8. Set **Average Processing Time** per department for accurate estimates

---

## 📸 Sample Project Video


https://github.com/user-attachments/assets/400ba9d9-2a38-43d3-a94f-7ad3fe3def84



---

## 🔧 API Endpoints Overview

### **Authentication**
- `POST /api/userAuth/register` - User registration
- `POST /api/userAuth/login` - User login
- `POST /api/businessAuth/register` - Business registration
- `POST /api/businessAuth/login` - Business login

### **Token Management**
- `POST /api/token/generate` - Generate new token
- `GET /api/token/queue/:businessId/:departmentId` - Get token queue
- `PATCH /api/token/:tokenId` - Update token status
- `GET /api/token/active/:userId` - Get user's active tokens

### **Analytics**
- `GET /api/analytics/tokens/:businessId/:departmentId` - Token analytics
- `GET /api/analytics/feedback/:businessId/:departmentId` - Feedback analytics

### **Feedback**
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:businessId/:departmentId` - Get feedback list

---




