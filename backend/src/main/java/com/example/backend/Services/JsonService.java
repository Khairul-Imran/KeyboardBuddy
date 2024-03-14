package com.example.backend.Services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.backend.Models.Word;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;

@Service
public class JsonService {
    

    // Might not need this.
    public JsonArray wordListToJson(List<Word> words) {
        JsonArrayBuilder jsonArrayBuilder = Json.createArrayBuilder();

        for (Word word : words) {
            JsonObject wordJson = Json.createObjectBuilder()
                .add("word", word.getWord())
                .add("length", word.getLength())
                .build();
            jsonArrayBuilder.add(wordJson);
        }

        JsonArray jsonWordArray = jsonArrayBuilder.build();

        return jsonWordArray;
    }


}
