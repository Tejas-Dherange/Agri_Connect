# AgriConnect

![AgriConnect Logo](https://via.placeholder.com/200x80?text=AgriConnect)

AgriConnect is a comprehensive farming platform designed to empower farmers with modern technology solutions. The platform provides a suite of tools for agricultural management, product identification, yield prediction, and community support.

## Features

### 🔍 Agricultural Product Identification
- Upload images of fertilizers, pesticides, herbicides, and more
- AI-powered identification of agricultural products
- Provides usage instructions, dosage information, and safety details
- Support for multiple languages (English, Hindi, Marathi, and more)
- Voice-based information playback in regional languages

### 🌱 Crop Management
- Crop yield prediction using machine learning models
- Smart irrigation recommendations based on soil type, crop, and weather
- Soil testing reports with nutrient recommendations
- Crop rotation and planning tools

### 💰 Financial Management
- Expense tracking and management dashboard
- Income forecasting based on yield predictions
- ROI calculators for different crops and farming techniques
- Financial report generation

### 🛒 Marketplace
- Bulk ordering of farm supplies at discounted rates
- Direct connection with suppliers, eliminating middlemen
- Product comparisons and reviews
- Order tracking and history

### 👨‍🔬 Expert Support
- Schedule consultations with agricultural experts
- Village-level awareness sessions
- Knowledge base with best practices
- Personalized recommendations

### 🌧️ Real-time Information
- Weather forecasts and alerts
- Market price integration for crops
- Government scheme notifications
- Pest outbreak warnings

### 👥 Community Features
- Farmer forums and discussion boards
- Success story sharing
- Local farming group creation
- Question and answer platform

## Technology Stack

### Frontend
- **Next.js** (v13.4+) - React framework for server-side rendering and static site generation
- **Tailwind CSS** (v3.3+) - Utility-first CSS framework
- **React Native** (v0.71+) - For mobile applications
- **shadcn/ui** - UI component library
- **i18next** - Internationalization framework

### Backend
- **Next.js API Routes** - Serverless functions for API endpoints
- **Express** (v4.18+) - For dedicated API servers
- **Node.js** (v18+) - JavaScript runtime

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB service
- **Mongoose** (v7+) - MongoDB object modeling

### Authentication
- **Auth.js** (v4+) - Authentication for Next.js
- **JWT** - Token-based authentication

### Machine Learning & AI
- **Python** (v3.9+) - For ML microservices
- **Flask** (v2.3+) - Lightweight web framework for Python
- **TensorFlow** (v2.12+) / **PyTorch** (v2.0+) - ML frameworks
- **Cloudinary** - Image analysis and processing
- **Roboflow** / **Hugging Face** - Pre-trained models and model hosting

### Text-to-Speech
- **Web Speech API** - Browser-based TTS
- **Google Translate TTS API** - For regional language support

### Cloud & DevOps
- **Vercel** - Frontend and Next.js API hosting
- **Railway** or **Render** - Backend service hosting
- **GitHub Actions** - CI/CD pipeline

### APIs & Integration
- **OpenWeather API** - Weather data
- **Government APIs** - Market prices and agricultural schemes
- **WhatsApp Cloud API** - Farmer notifications and alerts

## Setup Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher) or yarn (v1.22.0 or higher)
- Python (v3.9 or higher) for ML services
- MongoDB account
- Cloudinary account

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_random_string_here
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OpenWeather
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweather_api_key

# WhatsApp Cloud API (optional)
WHATSAPP_API_TOKEN=your_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# Google Translate TTS (optional)
GOOGLE_TRANSLATE_API_KEY=your_google_api_key
```

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/agriconnect.git
   cd agriconnect
   ```

2. Install frontend dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Setting up ML services (optional)

1. Create a Python virtual environment
   ```bash
   cd ml-services
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install required Python packages
   ```bash
   pip install -r requirements.txt
   ```

3. Start the ML service
   ```bash
   python app.py
   ```

## Project Structure

```
agriconnect/
├── app/                     # Next.js app directory
│   ├── api/                 # API routes
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Dashboard pages
│   ├── marketplace/         # Marketplace pages
│   └── product-identifier/  # Product identification pages
├── components/              # React components
│   ├── ui/                  # UI components (shadcn/ui)
│   ├── forms/               # Form components
│   └── layout/              # Layout components
├── lib/                     # Utility functions and hooks
├── public/                  # Static assets
├── styles/                  # Global styles
├── ml-services/             # Python ML services
│   ├── crop_prediction/     # Crop yield prediction models
│   └── product_recognition/ # Product recognition models
├── .env.local               # Environment variables
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Project dependencies
```

## API Endpoints

### Product Identification
- `POST /api/product-identification` - Identify agricultural products from images

### Crop Management
- `POST /api/crop/predict-yield` - Predict crop yield based on parameters
- `GET /api/soil-reports/:id` - Get soil testing reports
- `POST /api/irrigation/recommend` - Get irrigation recommendations

### Marketplace
- `GET /api/marketplace/products` - List available products
- `POST /api/marketplace/orders` - Create a new order
- `GET /api/marketplace/orders/:id` - Get order details

### Expert Support
- `POST /api/experts/schedule` - Schedule an expert consultation
- `GET /api/experts/sessions` - List upcoming awareness sessions

### Weather & Market Data
- `GET /api/weather/:location` - Get weather forecast
- `GET /api/market-prices/:crop` - Get current market prices

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All the farmers who provided valuable feedback during testing
- Agricultural experts who contributed domain knowledge
- Open-source community for the tools and libraries used in this project