package com.example.backend.Repositories;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.backend.Models.User;
import com.example.backend.Models.UserProfile;

@Repository
public class UsersRepository {
    
    @Autowired
    private JdbcTemplate template;

    // Create user.
    public boolean createUser(User user) {
        System.out.println("User Repo - This is the user we want to create: " + user.toString());

        int insertAttempt = 0;
        insertAttempt = template.update(SQLQueries.SQL_INSERT_USER,
            user.getUsername(),
            user.getEmail(),
            user.getPassword()
        );

        if (insertAttempt > 0) {
            System.out.println("Creation of user was successful");
            return true;
        }

        return false;
    }

    // TODO
    public boolean createUserProfile(UserProfile userProfile) {
        return true;
    }


}
