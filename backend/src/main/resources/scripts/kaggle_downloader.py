#!/usr/bin/env python3
"""
Kaggle Dataset Downloader Script
This script downloads datasets from Kaggle and converts them to a format usable by the Java backend.
"""

import kagglehub
import pandas as pd
import sys
import os
import json
from pathlib import Path

def download_retail_dataset():
    """
    Download the retail store inventory forecasting dataset from Kaggle
    """
    try:
        print("Downloading retail store inventory dataset...")
        
        # Download the dataset
        path = kagglehub.dataset_download("anirudhchauhan/retail-store-inventory-forecasting-dataset")
        
        print(f"Dataset downloaded to: {path}")
        
        # Find CSV files in the downloaded directory
        csv_files = []
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.csv'):
                    csv_files.append(os.path.join(root, file))
        
        if not csv_files:
            print("No CSV files found in the downloaded dataset")
            return None
        
        # Process the first CSV file found
        csv_file = csv_files[0]
        print(f"Processing CSV file: {csv_file}")
        
        # Read the CSV file
        df = pd.read_csv(csv_file)
        
        # Convert to inventory events format
        inventory_events = []
        
        # Check if the dataset has the expected columns
        if 'date' in df.columns and 'product_id' in df.columns:
            # Convert to our inventory events format
            for index, row in df.iterrows():
                event = {
                    'eventType': 'IN',  # Default to IN for historical data
                    'productName': f"Product_{row.get('product_id', index)}",
                    'quantity': int(row.get('quantity', 1)),
                    'timestamp': str(row.get('date', '2024-01-01')),
                    'location': 'Warehouse A'
                }
                inventory_events.append(event)
        
        # Save as a new CSV file in the backend resources
        output_path = Path(__file__).parent.parent / "static" / "kaggle_inventory_data.csv"
        output_path.parent.mkdir(exist_ok=True)
        
        # Create a DataFrame and save
        events_df = pd.DataFrame(inventory_events)
        events_df.to_csv(output_path, index=False)
        
        print(f"Converted data saved to: {output_path}")
        
        # Return the path as JSON for Java to read
        result = {
            'success': True,
            'original_path': str(path),
            'converted_path': str(output_path),
            'total_events': len(inventory_events)
        }
        
        print(json.dumps(result))
        return result
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result))
        return error_result

if __name__ == "__main__":
    download_retail_dataset() 