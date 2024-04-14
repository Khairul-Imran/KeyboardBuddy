package com.example.backend.Repositories;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.example.backend.Models.PersonalRecords;
import com.example.backend.Models.TestData;

@Repository
public class TestDataRepository {
    
    @Autowired
    private JdbcTemplate template;

    // Insert test_data and personal_record
    public boolean insertTestData(TestData testData) {
        System.out.println("Test Data Repo - This is the test data we want to insert: " + testData.toString());

        int insertAttempt = 0;
        insertAttempt = template.update(SQLQueries.SQL_INSERT_TEST_DATA,
            testData.getTestType(),
            testData.getWordsPerMinute(),
            testData.getAccuracy(),
            testData.getTimeTaken(),
            testData.getUserId() // When receiving test data from client, userId should be included.
        );

        if (insertAttempt > 0) {
            System.out.println("Test Data successfully inserted.");
            return true;
        }

        return false;
    }

    public boolean insertPersonalRecord(PersonalRecords personalRecords) {
        System.out.println("Test Data Repo - This is the personal record we want to insert: " + personalRecords.toString());

        int insertAttempt = 0;
        insertAttempt = template.update(SQLQueries.SQL_INSERT_PERSONAL_RECORD,
            personalRecords.getTestType(),
            personalRecords.getWordsPerMinute(),
            personalRecords.getAccuracy(),
            personalRecords.getTimeTaken(),
            personalRecords.getUserId() // When receiving test data from client, userId should be included.
        );

        if (insertAttempt > 0) {
            System.out.println("Personal Record successfully inserted.");
            return true;
        }

        return false;
    }

    // Find test_data and personal_record
    // For test_data, might want to limit it in the future for pagination idk....
    public Optional<List<TestData>> findAllTestDataByUserId(Integer userId) {
        System.out.println("Test Data Repo - Finding test data by userId: " + userId);
        List<TestData> testDatas = template.query(SQLQueries.SQL_GET_TEST_DATA_BY_USER_ID, new TestDataRowMapper(), userId);

        return Optional.ofNullable(testDatas.isEmpty() ? null : testDatas);
    }

    public Optional<List<PersonalRecords>> findAllPersonalRecordsByUserId(Integer userId) {
        System.out.println("Test Data Repo - Finding personal records by userId: " + userId);
        List<PersonalRecords> personalRecords = template.query(SQLQueries.SQL_GET_PERSONAL_RECORD_BY_USER_ID, new PersonalRecordsRowMapper(), userId);

        return Optional.ofNullable(personalRecords.isEmpty() ? null : personalRecords);
    }

    // For finding specific personal records based on test type -> for comparisons with new test data
    public Optional<PersonalRecords> findPersonalRecordByUserIdAndTestType(Integer userId, String testType) {
        System.out.println("Test Data Repo - Finding specific personal record by userId and testType: " + userId + " and "+ testType);

        return template.query(SQLQueries.SQL_GET_PERSONAL_RECORD_BY_USER_ID_AND_TEST_TYPE, new PersonalRecordsRowMapper(), userId, testType).stream().findFirst();
    }

    // Update personal record
    public boolean updatePersonalRecord(PersonalRecords personalRecords) {
        System.out.println("Test Data Repo - Updating existing personal record with new record: " + personalRecords.toString());

        int updateAttempt = 0;
        updateAttempt = template.update(SQLQueries.SQL_UPDATE_PERSONAL_RECORD_BY_USER_ID_AND_TEST_TYPE,
            personalRecords.getTestDate(),
            personalRecords.getWordsPerMinute(),
            personalRecords.getAccuracy(),
            personalRecords.getTimeTaken(),
            personalRecords.getUserId(), // Criteria
            personalRecords.getTestType() // Criteria
        );

        if (updateAttempt > 0) {
            System.out.println("Personal Record successfully updated.");
            return true;
        }

        return false;
    }


    // Static methods
    private static class TestDataRowMapper implements RowMapper<TestData> {
        @Override
        public TestData mapRow(ResultSet resultSet, int rowNumber) throws SQLException {
            TestData testData = new TestData();
            testData.setTestDataId(resultSet.getInt("test_data_id"));
            testData.setTestDate(resultSet.getDate("test_date")); // Not sure if should use getDate here or timestamp
            testData.setTestType(resultSet.getString("test_type"));            
            testData.setWordsPerMinute(resultSet.getInt("words_per_minute"));
            testData.setAccuracy(resultSet.getInt("accuracy"));
            testData.setTimeTaken(resultSet.getInt("time_taken"));
            testData.setUserId(resultSet.getInt("user_id"));
            return testData;
        }
    }

    private static class PersonalRecordsRowMapper implements RowMapper<PersonalRecords> {
        @Override
        public PersonalRecords mapRow(ResultSet resultSet, int rowNumber) throws SQLException {
            PersonalRecords personalRecords = new PersonalRecords();
            personalRecords.setPersonalRecordsId(resultSet.getInt("personal_records_id"));
            personalRecords.setTestDate(resultSet.getDate("test_date")); // Not sure if should use getDate here or timestamp
            personalRecords.setTestType(resultSet.getString("test_type"));            
            personalRecords.setWordsPerMinute(resultSet.getInt("words_per_minute"));
            personalRecords.setAccuracy(resultSet.getInt("accuracy"));
            personalRecords.setTimeTaken(resultSet.getInt("time_taken"));
            personalRecords.setUserId(resultSet.getInt("user_id"));
            return personalRecords;
        }
    }
}
