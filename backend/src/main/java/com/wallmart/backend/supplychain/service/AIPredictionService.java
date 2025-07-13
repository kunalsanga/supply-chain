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

import java.util.*;
import java.util.stream.Collectors;

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

    public Map<String, Object> getDashboardStats() {
        List<InventoryLog> inventoryData = inventoryLogRepository.findAll();
        
        if (inventoryData.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No data available");
            return error;
        }

        // Calculate statistics
        long totalProducts = inventoryData.stream()
            .map(InventoryLog::getProductId)
            .distinct()
            .count();
            
        long totalStores = inventoryData.stream()
            .map(InventoryLog::getStoreId)
            .distinct()
            .count();
            
        double avgInventory = inventoryData.stream()
            .mapToDouble(item -> item.getInventoryLevel() != null ? item.getInventoryLevel() : 0)
            .average()
            .orElse(0.0);
            
        long lowStockItems = inventoryData.stream()
            .filter(item -> item.getInventoryLevel() != null && item.getInventoryLevel() < 10)
            .count();
            
        long overstockedItems = inventoryData.stream()
            .filter(item -> item.getInventoryLevel() != null && item.getInventoryLevel() > 100)
            .count();
            
        double totalValue = inventoryData.stream()
            .mapToDouble(item -> {
                double inventory = item.getInventoryLevel() != null ? item.getInventoryLevel() : 0;
                double price = item.getPrice() != null ? item.getPrice() : 0;
                return inventory * price;
            })
            .sum();
            
        double revenueForecast = inventoryData.stream()
            .mapToDouble(item -> {
                double demand = item.getDemandForecast() != null ? item.getDemandForecast() : 0;
                double price = item.getPrice() != null ? item.getPrice() : 0;
                return demand * price;
            })
            .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalStores", totalStores);
        stats.put("averageInventoryLevel", Math.round(avgInventory));
        stats.put("lowStockItems", lowStockItems);
        stats.put("overstockedItems", overstockedItems);
        stats.put("totalValue", Math.round(totalValue));
        stats.put("revenueForecast", Math.round(revenueForecast));
        stats.put("aiInsights", inventoryData.size());
        return stats;
    }

    public Map<String, Object> getRevenueForecast() {
        List<InventoryLog> inventoryData = inventoryLogRepository.findAll();
        
        if (inventoryData.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No data available");
            return error;
        }

        // Calculate revenue metrics
        double totalRevenue = inventoryData.stream()
            .mapToDouble(item -> {
                double inventory = item.getInventoryLevel() != null ? item.getInventoryLevel() : 0;
                double price = item.getPrice() != null ? item.getPrice() : 0;
                return inventory * price;
            })
            .sum();
            
        double forecastedRevenue = inventoryData.stream()
            .mapToDouble(item -> {
                double demand = item.getDemandForecast() != null ? item.getDemandForecast() : 0;
                double price = item.getPrice() != null ? item.getPrice() : 0;
                return demand * price;
            })
            .sum();
            
        double growthRate = totalRevenue > 0 ? ((forecastedRevenue - totalRevenue) / totalRevenue) * 100 : 0;

        Map<String, Object> result = new HashMap<>();
        result.put("currentRevenue", Math.round(totalRevenue));
        result.put("forecastedRevenue", Math.round(forecastedRevenue));
        result.put("growthRate", Math.round(growthRate * 100.0) / 100.0);
        result.put("currency", "USD");
        return result;
    }

    public List<Map<String, Object>> getStockAlerts() {
        List<InventoryLog> inventoryData = inventoryLogRepository.findAll();
        
        return inventoryData.stream()
            .filter(item -> {
                if (item.getInventoryLevel() == null) return false;
                return item.getInventoryLevel() < 10 || item.getInventoryLevel() > 100;
            })
            .map(item -> {
                String alertType = item.getInventoryLevel() < 10 ? "LOW_STOCK" : "OVERSTOCKED";
                String severity = item.getInventoryLevel() < 5 ? "CRITICAL" : "WARNING";
                
                Map<String, Object> alert = new HashMap<>();
                alert.put("productId", item.getProductId());
                alert.put("productName", item.getProductName());
                alert.put("storeId", item.getStoreId());
                alert.put("currentLevel", item.getInventoryLevel());
                alert.put("alertType", alertType);
                alert.put("severity", severity);
                alert.put("recommendation", generateStockAlertRecommendation(alertType, item));
                return alert;
            })
            .collect(Collectors.toList());
    }

    public Map<String, Object> getCategoryPerformance() {
        List<InventoryLog> inventoryData = inventoryLogRepository.findAll();
        
        if (inventoryData.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No data available");
            return error;
        }

        // Group by category and calculate metrics
        Map<String, List<InventoryLog>> categoryGroups = inventoryData.stream()
            .collect(Collectors.groupingBy(InventoryLog::getCategory));
            
        Map<String, Object> performance = new HashMap<>();
        
        categoryGroups.forEach((category, items) -> {
            double totalValue = items.stream()
                .mapToDouble(item -> {
                    double inventory = item.getInventoryLevel() != null ? item.getInventoryLevel() : 0;
                    double price = item.getPrice() != null ? item.getPrice() : 0;
                    return inventory * price;
                })
                .sum();
                
            double avgInventory = items.stream()
                .mapToDouble(item -> item.getInventoryLevel() != null ? item.getInventoryLevel() : 0)
                .average()
                .orElse(0.0);
                
            long lowStockCount = items.stream()
                .filter(item -> item.getInventoryLevel() != null && item.getInventoryLevel() < 10)
                .count();
                
            Map<String, Object> categoryStats = new HashMap<>();
            categoryStats.put("totalValue", Math.round(totalValue));
            categoryStats.put("averageInventory", Math.round(avgInventory));
            categoryStats.put("lowStockItems", lowStockCount);
            categoryStats.put("itemCount", items.size());
            performance.put(category, categoryStats);
        });

        return performance;
    }

    public Map<String, Object> optimizeInventory(Map<String, Object> request) {
        try {
            // Prepare optimization request for AI service
            Map<String, Object> optimizationRequest = new HashMap<>();
            optimizationRequest.put("inventory_data", inventoryLogRepository.findAll());
            optimizationRequest.put("optimization_target", request.getOrDefault("target", "cost"));
            optimizationRequest.put("constraints", request.getOrDefault("constraints", new HashMap<>()));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> httpRequest = new HttpEntity<>(optimizationRequest, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                aiServiceUrl + "/optimize",
                httpRequest,
                Map.class
            );

            if (response.getBody() != null) {
                return response.getBody();
            } else {
                Map<String, Object> error = new HashMap<>();
                error.put("error", "No response from AI service");
                return error;
            }

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "Optimization failed: " + e.getMessage());
            return error;
        }
    }

    public Map<String, Object> checkAIServiceHealth() {
        try {
            ResponseEntity<Map> response = restTemplate.getForEntity(
                aiServiceUrl + "/health",
                Map.class
            );
            
            Map<String, Object> health = new HashMap<>();
            health.put("status", "healthy");
            health.put("aiServiceUrl", aiServiceUrl);
            health.put("response", response.getBody());
            return health;
        } catch (Exception e) {
            Map<String, Object> health = new HashMap<>();
            health.put("status", "unhealthy");
            health.put("aiServiceUrl", aiServiceUrl);
            health.put("error", e.getMessage());
            return health;
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

    private String generateStockAlertRecommendation(String alertType, InventoryLog item) {
        if ("LOW_STOCK".equals(alertType)) {
            return "Urgent: Reorder " + item.getProductName() + " immediately. Current stock: " + item.getInventoryLevel();
        } else {
            return "Consider promotional activities for " + item.getProductName() + ". Current stock: " + item.getInventoryLevel();
        }
    }
} 