package com.expensetracker.controller;

import com.expensetracker.model.Transaction;
import com.expensetracker.service.TransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Operations for expenses and incomes (In-Memory Spring Boot)")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Get all transactions or filter by type/category/date")
    public ResponseEntity<List<Transaction>> getTransactions(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String categoryId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getAllTransactions(type, categoryId, startDate, endDate));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction details by ID")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable String id) {
        return transactionService.getTransactionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Record a new expense or income transaction")
    public ResponseEntity<Transaction> createTransaction(@Valid @RequestBody Transaction transaction) {
        Transaction created = transactionService.createTransaction(transaction);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing transaction")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable String id,
            @Valid @RequestBody Transaction transaction) {
        return transactionService.updateTransaction(id, transaction)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction by ID")
    public ResponseEntity<Void> deleteTransaction(@PathVariable String id) {
        if (transactionService.deleteTransaction(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
