package com.wallmart.backend.supplychain.service;

import com.wallmart.backend.supplychain.entity.InventoryEvent;
import com.wallmart.backend.supplychain.repository.InventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    @Autowired
    private InventoryRepository repository;

    public void saveAll(List<InventoryEvent> events) {
        repository.saveAll(events);
    }

    public List<InventoryEvent> getAllEvents() {
        return repository.findAll();
    }
}
