package com.example.backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Models.Quote;
import com.example.backend.Services.QuotesService;

import jakarta.json.Json;
import jakarta.json.JsonObject;

@RestController
@CrossOrigin(origins = {"http://localhost:4200", "https://quaint-jar-production.up.railway.app/", "https://keyboardbuddy.khairul-imran.dev"})
@RequestMapping("/api/quotes")
public class QuotesController {
    
    @Autowired
    private QuotesService quotesService;

    @GetMapping
    public ResponseEntity<String> getQuote() {
        
        Quote quote = quotesService.getQuote();
        System.out.println("Received quote: " + quote.toString());

        JsonObject quoteToJson = Json.createObjectBuilder()
            .add("quote", quote.getQuote())
            .add("author", quote.getAuthor())
            .build();

        if (quoteToJson.isEmpty()) {
            return ResponseEntity.status(404).body(
                Json.createObjectBuilder().add("Message: ", "Cannot get quote.").build().toString()
            );
        }

        return ResponseEntity.ok(quoteToJson.toString());
    }    

}
