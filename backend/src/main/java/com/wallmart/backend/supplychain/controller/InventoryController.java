package com.wallmart.backend.supplychain.controller;

import com.wallmart.backend.supplychain.dto.PredictionDTO;
import com.wallmart.backend.supplychain.entity.InventoryEvent;
import com.wallmart.backend.supplychain.service.InventoryCSVParser;
import com.wallmart.backend.supplychain.service.InventoryService;
import com.wallmart.backend.supplychain.service.KaggleDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    @Autowired
    private InventoryCSVParser inventoryCSVParser;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private KaggleDataService kaggleDataService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadInventoryCSV(@RequestParam("file") MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            List<InventoryEvent> events = inventoryCSVParser.parseCSV(inputStream);
            inventoryService.saveAll(events);
            return ResponseEntity.ok("✅ CSV Uploaded and saved successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("❌ Upload failed: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public List<InventoryEvent> getAllEvents() {
        return inventoryService.getAllEvents();
    }

    @GetMapping("/events")
    public List<InventoryEvent> getInventoryEvents() {
        return inventoryService.getAllEvents();
    }

    @PostMapping("/download-kaggle")
    public ResponseEntity<Map<String, Object>> downloadKaggleDataset() {
        try {
            Map<String, Object> result = kaggleDataService.downloadRetailDataset();
            if ((Boolean) result.get("success")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Failed to download Kaggle dataset: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/kaggle-status")
    public ResponseEntity<Map<String, Object>> getKaggleStatus() {
        boolean isAvailable = kaggleDataService.isKaggleDataAvailable();
        return ResponseEntity.ok(Map.of(
            "available", isAvailable,
            "message", isAvailable ? "Kaggle data is available" : "Kaggle data not downloaded yet"
        ));
    }

    @GetMapping("/predictions")
    public ResponseEntity<List<PredictionDTO>> getPredictions() {
        // Dummy logic — replace later with real prediction logic
        List<PredictionDTO> predictions = List.of(
                new PredictionDTO("P001", "Overstocked"),
                new PredictionDTO("P002", "Understocked"),
                new PredictionDTO("P003", "Stable")
        );
        return ResponseEntity.ok(predictions);
    }
}
