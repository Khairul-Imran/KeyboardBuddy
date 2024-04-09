package com.example.backend.Models;

import java.sql.Date;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestData {

    Integer testDataId; // PK

    Date testDate;
    String testType;
    Integer wordsPerMinute;
    Integer accuracy;
    Integer timeTaken;

    Integer userId; // FK

    // Include the dates of the tests too -> to add in angular side too.


}
