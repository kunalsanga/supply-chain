package com.wallmart.backend.supplychain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryPredictionDTO {
    private String productId;
    private String productName;
    private String storeId;
    private String category;
    private Integer currentInventory;
    private String stockStatus; // "UNDERSTOCKED", "OVERSTOCKED", "NORMAL"
    private Boolean expectedDemandIncrease;
    private Double demandForecast;
    private String recommendation;
} 