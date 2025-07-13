package com.wallmart.backend.supplychain.service;

import com.wallmart.backend.supplychain.dto.InventoryPredictionDTO;
import com.wallmart.backend.supplychain.entity.InventoryLog;
import com.wallmart.backend.supplychain.repository.InventoryLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AIPredictionService {

    @Autowired
    private InventoryLogRepository inventoryLogRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public List<InventoryPredictionDTO> predictInventoryStatus() {
        try {
            // Fetch all inventory data from database
            List<InventoryLog> inventoryData = inventoryLogRepository.findAll();
            
            if (inventoryData.isEmpty()) {
                throw new RuntimeException("No inventory data available for prediction");
            }

            // Prepare data for AI service
            Map<String, Object> requestData = Map.of(
                "inventory_data", inventoryData
            );

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Create request entity
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestData, headers);

            // Call AI service
            ResponseEntity<Map> response = restTemplate.postForEntity(
                aiServiceUrl + "/predict",
                request,
                Map.class
            );

            // Process AI response and convert to DTOs
            return processAIResponse(response.getBody(), inventoryData);

        } catch (Exception e) {
            throw new RuntimeException("Failed to get AI predictions: " + e.getMessage(), e);
        }
    }

    private List<InventoryPredictionDTO> processAIResponse(Map response, List<InventoryLog> inventoryData) {
        // This is a simplified implementation
        // In a real scenario, you would parse the AI service response
        // and map it to your DTOs
        
        return inventoryData.stream()
            .map(this::createPredictionDTO)
            .toList();
    }

    private InventoryPredictionDTO createPredictionDTO(InventoryLog inventoryLog) {
        // Simple logic to determine stock status based on inventory level
        String stockStatus = determineStockStatus(inventoryLog);
        Boolean expectedDemandIncrease = determineDemandIncrease(inventoryLog);

        return InventoryPredictionDTO.builder()
            .productId(inventoryLog.getProductId())
            .productName(inventoryLog.getProductName())
            .storeId(inventoryLog.getStoreId())
            .category(inventoryLog.getCategory())
            .currentInventory(inventoryLog.getInventoryLevel())
            .stockStatus(stockStatus)
            .expectedDemandIncrease(expectedDemandIncrease)
            .demandForecast(inventoryLog.getDemandForecast())
            .recommendation(generateRecommendation(stockStatus, expectedDemandIncrease))
            .build();
    }

    private String determineStockStatus(InventoryLog inventoryLog) {
        if (inventoryLog.getInventoryLevel() == null) {
            return "NORMAL";
        }
        
        // Simple logic: if inventory is low relative to demand forecast
        if (inventoryLog.getDemandForecast() != null && inventoryLog.getInventoryLevel() < inventoryLog.getDemandForecast() * 0.5) {
            return "UNDERSTOCKED";
        } else if (inventoryLog.getInventoryLevel() > 100) { // Arbitrary threshold
            return "OVERSTOCKED";
        } else {
            return "NORMAL";
        }
    }

    private Boolean determineDemandIncrease(InventoryLog inventoryLog) {
        // Simple logic: if demand forecast is higher than current inventory
        if (inventoryLog.getDemandForecast() != null && inventoryLog.getInventoryLevel() != null) {
            return inventoryLog.getDemandForecast() > inventoryLog.getInventoryLevel();
        }
        return false;
    }

    private String generateRecommendation(String stockStatus, Boolean expectedDemandIncrease) {
        if ("UNDERSTOCKED".equals(stockStatus)) {
            return "Increase inventory levels immediately";
        } else if ("OVERSTOCKED".equals(stockStatus)) {
            return "Consider promotional activities to reduce inventory";
        } else if (expectedDemandIncrease) {
            return "Monitor demand trends and prepare for increased orders";
        } else {
            return "Maintain current inventory levels";
        }
    }
} 