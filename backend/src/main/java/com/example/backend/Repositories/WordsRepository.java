package com.example.backend.Repositories;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.MatchOperation;
import org.springframework.data.mongodb.core.aggregation.SampleOperation;
import org.springframework.data.mongodb.core.query.Criteria;
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
        // int minLongWords = (int) (limit * 0.75); // longWordsCount

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<Word> retrievedWords = mongoTemplate.find(query, Document.class, "easywords")
            .stream()
            .map(w -> Word.fromJson(w))
            .toList();

        // MatchOperation matchLongWords = Aggregation.match(Criteria.where("length").gte(5));
        // SampleOperation sampleLongerWords = Aggregation.sample(minLongWords);
        // MatchOperation matchRemainingWords = Aggregation.match(Criteria.exists(true));
        
        List<Word> words = new ArrayList<>(retrievedWords);
        
        Collections.shuffle(words);
        return words;
    }

    public List<Word> getHardWordsRandomised() {
        int limit = 20; // Manually setting limit
        long wordCount = mongoTemplate.estimatedCount("hardwords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<Word> retrievedWords = mongoTemplate.find(query, Document.class, "hardwords")
            .stream()
            .map(w -> Word.fromJson(w))
            .toList();
        
        List<Word> words = new ArrayList<>(retrievedWords);

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

        List<Word> retrievedWords = mongoTemplate.find(query, Document.class, "easywords")
            .stream()
            .map(w -> Word.fromJson(w))
            .toList();

        List<Word> words = new ArrayList<>(retrievedWords);
        
        Collections.shuffle(words);
        return words;
    }

    public List<Word> getHardWordsRandomisedLimited(int limit) {
        long wordCount = mongoTemplate.estimatedCount("hardwords");
        int randomSkipPoint = (int) (Math.random() * (wordCount - limit));

        Query query = new Query();
        query.skip(randomSkipPoint).limit(limit);

        List<Word> retrievedWords = mongoTemplate.find(query, Document.class, "hardwords")
            .stream()
            .map(w -> Word.fromJson(w))
            .toList();

        List<Word> words = new ArrayList<>(retrievedWords);

        Collections.shuffle(words);
        return words;
    }
    
}
