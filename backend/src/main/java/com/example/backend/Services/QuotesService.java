package com.example.backend.Services;

import java.io.StringReader;

import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.example.backend.Models.Quote;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

@Service
public class QuotesService {
    
    String API_KEY = "ummS6Q1BLtTHKc7jh1dvOA==CO3CHL84ytUdhbm0"; // To hide later.
    String URL_QUOTES = "https://api.api-ninjas.com/v1/quotes";

    public Quote getQuote() {
        String payload;
        String author;
        String stringQuote;
        Quote quote = new Quote();

        String url = UriComponentsBuilder
            .fromUriString(URL_QUOTES)
            .toUriString();

        RequestEntity<Void> request = RequestEntity
            .get(url)
            .header("X-Api-Key", API_KEY)
            .build();

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = null;

        try {
            response = restTemplate.exchange(request, String.class);
        } catch (Exception e) {
            e.printStackTrace();
        }

        payload = response.getBody();

        JsonReader jsonReader = Json.createReader(new StringReader(payload));
        JsonArray outerJsonArray = jsonReader.readArray();
        JsonObject innerJsonObject = outerJsonArray.getJsonObject(0);

        author = innerJsonObject.getString("author");
        stringQuote = innerJsonObject.getString("quote");
        quote.setAuthor(author);
        quote.setQuote(stringQuote);

        return quote;
    }

}
