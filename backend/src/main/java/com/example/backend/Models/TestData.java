package com.example.backend.Models;

import java.io.StringReader;
import java.sql.Date;
import java.util.List;

import org.bson.Document;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
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
            .add("testDate", getTestDate().getTime())
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

    // public static JsonArray testDataListToJson(List<TestData> testDatas) {
    //     JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();

    //     System.out.println("Test Data Object class - Converting test data!!!");

    //     for (TestData testData : testDatas) {
    //         JsonObject testDataJson = Json.createObjectBuilder()
    //             .add("testDataId", testData.getTestDataId())
    //             .add("testDate", testData.getTestDate().getTime())
    //             .add("testType", testData.getTestType())
    //             .add("wordsPerMinute", testData.getWordsPerMinute())
    //             .add("accuracy", testData.getAccuracy())
    //             .add("timeTaken", testData.getTimeTaken())
    //             .add("userId", testData.getUserId())
    //             .build();
    //         jsonArrayBuilder.add(testDataJson);
    //     }
    //     JsonArray jsonTestDataArray = jsonArrayBuilder.build();

    //     System.out.println(jsonTestDataArray);

    //     return jsonTestDataArray;
    // }
}
