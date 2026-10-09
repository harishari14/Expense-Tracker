package com.expensetracker.service;

import com.expensetracker.model.Category;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CategoryService {

    private final Map<String, Category> categories = new ConcurrentHashMap<>();

    public CategoryService() {
        initDefaultZeroCategories();
    }

    private void initDefaultZeroCategories() {
        addCat("cat-housing", "Housing & Rent", "Home", "#6366F1", "expense");
        addCat("cat-dining", "Food & Dining", "Utensils", "#EC4899", "expense");
        addCat("cat-tech", "Cloud & Tech", "Cpu", "#06B6D4", "expense");
        addCat("cat-transport", "Transit & Travel", "Car", "#F59E0B", "expense");
        addCat("cat-health", "Health & Wellness", "HeartPulse", "#10B981", "expense");
        addCat("cat-utilities", "Utilities & Power", "Zap", "#8B5CF6", "expense");
        addCat("cat-entertainment", "Entertainment", "Film", "#3B82F6", "expense");
        addCat("cat-shopping", "Apparel & Gear", "ShoppingBag", "#F43F5E", "expense");
        addCat("cat-salary", "Primary Salary", "Briefcase", "#10B981", "income");
        addCat("cat-freelance", "Consulting & Freelance", "Code", "#38BDF8", "income");
        addCat("cat-investments", "Dividends & Yield", "TrendingUp", "#A855F7", "income");
    }

    private void addCat(String id, String name, String icon, String color, String type) {
        categories.put(id, Category.builder()
                .id(id)
                .name(name)
                .icon(icon)
                .color(color)
                .monthlyBudget(BigDecimal.ZERO)
                .type(type)
                .build());
    }

    public List<Category> getAllCategories() {
        return new ArrayList<>(categories.values());
    }

    public Optional<Category> getCategoryById(String id) {
        return Optional.ofNullable(categories.get(id));
    }

    public Optional<Category> updateBudget(String id, BigDecimal newBudget) {
        return Optional.ofNullable(categories.computeIfPresent(id, (k, cat) -> {
            cat.setMonthlyBudget(newBudget != null ? newBudget : BigDecimal.ZERO);
            return cat;
        }));
    }

    public void resetAllBudgets() {
        categories.values().forEach(c -> c.setMonthlyBudget(BigDecimal.ZERO));
    }
}
