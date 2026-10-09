package com.expensetracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExpenseTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ExpenseTrackerApplication.class, args);
        System.out.println("=================================================");
        System.out.println(">>> Expense Tracker Spring Boot Backend Started!");
        System.out.println(">>> Architecture: In-Memory (Zero Database Needed)");
        System.out.println(">>> Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("=================================================");
    }
}
