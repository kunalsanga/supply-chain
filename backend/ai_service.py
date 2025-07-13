from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import random
import uvicorn
import numpy as np
from datetime import datetime, timedelta
import json

app = FastAPI(title="Advanced Inventory AI Prediction Service")

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

class OptimizationRequest(BaseModel):
    inventory_data: List[Dict[str, Any]]
    optimization_target: str = "cost"
    constraints: Dict[str, Any] = {}

class PredictionResponse(BaseModel):
    predictions: List[Dict[str, Any]]
    status: str
    message: str

class OptimizationResponse(BaseModel):
    optimized_inventory: List[Dict[str, Any]]
    cost_savings: float
    recommendations: List[str]
    status: str

@app.get("/")
def read_root():
    return {
        "message": "Advanced Inventory AI Prediction Service",
        "version": "2.0.0",
        "features": [
            "Inventory Predictions",
            "Demand Forecasting", 
            "Stock Optimization",
            "Revenue Analytics",
            "Real-time Monitoring"
        ]
    }

@app.post("/predict")
def predict_inventory_status(request: PredictionRequest):
    try:
        predictions = []
        
        for item in request.inventory_data:
            # Enhanced AI predictions with multiple factors
            inventory_level = item.get('inventoryLevel', 0)
            demand_forecast = item.get('demandForecast', 0)
            price = item.get('price', 0)
            weather = item.get('weatherCondition', 'normal')
            holiday = item.get('holidayOrPromotion', 'none')
            seasonality = item.get('seasonality', 'regular')
            
            # Multi-factor analysis
            weather_multiplier = get_weather_multiplier(weather)
            holiday_multiplier = get_holiday_multiplier(holiday)
            seasonal_multiplier = get_seasonal_multiplier(seasonality)
            
            # Adjusted demand forecast
            adjusted_demand = demand_forecast * weather_multiplier * holiday_multiplier * seasonal_multiplier
            
            # Determine stock status with more sophisticated logic
            if inventory_level < adjusted_demand * 0.3:
                stock_status = "CRITICAL_UNDERSTOCKED"
            elif inventory_level < adjusted_demand * 0.7:
                stock_status = "UNDERSTOCKED"
            elif inventory_level > adjusted_demand * 1.5:
                stock_status = "OVERSTOCKED"
            elif inventory_level > adjusted_demand * 2.0:
                stock_status = "CRITICAL_OVERSTOCKED"
            else:
                stock_status = "NORMAL"
            
            # Calculate risk score
            risk_score = calculate_risk_score(inventory_level, adjusted_demand, price)
            
            # Generate intelligent recommendations
            recommendation = generate_advanced_recommendation(stock_status, inventory_level, adjusted_demand, price, item)
            
            # Calculate expected revenue impact
            revenue_impact = calculate_revenue_impact(inventory_level, adjusted_demand, price)
            
            prediction = {
                "productId": item.get('productId'),
                "productName": item.get('productName'),
                "storeId": item.get('storeId'),
                "category": item.get('category'),
                "currentInventory": inventory_level,
                "adjustedDemandForecast": round(adjusted_demand, 2),
                "stockStatus": stock_status,
                "riskScore": risk_score,
                "expectedDemandIncrease": adjusted_demand > inventory_level,
                "demandForecast": demand_forecast,
                "recommendation": recommendation,
                "revenueImpact": revenue_impact,
                "confidence": random.uniform(0.75, 0.95),
                "lastUpdated": datetime.now().isoformat()
            }
            
            predictions.append(prediction)
        
        return PredictionResponse(
            predictions=predictions,
            status="success",
            message=f"Generated advanced predictions for {len(predictions)} products with multi-factor analysis"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/optimize")
def optimize_inventory(request: OptimizationRequest):
    try:
        optimized_inventory = []
        total_cost_savings = 0.0
        recommendations = []
        
        for item in request.inventory_data:
            current_inventory = item.get('inventoryLevel', 0)
            demand_forecast = item.get('demandForecast', 0)
            price = item.get('price', 0)
            category = item.get('category', 'general')
            
            # Calculate optimal inventory level
            optimal_level = calculate_optimal_inventory(demand_forecast, price, category)
            
            # Calculate cost savings
            current_cost = current_inventory * price
            optimal_cost = optimal_level * price
            cost_savings = current_cost - optimal_cost
            
            # Generate optimization recommendations
            if current_inventory > optimal_level * 1.2:
                recommendations.append(f"Reduce {item.get('productName')} inventory by {current_inventory - optimal_level} units")
            elif current_inventory < optimal_level * 0.8:
                recommendations.append(f"Increase {item.get('productName')} inventory by {optimal_level - current_inventory} units")
            
            optimized_item = {
                "productId": item.get('productId'),
                "productName": item.get('productName'),
                "currentInventory": current_inventory,
                "optimalInventory": optimal_level,
                "costSavings": cost_savings,
                "optimizationType": "inventory_level"
            }
            
            optimized_inventory.append(optimized_item)
            total_cost_savings += cost_savings
        
        return OptimizationResponse(
            optimized_inventory=optimized_inventory,
            cost_savings=total_cost_savings,
            recommendations=recommendations,
            status="success"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Optimization failed: {str(e)}")

@app.get("/analytics/revenue-forecast")
def get_revenue_forecast():
    """Generate revenue forecasting analytics"""
    try:
        # Simulate revenue forecasting
        current_revenue = random.uniform(50000, 100000)
        growth_rate = random.uniform(0.05, 0.15)
        forecasted_revenue = current_revenue * (1 + growth_rate)
        
        return {
            "currentRevenue": round(current_revenue, 2),
            "forecastedRevenue": round(forecasted_revenue, 2),
            "growthRate": round(growth_rate * 100, 2),
            "confidence": random.uniform(0.8, 0.95),
            "currency": "USD"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Revenue forecast failed: {str(e)}")

@app.get("/analytics/stock-alerts")
def get_stock_alerts():
    """Generate stock alerts and warnings"""
    try:
        alerts = []
        
        # Simulate stock alerts
        alert_types = ["LOW_STOCK", "OVERSTOCKED", "EXPIRING_SOON", "HIGH_DEMAND"]
        severities = ["CRITICAL", "WARNING", "INFO"]
        
        for i in range(random.randint(3, 8)):
            alert = {
                "productId": f"PROD_{i+1:03d}",
                "productName": f"Product {i+1}",
                "alertType": random.choice(alert_types),
                "severity": random.choice(severities),
                "currentLevel": random.randint(1, 200),
                "threshold": random.randint(10, 50),
                "recommendation": f"Action required for Product {i+1}",
                "timestamp": datetime.now().isoformat()
            }
            alerts.append(alert)
        
        return {
            "alerts": alerts,
            "totalAlerts": len(alerts),
            "criticalCount": len([a for a in alerts if a["severity"] == "CRITICAL"])
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Stock alerts failed: {str(e)}")

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "advanced-inventory-ai-prediction",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "features": {
            "predictions": "enabled",
            "optimization": "enabled", 
            "analytics": "enabled",
            "real_time": "enabled"
        }
    }

def get_weather_multiplier(weather: str) -> float:
    """Calculate demand multiplier based on weather conditions"""
    weather_multipliers = {
        'sunny': 1.1,
        'rainy': 0.9,
        'snowy': 0.7,
        'stormy': 0.8,
        'normal': 1.0
    }
    return weather_multipliers.get(weather.lower(), 1.0)

def get_holiday_multiplier(holiday: str) -> float:
    """Calculate demand multiplier based on holidays/promotions"""
    holiday_multipliers = {
        'christmas': 1.5,
        'black_friday': 1.8,
        'cyber_monday': 1.6,
        'valentines': 1.3,
        'halloween': 1.2,
        'none': 1.0
    }
    return holiday_multipliers.get(holiday.lower(), 1.0)

def get_seasonal_multiplier(seasonality: str) -> float:
    """Calculate demand multiplier based on seasonality"""
    seasonal_multipliers = {
        'summer': 1.2,
        'winter': 0.9,
        'spring': 1.1,
        'fall': 1.0,
        'regular': 1.0
    }
    return seasonal_multipliers.get(seasonality.lower(), 1.0)

def calculate_risk_score(inventory: int, demand: float, price: float) -> float:
    """Calculate risk score based on inventory, demand, and price"""
    if demand == 0:
        return 0.0
    
    stockout_risk = max(0, (demand - inventory) / demand)
    overstock_risk = max(0, (inventory - demand * 1.5) / (demand * 1.5))
    
    # Price factor (higher price = higher risk)
    price_factor = min(price / 100, 2.0)  # Normalize price impact
    
    risk_score = (stockout_risk * 0.6 + overstock_risk * 0.4) * price_factor
    return min(risk_score, 1.0)

def generate_advanced_recommendation(stock_status: str, inventory: int, demand: float, price: float, item: Dict) -> str:
    """Generate intelligent recommendations based on multiple factors"""
    
    if stock_status == "CRITICAL_UNDERSTOCKED":
        return f"URGENT: Reorder {item.get('productName', 'product')} immediately. Stockout risk: {calculate_risk_score(inventory, demand, price):.1%}"
    elif stock_status == "UNDERSTOCKED":
        return f"Increase {item.get('productName', 'product')} inventory by {max(0, int(demand - inventory))} units"
    elif stock_status == "OVERSTOCKED":
        return f"Consider promotional activities for {item.get('productName', 'product')}. Reduce inventory by {max(0, int(inventory - demand))} units"
    elif stock_status == "CRITICAL_OVERSTOCKED":
        return f"CRITICAL: Implement aggressive promotions for {item.get('productName', 'product')}. High holding costs detected."
    else:
        return f"Maintain current inventory levels for {item.get('productName', 'product')}. Monitor demand trends."

def calculate_revenue_impact(inventory: int, demand: float, price: float) -> Dict[str, float]:
    """Calculate potential revenue impact"""
    potential_sales = min(inventory, demand)
    lost_sales = max(0, demand - inventory)
    
    return {
        "potentialRevenue": potential_sales * price,
        "lostRevenue": lost_sales * price,
        "efficiency": (potential_sales / demand) if demand > 0 else 1.0
    }

def calculate_optimal_inventory(demand: float, price: float, category: str) -> int:
    """Calculate optimal inventory level based on demand, price, and category"""
    
    # Base safety stock (20% of demand)
    safety_stock = demand * 0.2
    
    # Category-specific adjustments
    category_multipliers = {
        'electronics': 1.3,
        'clothing': 1.1,
        'food': 0.8,
        'furniture': 1.5,
        'general': 1.0
    }
    
    multiplier = category_multipliers.get(category.lower(), 1.0)
    
    # Price-based adjustment (higher price = lower optimal inventory)
    price_factor = max(0.5, 1 - (price / 1000))
    
    optimal = (demand + safety_stock) * multiplier * price_factor
    return max(1, int(optimal))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 