# DutchNSettle

A comprehensive expense sharing and bill splitting platform built with Node.js and Next.js, designed to simplify group expense management and settlement among friends, roommates, and colleagues.

## Features

### For Users
- **Expense Management**: Add, track, and categorize shared expenses with ease
- **Smart Splitting**: Split bills equally, by percentage, or with custom amounts
- **Group Management**: Create and manage expense groups for different occasions
- **Friend Network**: Add friends and maintain expense relationships
- **Balance Tracking**: Monitor who owes what to whom with real-time calculations
- **Settlement History**: View detailed expense history and settlement records
- **Dashboard Overview**: Get insights into your spending patterns and balances

### Core Functionality
- **Multiple Split Types**: Equal split, custom amounts, percentage-based splitting
- **Group Expenses**: Organize expenses by trips, shared living, or events
- **Debt Simplification**: Optimize settlements to minimize number of transactions
- **Email Notifications**: Automated notifications for new expenses and settlements
- **Search & Filter**: Find expenses and friends quickly with powerful search

## Architecture

```
DutchNSettle/
├── Backend/
│   └── dutchnsettle-api/          # Node.js/Express Backend
│       ├── controllers/           # API endpoint handlers
│       │   ├── expense/          # Expense management
│       │   ├── group/            # Group operations
│       │   └── user/             # User & friends management
│       ├── services/             # Business logic layer
│       ├── models/               # Mongoose ODM models
│       ├── routes/               # API route definitions
│       ├── middleware/           # Authentication & validation
│       ├── config/               # Application configuration
│       └── utils/                # Utility functions & enums
├── Frontend/
│   └── dutchnsettle-app/         # Next.js Frontend
│       ├── src/app/
│       │   ├── (routes)/         # Page routes
│       │   │   ├── dashboard/    # Main dashboard
│       │   │   ├── friends/      # Friends management
│       │   │   ├── group/        # Group management
│       │   │   └── profile/      # User profile
│       │   ├── components/       # Reusable UI components
│       │   ├── services/         # API service layer
│       │   └── lib/              # Utilities and configurations
│       └── styles/               # Styling and themes
└── Documents/                    # Project documentation & design files
```

## Tech Stack

### Backend
- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Google OAuth 2.0
- **Cloud Platform**: Google Cloud Platform
- **Storage**: Google Cloud Storage
- **Messaging**: Google Pub/Sub
- **Email Service**: Custom email service integration
- **Validation**: Joi for input validation

### Frontend
- **Framework**: Next.js 13.5
- **Styling**: Material-UI (MUI) + SCSS
- **Authentication**: NextAuth.js with Google OAuth
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Icons**: React Icons + MUI Icons
- **State Management**: React Hooks

### DevOps & Cloud
- **Deployment**: Google Cloud App Engine
- **Secret Management**: Google Cloud Secret Manager
- **Version Control**: Git
- **Environment**: Google Cloud Platform

## Prerequisites

- **Node.js**: 16 or higher
- **MongoDB**: 4.4 or higher (local or MongoDB Atlas)
- **Google Cloud Account**: For deployment and services
- **Git**: Latest version

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd DutchNSettle
```

### 2. Backend Setup
```bash
cd Backend/dutchnsettle-api

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env
# Configure the following in .env:
# MONGO_URL=mongodb://localhost:27017
# MONGO_DATABASE=dutchnsettle
# GOOGLE_CLIENTID=your-google-client-id
# GOOGLE_CLIENTSECRET=your-google-client-secret
# GOOGLE_PROJECTID=your-gcp-project-id

# Start development server
npm run dev
```

The backend will be available at `http://localhost:3001`

### 3. Frontend Setup
```bash
cd Frontend/dutchnsettle-app

# Install dependencies
npm install

# Configure environment variables
# Create .env.local with:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-nextauth-secret
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

# Run development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Configuration

### Backend Configuration
Create `.env` file in `Backend/dutchnsettle-api/`:

```env
# Database Configuration
MONGO_URL=mongodb://localhost:27017
MONGO_DATABASE=dutchnsettle
MONGO_USERNAME=your_mongo_username
MONGO_PASSWORD=your_mongo_password

# Google OAuth Configuration
GOOGLE_CLIENTID=your-google-client-id
GOOGLE_CLIENTSECRET=your-google-client-secret
GOOGLE_PROJECTID=your-gcp-project-id

# Application Configuration
DEV_APP_PORT=3001
APP_NAME=DutchNSettle
NODE_ENV=development

# Google Cloud Services
GOOGLE_PUBSUB_TOPICID=your-pubsub-topic
```

### Frontend Configuration
Create `.env.local` in `Frontend/dutchnsettle-app/`:

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
API_BASE_URL=http://localhost:3001
```

## Deployment

### Backend Deployment (Google Cloud App Engine)
```bash
cd Backend/dutchnsettle-api

# Deploy to Google Cloud
npm run deploy
```

### Frontend Deployment (Google Cloud App Engine)
```bash
cd Frontend/dutchnsettle-app

# Deploy to Google Cloud
npm run deploy
```

## Database Schema

### Core Entities
- **User**: User profiles and authentication data
- **Friends**: Friend relationships and balance tracking
- **Group**: Expense groups and member management
- **Expense**: Individual expense records
- **ExpenseDetail**: Detailed split information for each expense

### Key Relationships
- Users can have multiple friend relationships
- Groups contain multiple users as members
- Expenses belong to users and optionally to groups
- ExpenseDetails track individual splits for each expense

## Security

- Google OAuth 2.0 based authentication
- JWT token-based session management
- Input validation using Joi schemas
- MongoDB injection prevention
- Secure API endpoint protection

## Acknowledgments

- Google Cloud Platform for reliable cloud services
- MongoDB for flexible document storage
- Next.js and Express.js communities for excellent frameworks
- Material-UI for beautiful React components

---

**Made with ❤️ by the DutchNSettle Team**