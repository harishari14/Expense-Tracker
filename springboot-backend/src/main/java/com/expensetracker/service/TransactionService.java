package com.expensetracker.service;

import com.expensetracker.model.Category;
import com.expensetracker.model.Transaction;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    // Thread-safe in-memory store (Zero Database)
    private final Map<String, Transaction> store = new ConcurrentHashMap<>();
    private final CategoryService categoryService;

    public TransactionService(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    public List<Transaction> getAllTransactions(String type, String categoryId, LocalDate startDate, LocalDate endDate) {
        return store.values().stream()
                .filter(t -> type == null || type.isBlank() || "all".equalsIgnoreCase(type) || t.getType().equalsIgnoreCase(type))
                .filter(t -> categoryId == null || categoryId.isBlank() || "all".equalsIgnoreCase(categoryId) || t.getCategoryId().equals(categoryId))
                .filter(t -> startDate == null || !t.getDate().isBefore(startDate))
                .filter(t -> endDate == null || !t.getDate().isAfter(endDate))
                .sort((a, b) -> b.getDate().compareTo(a.getDate()))
                .collect(Collectors.toList());
    }

    public Optional<Transaction> getTransactionById(String id) {
        return Optional.ofNullable(store.get(id));
    }

    public Transaction createTransaction(Transaction transaction) {
        if (transaction.getId() == null || transaction.getId().isBlank()) {
            transaction.setId("tx-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (transaction.getStatus() == null) {
            transaction.setStatus("cleared");
        }
        if (transaction.getIsRecurring() == null) {
            transaction.setIsRecurring(false);
        }

        // Attach category metadata if available
        if (transaction.getCategoryId() != null) {
            categoryService.getCategoryById(transaction.getCategoryId()).ifPresent(c -> {
                transaction.setCategoryName(c.getName());
                transaction.setCategoryColor(c.getColor());
                transaction.setCategoryIcon(c.getIcon());
            });
        }

        store.put(transaction.getId(), transaction);
        return transaction;
    }

    public Optional<Transaction> updateTransaction(String id, Transaction updated) {
        return Optional.ofNullable(store.computeIfPresent(id, (k, existing) -> {
            existing.setTitle(updated.getTitle());
            existing.setAmount(updated.getAmount());
            existing.setType(updated.getType());
            existing.setDate(updated.getDate());
            existing.setPaymentMethod(updated.getPaymentMethod());
            existing.setNotes(updated.getNotes());
            existing.setIsRecurring(updated.getIsRecurring());
            existing.setStatus(updated.getStatus());

            if (updated.getCategoryId() != null) {
                existing.setCategoryId(updated.getCategoryId());
                categoryService.getCategoryById(updated.getCategoryId()).ifPresent(c -> {
                    existing.setCategoryName(c.getName());
                    existing.setCategoryColor(c.getColor());
                    existing.setCategoryIcon(c.getIcon());
                });
            }
            return existing;
        }));
    }

    public boolean deleteTransaction(String id) {
        return store.remove(id) != null;
    }

    public void resetAll() {
        store.clear();
    }

    public Map<String, Object> getFinancialSummary() {
        BigDecimal totalIncome = store.values().stream()
                .filter(t -> "income".equalsIgnoreCase(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalExpense = store.values().stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .map(Transaction::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal netBalance = totalIncome.subtract(totalExpense);
        BigDecimal savingsRate = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netBalance.divide(totalIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        int elapsedDays = 9;
        BigDecimal burnRatePerDay = totalExpense.divide(BigDecimal.valueOf(elapsedDays), 2, RoundingMode.HALF_UP);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpense", totalExpense);
        summary.put("netBalance", netBalance);
        summary.put("savingsRate", savingsRate.setScale(1, RoundingMode.HALF_UP));
        summary.put("burnRatePerDay", burnRatePerDay);
        summary.put("transactionCount", store.size());
        return summary;
    }
}
