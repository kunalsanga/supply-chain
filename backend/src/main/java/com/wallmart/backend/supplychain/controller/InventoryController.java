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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:3000")
public class InventoryController {

    private static final Logger logger = LoggerFactory.getLogger(InventoryController.class);

    @Autowired
    private InventoryCSVParser inventoryCSVParser;

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private KaggleDataService kaggleDataService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadInventoryCSV(@RequestParam("file") MultipartFile file) {
        long startTime = System.currentTimeMillis();
        
        try {
            logger.info("Starting CSV upload: {} ({} bytes)", file.getOriginalFilename(), file.getSize());
            
            // Check file size (max 50MB)
            if (file.getSize() > 50 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("❌ File too large. Maximum size is 50MB.");
            }
            
            // Check file type
            String fileName = file.getOriginalFilename();
            if (fileName == null || !fileName.toLowerCase().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("❌ Please upload a CSV file.");
            }
            
            InputStream inputStream = file.getInputStream();
            logger.info("Parsing CSV file...");
            
            List<InventoryEvent> events = inventoryCSVParser.parseCSV(inputStream);
            logger.info("Parsed {} events from CSV", events.size());
            
            if (events.isEmpty()) {
                return ResponseEntity.badRequest().body("❌ No valid data found in CSV file.");
            }
            
            logger.info("Saving events to database...");
            inventoryService.saveAll(events);
            
            long endTime = System.currentTimeMillis();
            logger.info("CSV upload completed in {} ms", endTime - startTime);
            
            return ResponseEntity.ok("✅ CSV Uploaded and saved successfully! Processed " + events.size() + " records.");
            
        } catch (Exception e) {
            logger.error("CSV upload failed: {}", e.getMessage(), e);
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

    @PostMapping("/load-kaggle-data")
    public ResponseEntity<Map<String, Object>> loadKaggleDataIntoDatabase() {
        try {
            kaggleDataService.loadKaggleDataIntoDatabase();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Kaggle data loaded into database successfully"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", "Failed to load Kaggle data: " + e.getMessage()
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
