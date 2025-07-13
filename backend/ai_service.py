from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import random
import uvicorn

app = FastAPI(title="Inventory AI Prediction Service")

class InventoryData(BaseModel):
    id: int
    date: str = None
    storeId: str = None
    productId: str = None
    productName: str = None
    category: str = None
    supplier: str = None
    quantity: int = None
    status: str = None
    location: str = None
    inventoryLevel: int = None
    unitsSold: int = None
    unitsOrdered: int = None
    demandForecast: float = None
    price: float = None
    discount: float = None
    weatherCondition: str = None
    holidayOrPromotion: str = None
    competitorPricing: float = None
    seasonality: str = None

class PredictionRequest(BaseModel):
    inventory_data: List[Dict[str, Any]]

class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    status: str
    message: str

@app.get("/")
def read_root():
    return {"message": "Inventory AI Prediction Service is running"}

@app.post("/predict")
def predict_inventory_status(request: PredictionRequest):
    try:
        predictions = []
        
        for item in request.inventory_data:
            # Simulate AI predictions
            inventory_level = item.get('inventoryLevel', 0)
            demand_forecast = item.get('demandForecast', 0)
            
            # Determine stock status
            if inventory_level < demand_forecast * 0.5:
                stock_status = "UNDERSTOCKED"
            elif inventory_level > 100:
                stock_status = "OVERSTOCKED"
            else:
                stock_status = "NORMAL"
            
            # Determine demand increase
            expected_demand_increase = demand_forecast > inventory_level
            
            # Generate recommendation
            if stock_status == "UNDERSTOCKED":
                recommendation = "Increase inventory levels immediately"
            elif stock_status == "OVERSTOCKED":
                recommendation = "Consider promotional activities to reduce inventory"
            elif expected_demand_increase:
                recommendation = "Monitor demand trends and prepare for increased orders"
            else:
                recommendation = "Maintain current inventory levels"
            
            prediction = {
                "productId": item.get('productId'),
                "productName": item.get('productName'),
                "storeId": item.get('storeId'),
                "category": item.get('category'),
                "currentInventory": inventory_level,
                "stockStatus": stock_status,
                "expectedDemandIncrease": expected_demand_increase,
                "demandForecast": demand_forecast,
                "recommendation": recommendation
            }
            
            predictions.append(prediction)
        
        return PredictionResponse(
            predictions=predictions,
            status="success",
            message=f"Generated predictions for {len(predictions)} products"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "inventory-ai-prediction"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 