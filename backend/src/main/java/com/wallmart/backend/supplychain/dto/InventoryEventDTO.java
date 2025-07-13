package com.wallmart.backend.supplychain.dto;
import lombok.Data;

@Data
public class InventoryEventDTO {
    private String date;
    private String storeId;
    private String productId;
    private String category;
    private String region;
    private int inventoryLevel;
    private int unitsSold;
    private int unitsOrdered;
    private int demandForecast;
    private double price;
    private double discount;
    private String weatherCondition;
    private String holidayOrPromotion;
    private double competitorPricing;
    private double seasonality;
}
