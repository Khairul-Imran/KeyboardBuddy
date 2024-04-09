package com.example.backend.Models;

import java.sql.Time;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfile {
    
    Integer profileId; // PK

    Integer testsCompleted;
    Integer timeSpentTyping;
    Integer currentStreak; // Consecutive days doing at least 1 test.
    String selectedTheme;
    Boolean hasPremium;
    // Integer personalBestWpm;
    // TestData[] personalBestRecords; // -> made a new table

    Integer userId; // FK

}
