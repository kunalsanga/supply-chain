// PredictionDTO.java
package com.wallmart.backend.supplychain.dto;

public class PredictionDTO {
    private String productId;
    private String predictedStatus;

    public PredictionDTO(String productId, String predictedStatus) {
        this.productId = productId;
        this.predictedStatus = predictedStatus;
    }

    public String getProductId() {
        return productId;
    }

    public String getPredictedStatus() {
        return predictedStatus;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public void setPredictedStatus(String predictedStatus) {
        this.predictedStatus = predictedStatus;
    }
}
