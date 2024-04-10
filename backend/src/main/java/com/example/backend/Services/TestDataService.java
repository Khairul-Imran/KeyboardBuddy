package com.example.backend.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.Models.PersonalRecords;
import com.example.backend.Models.TestData;
import com.example.backend.Models.UserProfile;
import com.example.backend.Repositories.TestDataRepository;
import com.example.backend.Repositories.UsersRepository;

@Service
public class TestDataService {
    
    @Autowired
    private TestDataRepository testDataRepository;

    @Autowired
    private UsersRepository usersRepository;

    // Insert test data, some user profile data and personal records data (if necessary) after a test is done
    @Transactional
    public void insertTestData(TestData testData) {

        testDataRepository.insertTestData(testData);

        // Data in user profile is ALWAYS updated after each test
        Optional<UserProfile> optionalUserProfile = usersRepository.findUserProfileByUserId(testData.getUserId());
        if (optionalUserProfile.isPresent()) {
            UserProfile existingUserProfile = optionalUserProfile.get();

            // Update that user profile with setters, then call the repo method to update
            existingUserProfile.setTestsCompleted(existingUserProfile.getTestsCompleted() + 1); // Increment by one
            existingUserProfile.setTimeSpentTyping(existingUserProfile.getTimeSpentTyping() + testData.getTimeTaken()); // Add the time taken on the new test
            // If......first test for the day -> streak + 1
            // If......not the first test for the day -> maintain...
            existingUserProfile.setCurrentStreak(existingUserProfile.getCurrentStreak() + 1); // To change. Need to detect if done for the day or not********
            
            usersRepository.updateUserProfileAfterTest(existingUserProfile);
        }

        // Update personal records if needed
        Optional<PersonalRecords> optionalPersonalRecord = testDataRepository.findPersonalRecordByUserIdAndTestType(testData.getUserId(), testData.getTestType());
        if (optionalPersonalRecord.isPresent()) { // Personal Record for that user and test type exists
            PersonalRecords personalRecord =  optionalPersonalRecord.get();

            if (testData.getWordsPerMinute() > personalRecord.getWordsPerMinute()) { // New test data has higher wpm score
                // Updating the EXISTING personal record
                personalRecord.setTestDate(new java.sql.Date(System.currentTimeMillis())); // Updates with the current date
                personalRecord.setWordsPerMinute(testData.getWordsPerMinute());
                personalRecord.setAccuracy(testData.getTimeTaken());
                personalRecord.setTimeTaken(testData.getTimeTaken());

                // Updating existing PR
                testDataRepository.updatePersonalRecord(personalRecord);
            }

            // If new wpm is not more than existing wpm, do nothing for PR.

        } else { // Personal Record does not exist -> add in a new one

            PersonalRecords personalRecordToAdd = new PersonalRecords();
            personalRecordToAdd.setTestType(testData.getTestType());
            personalRecordToAdd.setWordsPerMinute(testData.getWordsPerMinute());
            personalRecordToAdd.setAccuracy(testData.getAccuracy());
            personalRecordToAdd.setTimeTaken(testData.getTimeTaken());
            personalRecordToAdd.setUserId(testData.getUserId());

            // Inserting brand new PR
            testDataRepository.insertPersonalRecord(personalRecordToAdd);
        }
    }

    // Find test data and personal records
    public Optional<List<TestData>> findAllTestDataByUserId(Integer userId) {
        return testDataRepository.findAllTestDataByUserId(userId);
    }

    public Optional<List<PersonalRecords>> findAllPersonalRecordsByUserId(Integer userId) {
        return testDataRepository.findAllPersonalRecordsByUserId(userId);
    }

}
