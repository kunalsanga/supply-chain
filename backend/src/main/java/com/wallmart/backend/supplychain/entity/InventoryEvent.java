package com.wallmart.backend.supplychain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InventoryEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date; // Original date string (optional)
    private String storeId;
    private String productId;

    @Column(nullable = false)
    private String productName;

    private String category;
    private String supplier; // Assuming supplier is same as store or source
    private int quantity;    // Inventory quantity or total units?
    private String status;   // e.g., "NEW", "PROCESSED"
    private String location; // Maps to Region from CSV
    private LocalDateTime timestamp;

    private int inventoryLevel;
    private int unitsSold;
    private int unitsOrdered;

    private double demandForecast;
    private double price;
    private double discount;

    private String weatherCondition;
    private String holidayOrPromotion;
    private double competitorPricing;
    private String seasonality;
}
