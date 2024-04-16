package com.example.backend.Controllers;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Exceptions.TestDataInsertionException;
import com.example.backend.Exceptions.UserCreationException;
import com.example.backend.Models.EmailToSend;
import com.example.backend.Models.LoginRequest;
import com.example.backend.Models.PersonalRecords;
import com.example.backend.Models.RegistrationRequest;
import com.example.backend.Models.TestData;
import com.example.backend.Models.TestDataFromClient;
import com.example.backend.Models.User;
import com.example.backend.Models.UserProfile;
import com.example.backend.Services.EmailService;
import com.example.backend.Services.TestDataService;
import com.example.backend.Services.UserService;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;

@RestController
@CrossOrigin(origins = {"http://localhost:4200"})
@RequestMapping("/api")
public class UserController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private TestDataService testDataService;

    @Autowired EmailService emailService;

    // Register
    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> userRegistration(@RequestBody String payload) {
        System.out.printf(">>> POST payload: %s\n", payload);

        RegistrationRequest registrationRequest = RegistrationRequest.toRegistrationRequest(payload);

        if (userService.isUsernameUsed(registrationRequest.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already being used.");
        }

        if (userService.isEmailRegistered((registrationRequest.getEmail()))) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username is already being used.");
        }
        
        // Username and email are not used.
        User newUser = new User();
        newUser.setUsername(registrationRequest.getUsername());
        newUser.setEmail(registrationRequest.getEmail());
        newUser.setPassword(registrationRequest.getPassword());

        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setTestsCompleted(0);
        newUserProfile.setTimeSpentTyping(0);
        newUserProfile.setCurrentStreak(0);
        newUserProfile.setSelectedTheme("theme0");
        // newUserProfile.setHasPremium(false); // SQL set by default false.

        newUser.setUserProfile(newUserProfile);

        try {
            System.out.println("Controller: Creating user: " + newUser.toString());
            User insertedUser = userService.createUser(newUser);

            System.out.println("CONTROLLER: we are converting to json: " + insertedUser);
            JsonObject insertedUserInJson = insertedUser.toJson();

            System.out.println("Controller: Returning to client....");

            System.out.println("Sending email!");
            EmailToSend emailToSend = new EmailToSend();
            emailToSend.setSendToEmail(insertedUser.getEmail());
            emailToSend.setContent("Welcome to KeyboardBuddy. We look forward to helping you improve your typing skills!");
            emailToSend.setSubject("Thank you for registering!");
            System.out.println("Email to be sent: " + emailToSend.toString());

            emailService.sendEmail(
                emailToSend.getSendToEmail(), 
                emailToSend.getSubject(), 
                emailToSend.getContent());

            return ResponseEntity.status(HttpStatus.CREATED).body(insertedUserInJson.toString());

        } catch (UserCreationException e) {

            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while registering user.");
        }
    }

    
    // Login
    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> userLogin(@RequestBody String payload) {
        System.out.printf(">>> POST payload: %s\n", payload);

        LoginRequest loginRequest = LoginRequest.toLoginRequest(payload);

        try {
            Optional<User> authenticateLoginAttempt = userService.authenticateUserLogin(loginRequest.getEmail(), loginRequest.getPassword());
    
            if (authenticateLoginAttempt.isPresent()) {

                User existingUser = authenticateLoginAttempt.get();

                System.out.println("CONTROLLER: existingUser to be logged in: " + existingUser);

                JsonObject existingUserInJson = existingUser.toJson();

                return ResponseEntity.ok(existingUserInJson.toString());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Insert test data
    @PostMapping(path= "/testData", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> insertTestData(@RequestBody String payload, @RequestParam Integer userId) {
        System.out.printf(">>> POST payload: %s\n", payload);

        TestDataFromClient testDataFromClient = TestDataFromClient.toTestDataFromClient(payload);

        TestData testData = new TestData();
        testData.setTestType(testDataFromClient.getTestType());
        testData.setWordsPerMinute(testDataFromClient.getWordsPerMinute());
        testData.setAccuracy(testDataFromClient.getAccuracy());
        testData.setTimeTaken(testDataFromClient.getTimeTaken());
        testData.setUserId(userId);

        try {
            System.out.println("Controller - Inserting Test Data: " + testData.toString());
            testDataService.insertTestData(testData);
            return ResponseEntity.ok("Test Data successfully inserted!");

        } catch (TestDataInsertionException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error while inserting data.");
        }

    }


    // Access user profile page (includes user profile, test data, and personal records)
    @GetMapping("/{userId}/userProfile")
    public ResponseEntity<String> getUserProfile(@PathVariable Integer userId) {
        
        try {
            Optional<UserProfile> optionalUserProfile = userService.findUserProfileByUserId(userId);

            if (optionalUserProfile.isPresent()) {
                UserProfile existingUserProfile = optionalUserProfile.get();
                JsonObject existingUserProfileInJson =  existingUserProfile.toJson();

                return ResponseEntity.ok(existingUserProfileInJson.toString());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/testData/{userId}")
    public ResponseEntity<String> getTestData(@PathVariable Integer userId) {

        System.out.println("CONTROLLER - Start getting test data.....");
     
        try {
            Optional<List<TestData>> optionalTestData = testDataService.findAllTestDataByUserId(userId);

            if (optionalTestData.isPresent()) {
                List<TestData> existingTestData = optionalTestData.get();

                System.out.println("Existing test data: " + existingTestData);

                JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
                existingTestData.stream()
                    .map(TestData::toJson)
                    .forEach(arrayBuilder::add);

                return ResponseEntity.ok(arrayBuilder.build().toString());
            } else {
                return ResponseEntity.noContent().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/personalRecords/{userId}")
    public ResponseEntity<String> getPersonalRecords(@PathVariable Integer userId) {

        System.out.println("CONTROLLER - Start getting personal records.....");
        
        try {
            Optional<List<PersonalRecords>> optionalPersonalRecords = testDataService.findAllPersonalRecordsByUserId(userId);
            if (optionalPersonalRecords.isPresent()) {
                List<PersonalRecords> existingPersonalRecords = optionalPersonalRecords.get();

                JsonArrayBuilder arrayBuilder = Json.createArrayBuilder();
                existingPersonalRecords.stream()
                    .map(PersonalRecords::toJson)
                    .forEach(arrayBuilder::add);

                return ResponseEntity.ok(arrayBuilder.build().toString());
            } else {
                return ResponseEntity.noContent().build();
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PutMapping("/updateAfterTest/{userId}")
    public ResponseEntity<String> updateUserProfileAfterTest(@PathVariable Integer userId, @RequestBody Map<String, Integer> updateData) {

        System.out.println("CONTROLLER - Received data to update after test for userId: " + userId);

        Integer testsCompleted = updateData.get("testsCompleted");
        Integer timeSpentTyping = updateData.get("timeSpentTyping");
        Integer currentStreak = updateData.get("currentStreak");

        try {
            Boolean updateAttempt = userService.updateUserProfileAfterTest(userId, testsCompleted, timeSpentTyping, currentStreak);
            if (updateAttempt) {
                return ResponseEntity.ok("Data updated successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to insert data.");
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred.");
        }
    }

    @PutMapping("/updateAfterPurchase/{userId}")
    public ResponseEntity<String> updateUserProfileAfterPurchase(@PathVariable Integer userId, @RequestBody Map<String, Boolean> updateData) {

        System.out.println("CONTROLLER - Received data to update after purchase for userId: " + userId);

        Boolean hasPremium = updateData.get("hasPremium");

        try {
            Boolean updateAttempt = userService.updateUserProfilePremiumStatus(userId, hasPremium);
            if (updateAttempt) {
                return ResponseEntity.ok("hasPremium updated successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update has premium");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred.");
        }
    }

    @PutMapping("/updateTheme/{userId}")
    public ResponseEntity<String> updateUserProfileTheme(@PathVariable Integer userId, @RequestBody Map<String, String> updateData) {
    
        System.out.println("CONTROLLER - Received data to update theme for userId: " + userId);
    
        String currentTheme = updateData.get("selectedTheme");

        try {
            Boolean updateAttempt = userService.updateUserProfileTheme(userId, currentTheme);
            if (updateAttempt) {
                return ResponseEntity.ok("hasPremium updated successfully!");
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update has premium");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error occurred.");
        }
    }


}
