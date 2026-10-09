package com.expensetracker.controller;

import com.expensetracker.model.Category;
import com.expensetracker.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category and Budget Cap Management")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories and their current budget allocations")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PutMapping("/{id}/budget")
    @Operation(summary = "Update budget limit for a category")
    public ResponseEntity<Category> updateBudget(
            @PathVariable String id,
            @RequestBody Map<String, BigDecimal> payload) {
        BigDecimal monthlyBudget = payload.get("monthlyBudget");
        return categoryService.updateBudget(id, monthlyBudget)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
