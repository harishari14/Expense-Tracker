export interface ProjectFile {
  path: string;
  filename: string;
  language: string;
  description: string;
  content: string;
}

export const SPRING_BOOT_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'pom.xml',
    filename: 'pom.xml',
    language: 'xml',
    description: 'Maven Project Object Model with Spring Boot 3.3.4, Java 21, PostgreSQL & JPA',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>
    <groupId>com.expensetracker</groupId>
    <artifactId>expense-tracker-api</artifactId>
    <version>1.0.0</version>
    <name>Expense Tracker Spring Boot API</name>
    <description>2026 Production-Grade Expense Tracker REST API with PostgreSQL on Render</description>
    
    <properties>
        <java.version>21</java.version>
        <springdoc.version>2.6.0</springdoc.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starter Web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- PostgreSQL JDBC Driver for Render Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- Actuator for Health checks & Monitoring on Render -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

        <!-- OpenAPI / Swagger 3 UI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>\${springdoc.version}</version>
        </dependency>

        <!-- Lombok for Boilerplate reduction -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- Spring Boot Starter Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    path: 'src/main/resources/application.properties',
    filename: 'application.properties',
    language: 'properties',
    description: 'Spring Boot Configuration optimized for Render Free PostgreSQL (SSL & Pooling)',
    content: `# ==============================================================================
# 2026 Production Configuration: Java Spring Boot + Render PostgreSQL
# ==============================================================================
spring.application.name=expense-tracker-api
server.port=\${PORT:8080}

# Database Connection (Render PostgreSQL Free Tier)
# Note: DatabaseUrlPostProcessor automatically transforms Render's DATABASE_URL if present!
spring.datasource.url=\${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/expensedb}
spring.datasource.username=\${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=\${SPRING_DATASOURCE_PASSWORD:postgres}
spring.datasource.driver-class-name=org.postgresql.Driver

# HikariCP Connection Pool (Tuned for Render Free Tier limits)
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=2
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.max-lifetime=600000
spring.datasource.hikari.connection-timeout=20000

# JPA & Hibernate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# Health & Metrics (for Render health check probes)
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always

# Swagger / OpenAPI documentation
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html

# CORS Allowed Origins
app.cors.allowed-origins=\${CORS_ALLOWED_ORIGINS:http://localhost:3000,http://localhost:5173,https://*.run.app,https://*.onrender.com}`
  },
  {
    path: 'src/main/resources/schema.sql',
    filename: 'schema.sql',
    language: 'sql',
    description: 'PostgreSQL DDL schema and initial seed data for Render PostgreSQL instance',
    content: `-- ==============================================================================
-- Render PostgreSQL Schema DDL: AetherSpend Expense Tracker
-- ==============================================================================

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) NOT NULL,
    color VARCHAR(20) NOT NULL,
    monthly_budget NUMERIC(12, 2) DEFAULT 0.00,
    type VARCHAR(20) NOT NULL -- 'expense' OR 'income'
);

CREATE TABLE IF NOT EXISTS transactions (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'expense' OR 'income'
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    notes TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'cleared',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS budgets (
    id VARCHAR(50) PRIMARY KEY,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE CASCADE,
    monthly_limit NUMERIC(12, 2) NOT NULL,
    month VARCHAR(7) NOT NULL, -- YYYY-MM
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recurring_bills (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    category_id VARCHAR(50) REFERENCES categories(id) ON DELETE SET NULL,
    frequency VARCHAR(20) NOT NULL, -- Monthly, Yearly, Weekly
    next_due_date DATE NOT NULL,
    auto_pay BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optimized Performance Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category_id);

-- Initial Category Seeds
INSERT INTO categories (id, name, icon, color, monthly_budget, type) VALUES
('cat-housing', 'Housing & Rent', 'Home', '#6366F1', 1850.00, 'expense'),
('cat-dining', 'Food & Dining', 'Utensils', '#EC4899', 650.00, 'expense'),
('cat-tech', 'Cloud & Tech', 'Cpu', '#06B6D4', 320.00, 'expense'),
('cat-transport', 'Transit & Travel', 'Car', '#F59E0B', 280.00, 'expense'),
('cat-health', 'Health & Wellness', 'HeartPulse', '#10B981', 220.00, 'expense'),
('cat-utilities', 'Utilities & Power', 'Zap', '#8B5CF6', 190.00, 'expense'),
('cat-entertainment', 'Entertainment', 'Film', '#3B82F6', 150.00, 'expense'),
('cat-shopping', 'Apparel & Gear', 'ShoppingBag', '#F43F5E', 200.00, 'expense'),
('cat-salary', 'Primary Salary', 'Briefcase', '#10B981', 0.00, 'income'),
('cat-freelance', 'Consulting & APIs', 'Code', '#38BDF8', 0.00, 'income'),
('cat-investments', 'Dividends & Yield', 'TrendingUp', '#A855F7', 0.00, 'income')
ON CONFLICT (id) DO NOTHING;`
  },
  {
    path: 'src/main/java/com/expensetracker/ExpenseTrackerApplication.java',
    filename: 'ExpenseTrackerApplication.java',
    language: 'java',
    description: 'Spring Boot Main Application Entrypoint',
    content: `package com.expensetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExpenseTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpenseTrackerApplication.class, args);
    }
}`
  },
  {
    path: 'src/main/java/com/expensetracker/config/DatabaseUrlPostProcessor.java',
    filename: 'DatabaseUrlPostProcessor.java',
    language: 'java',
    description: 'Render DATABASE_URL Parser: auto-converts postgres:// into jdbc:postgresql:// with SSL',
    content: `package com.expensetracker.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Automatically converts Render.com's environment variable:
 * DATABASE_URL = postgres://user:password@hostname:5432/dbname
 * into Spring Boot compatible JDBC properties:
 * spring.datasource.url = jdbc:postgresql://hostname:5432/dbname?sslmode=require
 */
public class DatabaseUrlPostProcessor implements EnvironmentPostProcessor {

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl != null && (databaseUrl.startsWith("postgres://") || databaseUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(databaseUrl);
                String[] userInfo = uri.getUserInfo() != null ? uri.getUserInfo().split(":") : new String[]{"", ""};
                String username = userInfo[0];
                String password = userInfo.length > 1 ? userInfo[1] : "";
                
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath(); // includes leading slash e.g. /expense_db
                
                String jdbcUrl = String.format("jdbc:postgresql://%s:%d%s?sslmode=require", host, port, path);

                Map<String, Object> props = new HashMap<>();
                props.put("spring.datasource.url", jdbcUrl);
                props.put("spring.datasource.username", username);
                props.put("spring.datasource.password", password);

                environment.getPropertySources().addFirst(new MapPropertySource("renderDatabaseProperties", props));
                System.out.println(">>> Successfully wired Render PostgreSQL connection from DATABASE_URL");
            } catch (Exception e) {
                System.err.println("Could not parse Render DATABASE_URL: " + e.getMessage());
            }
        }
    }
}`
  },
  {
    path: 'src/main/java/com/expensetracker/config/CorsConfig.java',
    filename: 'CorsConfig.java',
    language: 'java',
    description: 'CORS Configuration allowing web clients, AI Studio preview, and Render clients',
    content: `package com.expensetracker.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}`
  },
  {
    path: 'src/main/java/com/expensetracker/config/OpenApiConfig.java',
    filename: 'OpenApiConfig.java',
    language: 'java',
    description: 'Swagger OpenAPI 3.0 Documentation Specification',
    content: `package com.expensetracker.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Value("\${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI expenseTrackerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AetherSpend - Expense Tracker REST API")
                        .description("2026 Production REST API built with Java Spring Boot 3.3 and PostgreSQL on Render")
                        .version("1.0.0")
                        .contact(new Contact().name("Engineering Team").email("api@expensetracker.internal")))
                .servers(List.of(
                        new Server().url("/").description("Current Server (Render / Local)"),
                        new Server().url("http://localhost:" + serverPort).description("Local Development")
                ));
    }
}`
  },
  {
    path: 'src/main/java/com/expensetracker/model/Transaction.java',
    filename: 'Transaction.java',
    language: 'java',
    description: 'JPA Entity representing Financial Transactions (Expenses & Incomes)',
    content: `package com.expensetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @Column(length = 50)
    private String id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @NotBlank(message = "Transaction type must be 'expense' or 'income'")
    @Column(nullable = false, length = 20)
    private String type; // 'expense' or 'income'

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Payment method is required")
    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_recurring")
    private Boolean isRecurring;

    @Column(length = 20)
    private String status; // 'cleared' or 'pending'

    @Column(name = "created_at")
    private OffsetDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = OffsetDateTime.now();
        }
        if (this.status == null) {
            this.status = "cleared";
        }
        if (this.isRecurring == null) {
            this.isRecurring = false;
        }
    }
}`
  },
  {
    path: 'src/main/java/com/expensetracker/model/Category.java',
    filename: 'Category.java',
    language: 'java',
    description: 'JPA Entity for Expense & Income Categories',
    content: `package com.expensetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @Column(length = 50)
    private String id;

    @NotBlank(message = "Category name is required")
    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String icon;

    @Column(nullable = false, length = 20)
    private String color;

    @Column(name = "monthly_budget", precision = 12, scale = 2)
    private BigDecimal monthlyBudget;

    @NotBlank(message = "Category type is required")
    @Column(nullable = false, length = 20)
    private String type; // 'expense' or 'income'
}`
  },
  {
    path: 'src/main/java/com/expensetracker/model/Budget.java',
    filename: 'Budget.java',
    language: 'java',
    description: 'JPA Entity for Monthly Category Budgets',
    content: `package com.expensetracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "budgets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {

    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    @NotNull
    @Column(name = "monthly_limit", precision = 12, scale = 2, nullable = false)
    private BigDecimal monthlyLimit;

    @Column(nullable = false, length = 7)
    private String month; // YYYY-MM
}`
  },
  {
    path: 'src/main/java/com/expensetracker/repository/TransactionRepository.java',
    filename: 'TransactionRepository.java',
    language: 'java',
    description: 'Spring Data JPA Repository with high-performance financial aggregation queries',
    content: `package com.expensetracker.repository;

import com.expensetracker.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {

    List<Transaction> findByDateBetweenOrderByDateDesc(LocalDate startDate, LocalDate endDate);

    List<Transaction> findByTypeOrderByDateDesc(String type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t WHERE t.type = :type AND t.date BETWEEN :start AND :end")
    BigDecimal sumAmountByTypeAndDateRange(@Param("type") String type, 
                                           @Param("start") LocalDate start, 
                                           @Param("end") LocalDate end);

    @Query("SELECT t.category.name, SUM(t.amount) FROM Transaction t " +
           "WHERE t.type = 'expense' AND t.date BETWEEN :start AND :end " +
           "GROUP BY t.category.name")
    List<Object[]> sumExpensesByCategoryAndDateRange(@Param("start") LocalDate start, 
                                                     @Param("end") LocalDate end);
}`
  },
  {
    path: 'src/main/java/com/expensetracker/repository/CategoryRepository.java',
    filename: 'CategoryRepository.java',
    language: 'java',
    description: 'Spring Data JPA Repository for Categories',
    content: `package com.expensetracker.repository;

import com.expensetracker.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {
    List<Category> findByType(String type);
}`
  },
  {
    path: 'src/main/java/com/expensetracker/service/TransactionService.java',
    filename: 'TransactionService.java',
    language: 'java',
    description: 'Business Service handling Transaction CRUD and validations',
    content: `package com.expensetracker.service;

import com.expensetracker.model.Category;
import com.expensetracker.model.Transaction;
import com.expensetracker.repository.CategoryRepository;
import com.expensetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Transaction getTransactionById(String id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found with ID: " + id));
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction, String categoryId) {
        if (transaction.getId() == null || transaction.getId().isBlank()) {
            transaction.setId("tx-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + categoryId));
            transaction.setCategory(category);
        }
        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction updateTransaction(String id, Transaction updated, String categoryId) {
        Transaction existing = getTransactionById(id);
        existing.setTitle(updated.getTitle());
        existing.setAmount(updated.getAmount());
        existing.setType(updated.getType());
        existing.setDate(updated.getDate());
        existing.setPaymentMethod(updated.getPaymentMethod());
        existing.setNotes(updated.getNotes());
        existing.setIsRecurring(updated.getIsRecurring());
        existing.setStatus(updated.getStatus());

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + categoryId));
            existing.setCategory(category);
        }

        return transactionRepository.save(existing);
    }

    @Transactional
    public void deleteTransaction(String id) {
        transactionRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsInDateRange(LocalDate start, LocalDate end) {
        return transactionRepository.findByDateBetweenOrderByDateDesc(start, end);
    }
}`
  },
  {
    path: 'src/main/java/com/expensetracker/controller/TransactionController.java',
    filename: 'TransactionController.java',
    language: 'java',
    description: 'REST Controller for Transaction operations (/api/transactions)',
    content: `package com.expensetracker.controller;

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
@Tag(name = "Transactions", description = "Operations for expenses and incomes")
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    @Operation(summary = "Get all transactions or filter by date range")
    public ResponseEntity<List<Transaction>> getTransactions(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        if (startDate != null && endDate != null) {
            return ResponseEntity.ok(transactionService.getTransactionsInDateRange(startDate, endDate));
        }
        return ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get transaction details by ID")
    public ResponseEntity<Transaction> getTransactionById(@PathVariable String id) {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @PostMapping
    @Operation(summary = "Create a new expense or income transaction")
    public ResponseEntity<Transaction> createTransaction(
            @Valid @RequestBody Transaction transaction,
            @RequestParam(required = false) String categoryId) {
        Transaction created = transactionService.createTransaction(transaction, categoryId);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing transaction")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable String id,
            @Valid @RequestBody Transaction transaction,
            @RequestParam(required = false) String categoryId) {
        Transaction updated = transactionService.updateTransaction(id, transaction, categoryId);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete transaction by ID")
    public ResponseEntity<Void> deleteTransaction(@PathVariable String id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }
}`
  },
  {
    path: 'src/main/java/com/expensetracker/controller/AnalyticsController.java',
    filename: 'AnalyticsController.java',
    language: 'java',
    description: 'REST Controller for Financial Analytics, Burn Rate, and Cash Flow (/api/analytics)',
    content: `package com.expensetracker.controller;

import com.expensetracker.repository.TransactionRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics", description = "Financial metrics, burn rate, and projections")
public class AnalyticsController {

    private final TransactionRepository transactionRepository;

    @GetMapping("/summary")
    @Operation(summary = "Get current monthly summary (Total Income, Expenses, Savings Rate, Burn Rate)")
    public ResponseEntity<Map<String, Object>> getMonthlySummary() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth());

        BigDecimal totalIncome = transactionRepository.sumAmountByTypeAndDateRange("income", startOfMonth, endOfMonth);
        BigDecimal totalExpenses = transactionRepository.sumAmountByTypeAndDateRange("expense", startOfMonth, endOfMonth);

        BigDecimal netSavings = totalIncome.subtract(totalExpenses);

        BigDecimal savingsRate = BigDecimal.ZERO;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netSavings.divide(totalIncome, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }

        int dayOfMonth = Math.max(1, now.getDayOfMonth());
        BigDecimal burnRatePerDay = totalExpenses.divide(BigDecimal.valueOf(dayOfMonth), 2, RoundingMode.HALF_UP);
        BigDecimal projectedMonthEnd = burnRatePerDay.multiply(BigDecimal.valueOf(now.lengthOfMonth()));

        Map<String, Object> summary = new HashMap<>();
        summary.put("month", now.getYear() + "-" + String.format("%02d", now.getMonthValue()));
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("netSavings", netSavings);
        summary.put("savingsRate", savingsRate.setScale(1, RoundingMode.HALF_UP));
        summary.put("burnRatePerDay", burnRatePerDay);
        summary.put("projectedMonthEnd", projectedMonthEnd);

        return ResponseEntity.ok(summary);
    }
}`
  },
  {
    path: 'Dockerfile',
    filename: 'Dockerfile',
    language: 'dockerfile',
    description: 'Multi-stage Dockerfile optimized for Render Web Service deployment',
    content: `# Multi-stage Build for Render Web Service (Spring Boot 3 + Java 21)
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests

# Minimal Production Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]`
  },
  {
    path: 'render.yaml',
    filename: 'render.yaml',
    language: 'yaml',
    description: '1-Click Render Blueprint: Free PostgreSQL DB + Java Spring Boot Service',
    content: `services:
  # 1. Spring Boot Web Service
  - type: web
    name: aetherspend-spring-boot
    runtime: docker
    plan: free
    region: oregon
    dockerfilePath: Dockerfile
    envVars:
      - key: PORT
        value: 8080
      - key: DATABASE_URL
        fromDatabase:
          name: aetherspend-postgres
          property: connectionString
      - key: CORS_ALLOWED_ORIGINS
        value: "*"

databases:
  # 2. Render Free Tier PostgreSQL Database
  - name: aetherspend-postgres
    plan: free
    region: oregon
    databaseName: expensedb
    user: expense_user`
  },
  {
    path: 'README.md',
    filename: 'README.md',
    language: 'markdown',
    description: 'Complete Step-by-Step Render PostgreSQL & Spring Boot Setup Guide',
    content: `# AetherSpend - Spring Boot 3 & Render PostgreSQL Backend

A high-performance Java Spring Boot 3.3 REST API with PostgreSQL on Render's free tier.

## 🚀 Features
- **Java 21 & Spring Boot 3.3.4**
- **Spring Data JPA & Hibernate**
- **PostgreSQL on Render** (with automatic SSL mode and connection pool tuning)
- **Automatic \`DATABASE_URL\` Parser**: converts Render's default \`postgres://\` url to JDBC seamlessly
- **Swagger / OpenAPI 3**: interactive API test sandbox at \`/swagger-ui.html\`
- **Pre-configured Dockerfile and render.yaml blueprint**

---

## 🛠️ Step 1: Create Free PostgreSQL Database on Render
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **PostgreSQL**.
3. Fill in details:
   - **Name**: \`aetherspend-postgres\`
   - **Database**: \`expensedb\`
   - **User**: \`expense_user\`
   - **Plan**: **Free**
4. Click **Create Database**.
5. Once created, copy the **Internal Database URL** (if deploying on Render) or **External Database URL** (for local testing).

---

## 💻 Step 2: Running Locally
Set the \`DATABASE_URL\` environment variable and run:

\`\`\`bash
# With Render PostgreSQL External URL:
export DATABASE_URL="postgres://expense_user:yourPassword@dpg-xxxx.oregon-postgres.render.com/expensedb"

# Run Spring Boot:
mvn spring-boot:run
\`\`\`

Open your browser to:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **API Health**: [http://localhost:8080/actuator/health](http://localhost:8080/actuator/health)
- **Transactions API**: [http://localhost:8080/api/transactions](http://localhost:8080/api/transactions)

---

## 🌐 Step 3: Deploy to Render Free Web Service
### Option A: Using Render Blueprint (Easiest)
1. Push this project to your GitHub repository.
2. In Render, select **New +** -> **Blueprint**.
3. Connect your repository. Render will automatically detect \`render.yaml\` and provision both PostgreSQL and the Spring Boot Docker container.

### Option B: Manual Web Service
1. In Render, select **New +** -> **Web Service**.
2. Connect your repository and select **Docker** as environment.
3. Under Environment Variables, add:
   - \`DATABASE_URL\` = (your Render Postgres connection string)
   - \`PORT\` = \`8080\`
4. Deploy!
`
  }
];
