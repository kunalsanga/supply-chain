# KaggleHub Integration Guide

This project now includes integration with KaggleHub to download real retail inventory datasets directly into your supply chain management system.

## 🚀 How to Use KaggleHub

### Prerequisites

1. **Install Python** (if not already installed)
2. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Using the KaggleHub Integration

#### Method 1: Through the Web Dashboard
1. Open your dashboard at http://localhost:3000
2. Click the **"Download Kaggle Dataset"** button
3. Wait for the download to complete (may take a few minutes)
4. The data will automatically appear in your inventory events table

#### Method 2: Direct API Call
```bash
curl -X POST http://localhost:8080/api/inventory/download-kaggle
```

#### Method 3: Python Script Directly
```python
import kagglehub

# Download the retail inventory dataset
path = kagglehub.dataset_download("anirudhchauhan/retail-store-inventory-forecasting-dataset")
print("Dataset downloaded to:", path)
```

## 📊 Available Datasets

The system is configured to download:
- **Dataset**: `anirudhchauhan/retail-store-inventory-forecasting-dataset`
- **Type**: Retail store inventory forecasting data
- **Format**: CSV files with inventory events

## 🔧 How It Works

1. **Frontend**: User clicks "Download Kaggle Dataset" button
2. **Backend**: Java service calls Python script
3. **Python Script**: Downloads dataset using kagglehub
4. **Data Processing**: Converts Kaggle data to our inventory format
5. **Storage**: Saves processed data to backend resources
6. **Display**: Shows data in the dashboard table

## 📁 File Structure

```
backend/
├── src/main/resources/
│   ├── scripts/
│   │   └── kaggle_downloader.py    # Python script for downloading
│   └── static/
│       └── kaggle_inventory_data.csv  # Downloaded and processed data
├── requirements.txt                  # Python dependencies
└── KAGGLE_INTEGRATION.md           # This file
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Python not found**: Make sure Python is installed and in your PATH
2. **kagglehub not installed**: Run `pip install kagglehub`
3. **Permission errors**: Make sure the backend has write permissions to the static directory
4. **Network issues**: Check your internet connection for downloading datasets

### Error Messages:

- **"Python script failed"**: Check if Python and dependencies are installed
- **"Download failed"**: Check internet connection and Kaggle dataset availability
- **"File not found"**: Ensure the Python script is in the correct location

## 🔄 API Endpoints

- `POST /api/inventory/download-kaggle` - Download Kaggle dataset
- `GET /api/inventory/kaggle-status` - Check if Kaggle data is available
- `GET /api/inventory/events` - Get all inventory events (including Kaggle data)

## 📈 Benefits

- **Real Data**: Use actual retail inventory datasets
- **Automated**: One-click download and processing
- **Integrated**: Seamlessly works with existing dashboard
- **Scalable**: Easy to add more datasets

## 🎯 Next Steps

1. Try downloading the Kaggle dataset through the dashboard
2. Explore the downloaded data in the inventory events table
3. Consider adding more Kaggle datasets for different use cases
4. Implement data analysis features using the real dataset

The KaggleHub integration makes your supply chain management system more powerful by providing access to real-world inventory data for testing and analysis! 