# Tocca Project Documentation

## Overview

Tocca is a Next.js web application that provides a user interface for interacting with the Tocca API backend. This documentation covers how to set up and run the frontend application, configure the necessary environment variables, and ensure proper integration with the backend API.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Environment Configuration](#environment-configuration)
4. [Running the Application](#running-the-application)
5. [Backend Integration](#backend-integration)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the Tocca frontend, ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn package manager
- Git

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/GuiRissato/tocca.git
cd tocca
```

2. Install dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

## Environment Configuration

The application requires environment variables to be set up correctly. Create a `.env` file in the root directory with the following variables:

```
# API Configuration
API_URL="http://127.0.0.1:7560/"
```

## Running the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Production Build

To create a production build:

```bash
# Using npm
npm run build
npm start

# Using yarn
yarn build
yarn start
```

## Backend Integration

### Setting Up Tocca API

The frontend application requires the Tocca API backend to be running. Follow these steps to set up the backend:

1. Clone the Tocca API repository:

```bash
git clone https://github.com/GuiRissato/tocca-api.git
cd tocca-api
```

2. Install dependencies and set up the backend environment according to the Tocca API documentation.

3. Start the API server:

```bash
# Using npm
npm run start

# Using yarn
yarn start
```

### API Connection

The frontend communicates with the backend through API calls. The connection is configured in the following files:

- `/api/index.ts` - Contains the Axios instance configuration
- `/src/pages/api/*` - Contains API route handlers that proxy requests to the backend

Make sure your backend API is running and accessible at the URL specified in your `.env` file.

## Troubleshooting

### Common Issues

#### API Connection Issues

If the frontend cannot connect to the API:

1. Verify that the Tocca API is running
2. Check that the `API_URL` in your `.env` file is correct
3. Ensure network connectivity between frontend and backend

#### Build Errors

If you encounter build errors:

1. Check for outdated dependencies with `npm outdated` or `yarn outdated`
2. Ensure all required environment variables are set
3. Clear the `.next` directory and node_modules, then reinstall dependencies:

```bash
rm -rf .next node_modules
yarn install
yarn build
```

## Project Structure

```
tocca/
├── api/                 # API configuration
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Next.js pages
│   │   ├── api/         # API routes
│   │   └── ...          # Application pages
│   ├── services/        # Service layer for API interactions
│   ├── store/           # Redux store configuration
│   ├── styles/          # CSS and styling
│   └── utils/           # Utility functions
├── .env                 # Environment variables
├── next.config.js       # Next.js configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)