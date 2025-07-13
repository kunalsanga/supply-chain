package com.wallmart.backend.supplychain.service;

import com.opencsv.CSVReader;
import com.wallmart.backend.supplychain.entity.InventoryEvent;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class InventoryCSVParser {

    public List<InventoryEvent> parseCSV(InputStream inputStream) {
        List<InventoryEvent> eventList = new ArrayList<>();

        try (CSVReader reader = new CSVReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8))) {
            String[] nextLine;
            boolean firstLine = true;

            while ((nextLine = reader.readNext()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }

                if (nextLine.length < 15) {
                    throw new RuntimeException("Invalid CSV row: " + Arrays.toString(nextLine));
                }

                InventoryEvent event = new InventoryEvent();

                event.setDate(nextLine[0]);
                event.setStoreId(nextLine[1]);
                event.setProductId(nextLine[2]);
                event.setCategory(nextLine[3]);
                event.setLocation(nextLine[4]); // region
                event.setInventoryLevel(Integer.parseInt(nextLine[5]));
                event.setUnitsSold(Integer.parseInt(nextLine[6]));
                event.setUnitsOrdered(Integer.parseInt(nextLine[7]));
                event.setDemandForecast(Double.parseDouble(nextLine[8]));
                event.setPrice(Double.parseDouble(nextLine[9]));
                event.setDiscount(Double.parseDouble(nextLine[10]));
                event.setWeatherCondition(nextLine[11]);
                event.setHolidayOrPromotion(nextLine[12]);
                event.setCompetitorPricing(Double.parseDouble(nextLine[13]));
                event.setSeasonality(nextLine[14]);

                // Defaults for non-CSV columns
                event.setProductName("Unnamed Product");
                event.setSupplier("Unknown Supplier");
                event.setQuantity(0);
                event.setStatus("NEW");
                event.setTimestamp(LocalDate.parse(nextLine[0]).atStartOfDay());

                eventList.add(event);
            }

        } catch (Exception e) {
            throw new RuntimeException("❌ Failed to parse CSV file: " + e.getMessage(), e);
        }

        return eventList;
    }
}
