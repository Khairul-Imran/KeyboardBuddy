package com.example.backend.Models;

import org.bson.Document;

import jakarta.json.Json;
import jakarta.json.JsonObject;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WordStore {
    
    String word;
    Integer length;

    public JsonObject toJson() {
        return Json.createObjectBuilder()
            .add("word", getWord())
            .add("length", getLength())
            .build();
    }

    public static WordStore fromJson(Document document) {
        WordStore word = new WordStore();
        word.setWord(document.getString("word"));
        word.setLength(document.getInteger("length"));

        return word;
    }

}
