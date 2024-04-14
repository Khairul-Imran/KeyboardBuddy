package com.example.backend.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.Exceptions.ProfileNotFoundException;
import com.example.backend.Exceptions.UserCreationException;
import com.example.backend.Models.User;
import com.example.backend.Models.UserProfile;
import com.example.backend.Repositories.UsersRepository;

@Service
public class UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Create user and user profile
    @Transactional (rollbackFor = UserCreationException.class)
    public User createUser(User user) throws UserCreationException {
        // Hashing the password before storing
        String hash = passwordEncoder.encode(user.getPassword());
        user.setPassword(hash);

        boolean result = usersRepository.insertUser(user) && usersRepository.insertUserProfile(user.getUserProfile());

        if (!result) {
            throw new UserCreationException("There is a user exception. Try creating a user again.");
        }

        Optional<User> optionalInsertedUser = usersRepository.findUserByUsername(user.getUsername());
        User insertedUser = optionalInsertedUser.get();
        Optional<UserProfile> optionalUserProfile = usersRepository.findUserProfileByUserId(insertedUser.getUserId());
        UserProfile insertedUserProfile = optionalUserProfile.get();
        insertedUser.setUserProfile(insertedUserProfile);

        System.out.println("Service: User and User Profile successfully created!");

        return insertedUser;
    }

    // Check if email and username exists
    public boolean isEmailRegistered(String email) {
        return usersRepository.findUserByEmail(email).isPresent();
    }

    public boolean isUsernameUsed(String username) {
        return usersRepository.findUserByUsername(username).isPresent();
    }

    // Find user
    public Optional<User> authenticateUserLogin(String email, String password) {
        Optional<User> userCheck = usersRepository.findUserByEmail(email);
        if (userCheck.isPresent()) {
            User user = userCheck.get();

            // Need to populate the userProfile
            Optional<UserProfile> optionalUserProfile = usersRepository.findUserProfileByUserId(user.getUserId());
            if (optionalUserProfile.isPresent()) {
                UserProfile userProfile = optionalUserProfile.get();
                user.setUserProfile(userProfile);
            }

            if (passwordEncoder.matches(password, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    // Find user profile
    public Optional<UserProfile> findUserProfileByUserId(Integer userId) {
        return usersRepository.findUserProfileByUserId(userId);
    }

    // Update userProfile (theme and hasPremium only)
    @Transactional
    public void updateUserProfileTheme(Integer userId, String selectedTheme) throws ProfileNotFoundException {

        Optional<UserProfile> optionalUserProfile = usersRepository.findUserProfileByUserId(userId);
        if (optionalUserProfile.isPresent()) {
            UserProfile existingUserProfile = optionalUserProfile.get();

            existingUserProfile.setSelectedTheme(selectedTheme);
            usersRepository.updateUserProfileForThemes(existingUserProfile);
        } else {
            throw new ProfileNotFoundException("Profile not found for User ID: " + userId);
        }
    }

    @Transactional
    public void updateUserProfilePremiumStatus(Integer userId, Boolean hasPremium) throws ProfileNotFoundException {
        // Should only be updating for if it is true. Since it is a one time purchase.
        Optional<UserProfile> optionalUserProfile = usersRepository.findUserProfileByUserId(userId);
        if (optionalUserProfile.isPresent()) {
            UserProfile existingUserProfile = optionalUserProfile.get();

            existingUserProfile.setHasPremium(hasPremium);
            usersRepository.updateUserProfileForPremium(existingUserProfile);
        } else {
            throw new ProfileNotFoundException("Profile not found for User ID: " + userId);
        }
    }

    // Update UserProfile (tests taken etc.)
    @Transactional
    public Boolean updateUserProfileAfterTest(Integer userId, Integer testsCompleted, Integer timeSpentTyping, Integer currentStreak) throws ProfileNotFoundException{
        Optional<UserProfile> optionalUserProfile = usersRepository.findUserProfileByUserId(userId);
        if (optionalUserProfile.isPresent()) {
            UserProfile existingUserProfile = optionalUserProfile.get();

            existingUserProfile.setTestsCompleted(testsCompleted);
            existingUserProfile.setTimeSpentTyping(timeSpentTyping);
            existingUserProfile.setCurrentStreak(currentStreak);

            Boolean insertAttempt = usersRepository.updateUserProfileAfterTest(existingUserProfile);

            return insertAttempt;

        } else {
            throw new ProfileNotFoundException("Profile not found for User Id: " + userId);
        }
    }
        
    // Delete -> If have time -> should delete user's data in all tables. (Transactional)


}
