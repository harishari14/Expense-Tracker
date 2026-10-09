package com.expensetracker.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    private String id;

    @NotBlank(message = "Title is required")
    private String title;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be positive")
    private BigDecimal amount;

    @NotBlank(message = "Type must be 'expense' or 'income'")
    private String type; // 'expense' or 'income'

    private String categoryId;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;

    private String notes;
    private Boolean isRecurring;
    private String status; // 'cleared' or 'pending'
}
