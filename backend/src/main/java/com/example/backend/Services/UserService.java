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
    public boolean createUser(User user) throws UserCreationException {
        // Hashing the password before storing
        String hash = passwordEncoder.encode(user.getPassword());
        user.setPassword(hash);

        boolean result = usersRepository.insertUser(user) && usersRepository.insertUserProfile(user.getUserProfile());

        if (!result) {
            throw new UserCreationException("There is a user exception. Try creating a user again.");
        }

        return result;
    }

    // Find user
    public Optional<User> authenticateUserLogin(String email, String password) {
        Optional<User> userCheck = usersRepository.findUserByEmail(email);
        if (userCheck.isPresent()) {
            User user = userCheck.get();
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
    
    
    // Delete -> If have time -> should delete user's data in all tables. (Transactional)



    
}
