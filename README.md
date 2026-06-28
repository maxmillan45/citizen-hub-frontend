# Citizen Hub Kenya - Frontend Application

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Installation](#installation)
5. [Environment Variables](#environment-variables)
6. [Project Structure](#project-structure)
7. [Authentication Flow](#authentication-flow)
8. [API Integration](#api-integration)
9. [Available Scripts](#available-scripts)
10. [Deployment](#deployment)
11. [Troubleshooting](#troubleshooting)
12. [Contributing](#contributing)
13. [License](#license)

---

## Project Overview

Citizen Hub Kenya is a comprehensive civic engagement platform that empowers Kenyan citizens with access to legal information, government services, and participatory tools. The frontend application provides an intuitive interface for citizens to interact with the backend API, which includes features such as constitution search, MP tracking, crime reporting, and AI-powered legal assistance.

The application is built with React and utilizes M-Pesa STK Push for authentication, eliminating the need for traditional passwords. Users verify their identity through their mobile phone number and authorize access via a one-tap M-Pesa transaction.

---

## Features

### Authentication
- M-Pesa STK Push authentication using Safaricom's API
- Passwordless login via phone number verification
- Automatic user profile creation on first login
- JWT token-based session management with refresh tokens

### Constitution Access
- Full text search across all 264 constitution articles
- Filter by topic (rights, land, government, citizenship)
- View individual articles with simplified translations
- Chapter-based article organization

### Parliamentary Information
- Comprehensive list of all 102 Members of Parliament
- Filter MPs by political party or constituency
- Search MPs by name
- View MP profiles including contact information

### Kenyan History
- Curated historical facts from pre-colonial to modern era
- Category-based filtering (leaders, independence, culture, etc.)
- Search functionality across all history entries
- Year-based chronological sorting

### Legal FAQ System
- Categorized frequently asked questions
- Search questions and answers
- Expandable question cards for easy reading
- View counts and helpfulness ratings

### AI Legal Assistant
- Ask legal questions in English or Swahili
- Responses based on constitutional articles
- Conversation history tracking
- Source citation for legal references

### Crime Reporting
- Submit anonymous crime reports
- Track report status (pending, investigating, resolved, dismissed)
- View personal crime report history
- Admin dashboard for managing reports

### Civic Events
- View public holidays and civic events
- Filter by category and location
- Upcoming events displayed chronologically
- Event details including location and organizer

### Public Events
- Community meetings and town halls
- Government service drives
- Voter registration campaigns
- Civic education workshops

### User Profile
- Complete profile after first login
- Update personal information
- Language preference (English or Swahili)
- Civic engagement score tracking

### Admin Dashboard
- Full platform statistics
- User management
- Crime report oversight
- Payment monitoring
- FAQ management
- Chatbot conversation review
- Data scraping controls
- System settings configuration

---

## Technology Stack

### Core Frameworks
- React 18.3.1
- React Router DOM 6.23.1
- Axios 1.7.2

### Styling
- CSS3 with custom variables
- React Icons 5.2.1

### State Management
- React Hooks (useState, useEffect)
- Local Storage for session persistence

### Build Tools
- Vite 5.2.0
- ESLint 9.4.0

### API Communication
- Axios interceptors for JWT token management
- Automatic token refresh on 401 responses

---

## Installation

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher



### Setup Instructions

1. Clone the repository
git clone https://github.com/maxmillan45/citizen-hub-frontend.git

   ``` bash 
   cd citizen-hub-frontend
   
2. Install dependencies
npm install



3. Create environment file
cp .env.example .env



4. Start the development server
npm run dev



5. Build for production
npm run build


6. Preview production build
npm run preview



---

## Environment Variables

Create a `.env` file in the root directory with the following variables:
VITE_API_URL=https://citizen-hub-kenya-backend.onrender.com

text

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API base URL | http://localhost:8000 |

---

## Project Structure
src/
├── components/
│ ├── admin/
│ │ ├── layout/
│ │ │ └── AdminLayout.jsx
│ │ └── pages/
│ │ ├── Dashboard.jsx
│ │ ├── Users.jsx
│ │ ├── Crimes.jsx
│ │ ├── Payments.jsx
│ │ ├── Chatbot.jsx
│ │ ├── Faqs.jsx
│ │ ├── Scraping.jsx
│ │ └── Settings.jsx
│ ├── Chatbot.jsx
│ ├── CompleteProfile.jsx
│ ├── ConstitutionSearch.jsx
│ ├── Crime.jsx
│ ├── Events.jsx
│ ├── FAQ.jsx
│ ├── History.jsx
│ ├── Home.jsx
│ ├── Login.jsx
│ ├── MPList.jsx
│ ├── MpesaAuth.jsx
│ ├── Navbar.jsx
│ ├── Sidebar.jsx
│ └── Voting.jsx
├── services/
│ └── api.js
├── hooks/
│ └── useFetch.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css

## Authentication Flow

### M-Pesa STK Push Flow

1. User enters phone number on login page
2. Frontend calls `/api/get-token/` to create/get user
3. Frontend calls `/api/auth/stk/request/` to initiate STK push
4. User receives M-Pesa popup and enters PIN
5. Frontend polls `/api/auth/stk/status/` every 3 seconds
6. When status is successful, frontend calls `/api/auth/mpesa/authenticate/`
7. Backend returns JWT access token
8. Frontend stores token in localStorage
9. User is redirected to complete profile or home page

### Token Management
- Access tokens expire in 24 hours
- Refresh tokens expire in 7 days
- Tokens are automatically refreshed on 401 responses
- Logout clears all tokens from localStorage

---

## API Integration

The frontend communicates with the backend through a centralized API service.

### API Service Structure

```javascript
// src/services/api.js
import axios from 'axios';

const API_URL = 'https://citizen-hub-kenya-backend.onrender.com';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor for JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
    }
    return Promise.reject(error);
  }
);