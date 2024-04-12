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
public class PersonalRecords {
    
    Integer personalRecordsId; // PK

    Date testDate;
    String testType;
    Integer wordsPerMinute;
    Integer accuracy;
    Integer timeTaken;

    Integer userId; // FK

    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("personalRecordsId", getPersonalRecordsId())
            .add("testDate", (JsonValue) getTestDate())
            .add("testType", getTestType())
            .add("wordsPerMinute", getWordsPerMinute())
            .add("accuracy", getAccuracy())
            .add("timeTaken", getTimeTaken())
            .add("userId", getUserId())
            .build();
    }

    public static PersonalRecords toPersonalRecords(Document document) {
        PersonalRecords personalRecords = new PersonalRecords();
        personalRecords.setPersonalRecordsId(document.getInteger("personalRecordsId"));
        personalRecords.setTestDate( (Date) document.getDate("testDate"));
        personalRecords.setTestType(document.getString("testType"));
        personalRecords.setWordsPerMinute(document.getInteger("wordsPerMinute"));
        personalRecords.setAccuracy(document.getInteger("accuracy"));
        personalRecords.setTimeTaken(document.getInteger("timeTaken"));
        personalRecords.setUserId(document.getInteger("userId"));

        return personalRecords;
    }


}
