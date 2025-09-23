# 🛍️ Kaithiran Marketplace

A modern, full-featured e-commerce marketplace built with React and Firebase, specializing in handcrafted and traditional Indian products.

## ✨ Features

### 🛒 **Customer Experience**
- **Product Discovery** - Advanced search and filtering
- **Smart Shopping Cart** - Real-time cart management
- **Wishlist System** - Save favorite products
- **Order Management** - Complete order lifecycle with cancellation
- **User Profiles** - Comprehensive profile management
- **AI-Powered Chatbot** - Intelligent product assistance

### 🏪 **Seller Dashboard**
- **Product Management** - Add, edit, delete products
- **Inventory Tracking** - Real-time stock management
- **Order Processing** - Complete order fulfillment
- **Analytics Dashboard** - Sales insights and visualizations
- **Performance Metrics** - Revenue and sales tracking

### 🤖 **AI Chatbot Features**
- **Natural Language Processing** - Understands complex queries
- **Context-Aware Responses** - Maintains conversation flow
- **Product Recommendations** - Intelligent suggestions
- **Multi-Intent Support** - Price, availability, trending, occasions
- **Indian Market Context** - Localized for Indian e-commerce

### 🎨 **User Interface**
- **Responsive Design** - Mobile-first approach
- **Modern UI/UX** - Tailwind CSS styling
- **Toast Notifications** - User-friendly feedback
- **Professional Modals** - Enhanced user interactions
- **Theme Support** - Multiple visual themes

## 🚀 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Firebase (Firestore, Auth, Storage)
- **State Management:** React Context API
- **Charts:** Chart.js for analytics
- **Icons:** React Icons (Font Awesome)
- **Routing:** React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SanjayC-19/KaithiranWeb.git
   cd KaithiranWeb
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Firestore, Authentication, and Storage
   - Update `src/firebase/firebaseConfig.js` with your config

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chatbot/        # Chatbot UI components
│   └── Layout.jsx      # Main layout wrapper
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   ├── CartContext.jsx # Shopping cart state
│   └── ChatbotContext.jsx # AI chatbot state
├── pages/              # Route components
│   ├── auth/          # Login/Signup pages
│   ├── buyer/         # Customer-facing pages
│   └── seller/        # Seller dashboard pages
├── services/           # API and service functions
├── chatbot/           # AI chatbot logic
└── firebase/          # Firebase configuration
```

## 🎯 Key Features Breakdown

### Order Management System
- **Order Placement** - Secure checkout process
- **Order Tracking** - Real-time status updates
- **Order Cancellation** - Professional cancellation workflow
- **Inventory Sync** - Automatic stock adjustments

### AI Chatbot Intelligence
- **Intent Classification** - 8+ different query types
- **Smart Product Search** - Multi-factor scoring algorithm
- **Context Memory** - Maintains conversation continuity
- **Indian Localization** - Currency, festivals, traditional products

### Seller Analytics
- **Sales Dashboard** - Revenue and performance metrics
- **Product Analytics** - Individual product insights
- **Filter System** - Category and status-based filtering
- **Export Functionality** - CSV data export

## 🔐 Security Features

- **Firebase Authentication** - Secure user management
- **Role-based Access** - Buyer/Seller permissions
- **Data Validation** - Input sanitization
- **Secure Transactions** - Protected order processing

## 🌟 Performance Optimizations

- **Code Splitting** - Optimized bundle sizes
- **Lazy Loading** - Efficient resource loading
- **Caching Strategy** - Improved user experience
- **Build Optimization** - Production-ready builds

## 📱 Responsive Design

- **Mobile-First** - Optimized for all devices
- **Touch-Friendly** - Mobile interaction patterns
- **Progressive Enhancement** - Works across browsers
- **Accessibility** - WCAG compliance considerations

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- **ESLint Configuration** - Code linting and formatting
- **Clean Architecture** - Modular component structure
- **Error Handling** - Comprehensive error management
- **Type Safety** - PropTypes and validation

## 🚀 Deployment

The application is optimized for deployment on:
- **Vercel** - Recommended for React apps
- **Netlify** - Static site deployment
- **Firebase Hosting** - Full Firebase integration
- **GitHub Pages** - Simple static hosting

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Contact: [Your Email]
- Documentation: [Link to docs]

---

**Built with ❤️ for the Indian handicraft and traditional products community**+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
