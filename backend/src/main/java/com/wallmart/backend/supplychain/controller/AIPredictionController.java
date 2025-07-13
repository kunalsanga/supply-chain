package com.wallmart.backend.supplychain.controller;

import com.wallmart.backend.supplychain.dto.InventoryPredictionDTO;
import com.wallmart.backend.supplychain.service.AIPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AIPredictionController {

    @Autowired
    private AIPredictionService aiPredictionService;

    @GetMapping("/predict-inventory-status")
    public ResponseEntity<List<InventoryPredictionDTO>> predictInventoryStatus() {
        try {
            List<InventoryPredictionDTO> predictions = aiPredictionService.predictInventoryStatus();
            return ResponseEntity.ok(predictions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/analytics/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        try {
            Map<String, Object> stats = aiPredictionService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/analytics/revenue-forecast")
    public ResponseEntity<Map<String, Object>> getRevenueForecast() {
        try {
            Map<String, Object> forecast = aiPredictionService.getRevenueForecast();
            return ResponseEntity.ok(forecast);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/analytics/stock-alerts")
    public ResponseEntity<List<Map<String, Object>>> getStockAlerts() {
        try {
            List<Map<String, Object>> alerts = aiPredictionService.getStockAlerts();
            return ResponseEntity.ok(alerts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/analytics/category-performance")
    public ResponseEntity<Map<String, Object>> getCategoryPerformance() {
        try {
            Map<String, Object> performance = aiPredictionService.getCategoryPerformance();
            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/predict/optimize-inventory")
    public ResponseEntity<Map<String, Object>> optimizeInventory(@RequestBody Map<String, Object> request) {
        try {
            Map<String, Object> optimization = aiPredictionService.optimizeInventory(request);
            return ResponseEntity.ok(optimization);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/health/ai-service")
    public ResponseEntity<Map<String, Object>> checkAIServiceHealth() {
        try {
            Map<String, Object> health = aiPredictionService.checkAIServiceHealth();
            return ResponseEntity.ok(health);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
} 