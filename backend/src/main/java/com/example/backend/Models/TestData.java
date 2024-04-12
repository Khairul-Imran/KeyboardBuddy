package com.example.backend.Models;

import java.sql.Date;

import org.bson.Document;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import jakarta.json.JsonValue;
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

    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("testDataId", getTestDataId())
            .add("testDate", (JsonValue) getTestDate())
            .add("testType", getTestType())
            .add("wordsPerMinute", getWordsPerMinute())
            .add("accuracy", getAccuracy())
            .add("timeTaken", getTimeTaken())
            .add("userId", getUserId())
            .build();
    }

    public static TestData toTestData(Document document) {
        TestData testData = new TestData();
        testData.setTestDataId(document.getInteger("testDataId"));
        testData.setTestDate((Date) document.getDate("testDate"));
        testData.setTestType(document.getString("testType"));
        testData.setWordsPerMinute(document.getInteger("wordsPerMinute"));
        testData.setAccuracy(document.getInteger("accuracy"));
        testData.setTimeTaken(document.getInteger("timeTaken"));
        testData.setUserId(document.getInteger("userId"));

        return testData;
    }   
}
