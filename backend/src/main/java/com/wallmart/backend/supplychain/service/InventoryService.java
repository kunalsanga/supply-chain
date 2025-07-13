package com.wallmart.backend.supplychain.service;

import com.wallmart.backend.supplychain.entity.InventoryEvent;
import com.wallmart.backend.supplychain.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class InventoryService {

    private static final Logger logger = LoggerFactory.getLogger(InventoryService.class);
    private static final int BATCH_SIZE = 1000; // Save in batches

    @Autowired
    private InventoryRepository repository;

    public void saveAll(List<InventoryEvent> events) {
        if (events == null || events.isEmpty()) {
            logger.warn("No events to save");
            return;
        }

        logger.info("Starting to save {} events in batches of {}", events.size(), BATCH_SIZE);
        long startTime = System.currentTimeMillis();
        int savedCount = 0;

        try {
            // Process in batches to avoid memory issues
            for (int i = 0; i < events.size(); i += BATCH_SIZE) {
                int endIndex = Math.min(i + BATCH_SIZE, events.size());
                List<InventoryEvent> batch = events.subList(i, endIndex);
                
                repository.saveAll(batch);
                savedCount += batch.size();
                
                // Log progress every 5 batches
                if ((i / BATCH_SIZE) % 5 == 0) {
                    logger.info("Saved {} events... ({}%)", savedCount, (savedCount * 100 / events.size()));
                }
            }
            
            long endTime = System.currentTimeMillis();
            logger.info("Successfully saved {} events in {} ms", savedCount, endTime - startTime);
            
        } catch (Exception e) {
            logger.error("Error saving events: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to save events: " + e.getMessage(), e);
        }
    }

    public List<InventoryEvent> getAllEvents() {
        logger.info("Fetching all inventory events...");
        List<InventoryEvent> events = repository.findAll();
        logger.info("Retrieved {} events", events.size());
        return events;
    }
}
