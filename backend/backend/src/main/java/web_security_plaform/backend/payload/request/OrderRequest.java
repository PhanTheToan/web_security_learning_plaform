package web_security_plaform.backend.payload.request;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class OrderRequest {
    private double shopPrice;

    private double domesticShippingFee;

    private double tax;

    private double convenienceStoreFee;

    private double productPriceJp;

    private double exchangeRate;

    private double serviceFee;

    private double convertedFee;

    private double weight;

    private double initialWeight;

    private double shippingFeeJpVn;

    private double totalPrice;

    private String username;

    private String deliveryAddress;

    private String note;

    private String productNature;

    private String productImage;

    private String productName;

    private String quantitySizePairs;

    private String productUrl;

    private double orderSurcharge;

    private String trackingCode;

    private double weightPrice;

    private double weightFee;

    private double serviceFeePercentage;

    private String vnJpShippingCode;

    private double unitWeightPrice;

    private double unitWeightPriceOut;

    private double inputWeight;

    private double inputExchangeRate;

    private double tempConvertedPrice;

    private double inputServiceFeePercentage;

    private double inputServiceFee;

    private double inputTotalPriceVND;

    private double extraCharge;

    private double profitOrder;

    private double inputSurcharge;

    private LocalDateTime completionDate;

    private double totalPriceInput;

    private LocalDateTime createdAt;

}