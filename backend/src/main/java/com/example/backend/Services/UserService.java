package com.example.backend.Services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.Exceptions.UserException;
import com.example.backend.Models.User;
import com.example.backend.Models.UserProfile;
import com.example.backend.Repositories.UsersRepository;

@Service
public class UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Through HTTP
    // Create
    @Transactional (rollbackFor = UserException.class)
    public boolean createUser(User user) throws UserException {
        // Hashing the password before storing
        String hash = passwordEncoder.encode(user.getPassword());
        user.setPassword(hash);

        boolean result = usersRepository.insertUser(user) && usersRepository.insertUserProfile(user.getUserProfile());

        if (!result) {
            throw new UserException("There is a user exception. Try creating a user again.");
        }

        return result;
    }

    // Find
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

    public Optional<UserProfile> findUserProfileByUserId(Integer userId) {
        return usersRepository.findUserProfileByUserId(userId);
    }

    // Find test data and personal records


    // Delete -> If have time -> should delete user's data in all tables. (Transactional)




    
    // Through websockets
    // Create test data and pesonal records
    // If test data is the "high score", will create or UPDATE (if there is existing test type) a personal record too
    // 



    // Update -> mainly for updating the data in userProfile, and personal records
    // Purely to be done through websockets.





    
}
