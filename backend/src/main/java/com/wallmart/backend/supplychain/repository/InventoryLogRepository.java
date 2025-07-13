package com.wallmart.backend.supplychain.repository;

import com.wallmart.backend.supplychain.entity.InventoryLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryLogRepository extends JpaRepository<InventoryLog, Long> {
} 