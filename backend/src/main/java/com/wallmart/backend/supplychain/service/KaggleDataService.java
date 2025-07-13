package com.wallmart.backend.supplychain.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wallmart.backend.supplychain.entity.InventoryEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class KaggleDataService {
    
    private static final Logger logger = LoggerFactory.getLogger(KaggleDataService.class);
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Autowired
    private InventoryService inventoryService;
    
    @Autowired
    private InventoryCSVParser inventoryCSVParser;
    
    /**
     * Download retail inventory dataset from Kaggle
     * @return Map containing the result of the download operation
     */
    public Map<String, Object> downloadRetailDataset() {
        try {
            // Use the working test script
            String scriptPath = "test_kaggle.py";
            
            // Create process builder to run Python script
            ProcessBuilder processBuilder = new ProcessBuilder("python", scriptPath);
            processBuilder.redirectErrorStream(true);
            
            logger.info("Starting Kaggle dataset download...");
            Process process = processBuilder.start();
            
            // Read the output
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
                logger.info(line);
            }
            
            // Wait for the process to complete
            int exitCode = process.waitFor();
            
            if (exitCode == 0) {
                // Try to parse the JSON result from the last line
                String[] lines = output.toString().split("\n");
                for (int i = lines.length - 1; i >= 0; i--) {
                    String lastLine = lines[i].trim();
                    if (lastLine.startsWith("{") && lastLine.endsWith("}")) {
                        try {
                            @SuppressWarnings("unchecked")
                            Map<String, Object> result = objectMapper.readValue(lastLine, Map.class);
                            logger.info("Kaggle dataset download completed successfully");
                            
                            // Load the data into database
                            loadKaggleDataIntoDatabase();
                            
                            return result;
                        } catch (Exception e) {
                            logger.warn("Could not parse JSON result: " + lastLine);
                        }
                    }
                }
                
                // Fallback response
                return Map.of(
                    "success", true,
                    "message", "Dataset downloaded successfully",
                    "output", output.toString()
                );
            } else {
                logger.error("Python script failed with exit code: " + exitCode);
                return Map.of(
                    "success", false,
                    "error", "Python script failed with exit code: " + exitCode,
                    "output", output.toString()
                );
            }
            
        } catch (IOException | InterruptedException e) {
            logger.error("Error downloading Kaggle dataset", e);
            return Map.of(
                "success", false,
                "error", e.getMessage()
            );
        }
    }
    
    /**
     * Load the downloaded Kaggle data into the database
     */
    public void loadKaggleDataIntoDatabase() {
        try {
            Path dataPath = Paths.get("kaggle_inventory_data.csv");
            if (Files.exists(dataPath)) {
                logger.info("Loading Kaggle data into database...");
                List<InventoryEvent> events = convertKaggleDataToInventoryEvents(dataPath);
                inventoryService.saveAll(events);
                logger.info("Successfully loaded " + events.size() + " events from Kaggle data");
            } else {
                logger.warn("Kaggle data file not found: " + dataPath);
            }
        } catch (Exception e) {
            logger.error("Error loading Kaggle data into database", e);
        }
    }
    
    /**
     * Convert Kaggle data format to InventoryEvent format
     */
    private List<InventoryEvent> convertKaggleDataToInventoryEvents(Path dataPath) throws IOException {
        List<InventoryEvent> events = new ArrayList<>();
        List<String> lines = Files.readAllLines(dataPath);
        
        // Skip header
        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i);
            String[] parts = line.split(",");
            
            if (parts.length >= 5) {
                String eventType = parts[0];
                String productName = parts[1];
                int quantity = Integer.parseInt(parts[2]);
                String timestamp = parts[3];
                String location = parts[4];
                
                // Create InventoryEvent with converted data
                InventoryEvent event = InventoryEvent.builder()
                    .date(timestamp)
                    .storeId("STORE_" + (i % 5 + 1)) // Generate store IDs
                    .productId("PROD_" + (i - 1))
                    .productName(productName)
                    .category("General")
                    .supplier("Supplier_" + (i % 3 + 1))
                    .quantity(quantity)
                    .status(eventType)
                    .location(location)
                    .timestamp(LocalDate.parse(timestamp).atStartOfDay())
                    .inventoryLevel(quantity * 10) // Simulate inventory level
                    .unitsSold(quantity * 2) // Simulate units sold
                    .unitsOrdered(quantity * 3) // Simulate units ordered
                    .demandForecast(quantity * 15.0) // Simulate demand forecast
                    .price(29.99 + (i * 0.5)) // Simulate price
                    .discount(0.0) // No discount
                    .weatherCondition("Sunny")
                    .holidayOrPromotion("None")
                    .competitorPricing(25.0 + (i * 0.3)) // Simulate competitor pricing
                    .seasonality("Summer")
                    .build();
                
                events.add(event);
            }
        }
        
        return events;
    }
    
    /**
     * Check if the downloaded Kaggle data file exists
     * @return true if the file exists, false otherwise
     */
    public boolean isKaggleDataAvailable() {
        try {
            Path dataPath = Paths.get("kaggle_inventory_data.csv");
            return Files.exists(dataPath);
        } catch (Exception e) {
            logger.warn("Could not check Kaggle data availability", e);
            return false;
        }
    }
    
    /**
     * Get the path to the downloaded Kaggle data file
     * @return Path to the data file
     */
    public Path getKaggleDataPath() {
        try {
            return Paths.get("kaggle_inventory_data.csv");
        } catch (Exception e) {
            logger.error("Could not get Kaggle data path", e);
            return null;
        }
    }
} 