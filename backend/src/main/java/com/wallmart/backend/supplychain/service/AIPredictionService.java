package com.wallmart.backend.supplychain.service;

import com.wallmart.backend.supplychain.dto.InventoryPredictionDTO;
import com.wallmart.backend.supplychain.entity.InventoryEvent;
import com.wallmart.backend.supplychain.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIPredictionService {

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    @Value("${ai.service.timeout:5000}")
    private int aiServiceTimeout;

    public List<InventoryPredictionDTO> predictInventoryStatus() {
        try {
            // Fetch all inventory data from database
            List<InventoryEvent> inventoryData = inventoryRepository.findAll();
            
            if (inventoryData.isEmpty()) {
                throw new RuntimeException("No inventory data available for prediction");
            }

            // Try to call AI service with timeout
            try {
                // Prepare data for AI service
                Map<String, Object> requestData = new HashMap<>();
                requestData.put("inventory_data", inventoryData);

                // Set headers
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                // Create request entity
                HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestData, headers);

                // Call AI service with timeout
                ResponseEntity<Map> response = restTemplate.postForEntity(
                    aiServiceUrl + "/predict",
                    request,
                    Map.class
                );

                // Process AI response and convert to DTOs
                return processAIResponse(response.getBody(), inventoryData);

            } catch (RestClientException e) {
                // AI service is not available, use fallback predictions
                System.out.println("AI service not available, using fallback predictions: " + e.getMessage());
                return generateFallbackPredictions(inventoryData);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to get AI predictions: " + e.getMessage(), e);
        }
    }

    public Map<String, Object> getDashboardStats() {
        List<InventoryEvent> inventoryData = inventoryRepository.findAll();
        
        if (inventoryData.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No data available");
            return error;
        }

        // Calculate statistics
        long totalProducts = inventoryData.stream()
            .map(InventoryEvent::getProductId)
            .distinct()
            .count();
            
        long totalStores = inventoryData.stream()
            .map(InventoryEvent::getStoreId)
            .distinct()
            .count();
            
        double avgInventory = inventoryData.stream()
            .mapToDouble(InventoryEvent::getInventoryLevel)
            .average()
            .orElse(0.0);
            
        long lowStockItems = inventoryData.stream()
            .filter(item -> item.getInventoryLevel() < 10)
            .count();
            
        long overstockedItems = inventoryData.stream()
            .filter(item -> item.getInventoryLevel() > 100)
            .count();
            
        double totalValue = inventoryData.stream()
            .mapToDouble(item -> item.getInventoryLevel() * item.getPrice())
            .sum();
            
        double revenueForecast = inventoryData.stream()
            .mapToDouble(item -> item.getDemandForecast() * item.getPrice())
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
        List<InventoryEvent> inventoryData = inventoryRepository.findAll();
        
        if (inventoryData.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No data available");
            return error;
        }

        // Calculate revenue metrics
        double totalRevenue = inventoryData.stream()
            .mapToDouble(item -> item.getInventoryLevel() * item.getPrice())
            .sum();
            
        double forecastedRevenue = inventoryData.stream()
            .mapToDouble(item -> item.getDemandForecast() * item.getPrice())
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
        List<InventoryEvent> inventoryData = inventoryRepository.findAll();
        
        return inventoryData.stream()
            .filter(item -> item.getInventoryLevel() < 10 || item.getInventoryLevel() > 100)
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
        List<InventoryEvent> inventoryData = inventoryRepository.findAll();
        
        if (inventoryData.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("error", "No data available");
            return error;
        }

        // Group by category and calculate metrics
        Map<String, List<InventoryEvent>> categoryGroups = inventoryData.stream()
            .collect(Collectors.groupingBy(InventoryEvent::getCategory));
            
        Map<String, Object> performance = new HashMap<>();
        
        categoryGroups.forEach((category, items) -> {
            double totalValue = items.stream()
                .mapToDouble(item -> item.getInventoryLevel() * item.getPrice())
                .sum();
                
            double avgInventory = items.stream()
                .mapToDouble(InventoryEvent::getInventoryLevel)
                .average()
                .orElse(0.0);
                
            long lowStockCount = items.stream()
                .filter(item -> item.getInventoryLevel() < 10)
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
            optimizationRequest.put("inventory_data", inventoryRepository.findAll());
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

    private List<InventoryPredictionDTO> processAIResponse(Map response, List<InventoryEvent> inventoryData) {
        // This is a simplified implementation
        // In a real scenario, you would parse the AI service response
        // and map it to your DTOs
        
        return inventoryData.stream()
            .map(this::createPredictionDTO)
            .collect(Collectors.toList());
    }

    private List<InventoryPredictionDTO> generateFallbackPredictions(List<InventoryEvent> inventoryData) {
        return inventoryData.stream()
            .map(this::createPredictionDTO)
            .collect(Collectors.toList());
    }

    private InventoryPredictionDTO createPredictionDTO(InventoryEvent inventoryEvent) {
        // Simple logic to determine stock status based on inventory level
        String stockStatus = determineStockStatus(inventoryEvent);
        Boolean expectedDemandIncrease = determineDemandIncrease(inventoryEvent);

        return InventoryPredictionDTO.builder()
            .productId(inventoryEvent.getProductId())
            .productName(inventoryEvent.getProductName())
            .storeId(inventoryEvent.getStoreId())
            .category(inventoryEvent.getCategory())
            .currentInventory(inventoryEvent.getInventoryLevel())
            .stockStatus(stockStatus)
            .expectedDemandIncrease(expectedDemandIncrease)
            .demandForecast(inventoryEvent.getDemandForecast())
            .recommendation(generateRecommendation(stockStatus, expectedDemandIncrease))
            .build();
    }

    private String determineStockStatus(InventoryEvent inventoryEvent) {
        // Simple logic: if inventory is low relative to demand forecast
        if (inventoryEvent.getInventoryLevel() < inventoryEvent.getDemandForecast() * 0.5) {
            return "UNDERSTOCKED";
        } else if (inventoryEvent.getInventoryLevel() > 100) { // Arbitrary threshold
            return "OVERSTOCKED";
        } else {
            return "NORMAL";
        }
    }

    private Boolean determineDemandIncrease(InventoryEvent inventoryEvent) {
        // Simple logic: if demand forecast is higher than current inventory
        return inventoryEvent.getDemandForecast() > inventoryEvent.getInventoryLevel();
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

    private String generateStockAlertRecommendation(String alertType, InventoryEvent item) {
        if ("LOW_STOCK".equals(alertType)) {
            return "Urgent: Reorder " + item.getProductName() + " immediately. Current stock: " + item.getInventoryLevel();
        } else {
            return "Consider promotional activities for " + item.getProductName() + ". Current stock: " + item.getInventoryLevel();
        }
    }
} 