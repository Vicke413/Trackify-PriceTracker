# E-Commerce Price Tracker

A modern web application that tracks product prices across e-commerce platforms, providing historical price data and alerting users when prices drop.

## 🌟 Features

- **Product Search & Tracking**: Search and track products from major e-commerce platforms
- **Price History Visualization**: View price trends with interactive charts
- **Price Drop Alerts**: Get notified when prices drop to your desired level
- **Wishlist Management**: Save and organize products you're interested in
- **User Authentication**: Secure user accounts with profile management
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## 🔧 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Chart.js (for price history visualization)
- Context API (for state management)

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JWT Authentication

### APIs
- Rainforest API (for Amazon product data)
- Notification Service (for price alerts)

## 📋 Installation & Setup

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd e-commerce-price-tracker
   ```

2. **Install dependencies**
   ```
   npm run install-all
   ```

3. **Environment Configuration**
   Create `.env` files in both client and server directories with necessary environment variables.

4. **Run the application**
   ```
   npm start
   ```

## 🔄 API Integration

This project uses the Rainforest API for fetching product data from Amazon. You'll need to:

1. Register for an API key at [Rainforest API](https://www.rainforestapi.com/)
2. Add the API key to your server's `.env` file

## 🚀 Deployment

- Frontend: Vercel, Netlify, or similar
- Backend: Heroku, Railway, or similar
- Database: MongoDB Atlas

## 📝 License

This project is licensed under the ISC License. 
