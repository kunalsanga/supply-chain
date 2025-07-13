package com.wallmart.backend.supplychain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String storeId;
    private String productId;
    private String productName;
    private String category;
    private String supplier;
    private Integer quantity;
    private String status;
    private String location;
    private LocalDateTime timestamp;
    private Integer inventoryLevel;
    private Integer unitsSold;
    private Integer unitsOrdered;
    private Double demandForecast;
    private Double price;
    private Double discount;
    private String weatherCondition;
    private String holidayOrPromotion;
    private Double competitorPricing;
    private String seasonality;
} 