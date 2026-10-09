package com.expensetracker.model;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    private String id;

    @NotBlank(message = "Category name is required")
    private String name;

    private String icon;
    private String color;
    private BigDecimal monthlyBudget;
    private String type; // 'expense' or 'income'
}
