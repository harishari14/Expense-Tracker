package com.expensetracker.controller;

import com.expensetracker.service.CategoryService;
import com.expensetracker.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Analytics & Controls", description = "Financial metrics and reset controls")
public class AnalyticsController {

    private final TransactionService transactionService;
    private final CategoryService categoryService;

    @GetMapping("/analytics/summary")
    @Operation(summary = "Get current monthly summary (Income, Expenses, Savings Rate, Burn Rate)")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(transactionService.getFinancialSummary());
    }

    @PostMapping("/reset")
    @Operation(summary = "Reset all transactions and budget caps back to $0.00")
    public ResponseEntity<Map<String, String>> resetAll() {
        transactionService.resetAll();
        categoryService.resetAllBudgets();
        return ResponseEntity.ok(Map.of("message", "All transactions and budgets reset to 0.00"));
    }
}
