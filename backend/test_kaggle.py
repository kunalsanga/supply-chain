#!/usr/bin/env python3
"""
Simple test script to download Kaggle dataset
"""

import kagglehub
import pandas as pd
import os
import json

def test_kaggle_download():
    try:
        print("Testing KaggleHub download...")
        
        # Download the dataset
        path = kagglehub.dataset_download("anirudhchauhan/retail-store-inventory-forecasting-dataset")
        print(f"Dataset downloaded to: {path}")
        
        # List files in the downloaded directory
        print("Files in downloaded directory:")
        for root, dirs, files in os.walk(path):
            for file in files:
                file_path = os.path.join(root, file)
                print(f"  - {file_path}")
        
        # Try to read the first CSV file
        csv_files = []
        for root, dirs, files in os.walk(path):
            for file in files:
                if file.endswith('.csv'):
                    csv_files.append(os.path.join(root, file))
        
        if csv_files:
            csv_file = csv_files[0]
            print(f"\nReading CSV file: {csv_file}")
            
            # Read the CSV
            df = pd.read_csv(csv_file)
            print(f"CSV shape: {df.shape}")
            print(f"CSV columns: {list(df.columns)}")
            print(f"First few rows:")
            print(df.head())
            
            # Convert to our format
            inventory_events = []
            for index, row in df.head(10).iterrows():  # Just first 10 rows for testing
                event = {
                    'eventType': 'IN',
                    'productName': f"Product_{row.get('product_id', index)}",
                    'quantity': int(row.get('quantity', 1)),
                    'timestamp': str(row.get('date', '2024-01-01')),
                    'location': 'Warehouse A'
                }
                inventory_events.append(event)
            
            # Save as CSV
            output_path = "kaggle_inventory_data.csv"
            events_df = pd.DataFrame(inventory_events)
            events_df.to_csv(output_path, index=False)
            print(f"\nConverted data saved to: {output_path}")
            
            result = {
                'success': True,
                'original_path': str(path),
                'converted_path': output_path,
                'total_events': len(inventory_events),
                'message': 'Dataset downloaded and converted successfully'
            }
            
        else:
            result = {
                'success': False,
                'error': 'No CSV files found in downloaded dataset'
            }
        
        print(json.dumps(result, indent=2))
        return result
        
    except Exception as e:
        error_result = {
            'success': False,
            'error': str(e)
        }
        print(json.dumps(error_result, indent=2))
        return error_result

if __name__ == "__main__":
    test_kaggle_download() 