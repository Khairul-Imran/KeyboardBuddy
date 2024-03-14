package com.example.backend.Repositories;

import java.util.Collections;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.example.backend.Models.Word;

@Repository
public class WordsRepository {

    @Autowired MongoTemplate mongoTemplate;

    // Time-based tests
    public List<Word> getEasyWordsRandomised() {
        int limit = 20; // Manually setting limit.
        long wordCount = mongoTemplate.estimatedCount("easywords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<Word> words = mongoTemplate.find(query, Document.class, "easywords")
            .stream()
            .map(w -> Word.fromJson(w))
            .toList();
        
        Collections.shuffle(words);
        return words;
    }

    public List<Word> getHardWordsRandomised() {
        int limit = 20; // Manually setting limit
        long wordCount = mongoTemplate.estimatedCount("hardwords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<Word> words = mongoTemplate.find(query, Document.class, "hardwords")
            .stream()
            .map(w -> Word.fromJson(w))
            .toList();

        Collections.shuffle(words);
        return words;
    }


    // Words-based tests
    // Allow user to do tests based on wordcount too. 10 / 15 / 20 / 40 etc.
    // Have each query have a limit chosen by the user
    public List<Word> getEasyWordsRandomisedLimited(int limit) {
        long wordCount = mongoTemplate.estimatedCount("easywords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<Word> words = mongoTemplate.find(query, Document.class, "easywords")
            .stream()
            .map(w -> Word.fromJson(w))
            .toList();
        
        Collections.shuffle(words);
        return words;
    }

    public List<Word> getHardWordsRandomisedLimited(int limit) {
        long wordCount = mongoTemplate.estimatedCount("hardwords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<Word> words = mongoTemplate.find(query, Document.class, "hardwords")
            .stream()
            .map(w -> Word.fromJson(w))
            .toList();

        Collections.shuffle(words);
        return words;
    }
    
}
