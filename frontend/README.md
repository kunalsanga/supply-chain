# Supply Chain Dashboard Frontend

A React-based frontend for the Supply Chain Management system that provides inventory monitoring and demand prediction capabilities.

## Features

- 📊 **Inventory Dashboard**: View and manage inventory data in a responsive table
- 🔍 **Search & Filter**: Search by Product ID, Store ID, or Category. Filter by Region and Category
- 📈 **Demand Prediction**: Run ML predictions on selected inventory items
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, minimal design with Tailwind CSS

## Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Backend server running on `http://localhost:8080`

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`

3. The application will automatically reload when you make changes to the code.

## API Endpoints

The frontend expects the following backend endpoints:

- `GET /api/dashboard/inventory` - Fetch inventory data
- `POST /api/ml/predict` - Run demand predictions

## Project Structure

```
src/
├── components/
│   ├── Dashboard.tsx          # Main dashboard component
│   ├── InventoryTable.tsx     # Inventory data table
│   ├── SearchBar.tsx          # Search and filter controls
│   └── PredictionModal.tsx    # Prediction results modal
├── App.tsx                    # Root component
└── index.css                  # Global styles with Tailwind
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (not recommended)

## Technologies Used

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests

## Troubleshooting

1. **Backend Connection Issues**: Ensure your backend server is running on port 8080
2. **CORS Errors**: Make sure your backend has CORS enabled
3. **Port Conflicts**: If port 3000 is in use, React will automatically suggest an alternative port

## Development

The application uses:
- Functional components with React hooks
- TypeScript for type safety
- Tailwind CSS for styling
- Axios for API communication

For development, the app will automatically reload when you save changes to the source code. 