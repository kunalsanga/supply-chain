package com.wallmart.backend.supplychain.controller;

import com.wallmart.backend.supplychain.dto.InventoryPredictionDTO;
import com.wallmart.backend.supplychain.service.AIPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
} 