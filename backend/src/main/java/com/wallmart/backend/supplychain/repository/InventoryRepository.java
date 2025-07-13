// ✅ InventoryRepository.java
package com.wallmart.backend.supplychain.repository;

import com.wallmart.backend.supplychain.entity.InventoryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InventoryRepository extends JpaRepository<InventoryEvent, Long> {
}