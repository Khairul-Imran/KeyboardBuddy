package com.example.backend.Controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.Exceptions.UserCreationException;
import com.example.backend.Models.LoginRequest;
import com.example.backend.Models.PersonalRecords;
import com.example.backend.Models.RegistrationRequest;
import com.example.backend.Models.TestData;
import com.example.backend.Models.User;
import com.example.backend.Models.UserProfile;
import com.example.backend.Services.TestDataService;
import com.example.backend.Services.UserService;

import jakarta.json.Json;
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
        newUserProfile.setSelectedTheme("");
        // newUserProfile.setHasPremium(false); // SQL set by default false.

        newUser.setUserProfile(newUserProfile);

        try {
            System.out.println("Controller: Creating user: " + newUser.toString());
            User insertedUser = userService.createUser(newUser);

            System.out.println("CONTROLLER: we are converting to json: " + insertedUser);
            JsonObject insertedUserInJson = insertedUser.toJson();

            System.out.println("Controller: Returning to client....");
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
                JsonObject existingUserInJson = existingUser.toJson();

                return ResponseEntity.ok(existingUserInJson.toString());
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
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

    // @GetMapping("/{userId}/user")
    // public ResponseEntity<User> getUser(@PathVariable Integer userId) {

        // Shouldn't we be sending these get requests as a json string??

    // }

    @GetMapping("/testData/{userId}")
    public ResponseEntity<String> getTestData(@PathVariable Integer userId) {

        System.out.println("CONTROLLER - Start getting test data.....");
     
        try {
            Optional<List<TestData>> optionalTestData = testDataService.findAllTestDataByUserId(userId);

            if (optionalTestData.isPresent()) {
                List<TestData> existingTestData = optionalTestData.get();

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

}
