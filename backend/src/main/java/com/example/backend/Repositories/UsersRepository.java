package com.example.backend.Repositories;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Repository;

import com.example.backend.Models.User;
import com.example.backend.Models.UserProfile;

@Repository
public class UsersRepository {
    
    @Autowired
    private JdbcTemplate template;

    // Insert user and userProfile
    public boolean insertUser(User user) {
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

    public boolean insertUserProfile(UserProfile userProfile) {
        System.out.println("User Repo - Creating user profile: " + userProfile.toString());

        int insertAttempt = 0;
        int userId = 0;

        // Getting the relevant user id
        SqlRowSet sqlRowSet = template.queryForRowSet(SQLQueries.SQL_GET_LATEST_USER_ID);
        while(sqlRowSet.next()) {
            userId = sqlRowSet.getInt("user_id");
        }

        insertAttempt = template.update(SQLQueries.SQL_INSERT_USER_PROFILE,
            userProfile.getTestsCompleted(),
            userProfile.getTimeSpentTyping(),
            userProfile.getCurrentStreak(),
            userProfile.getSelectedTheme(),
            userId
        );

        if (insertAttempt > 0) {
            System.out.println("Creation of user profile was successful");
            return true;
        }

        return false;
    }

    // Find user and userProfile
    public Optional<User> findUserByEmail(String email) {
        System.out.println("Users Repo - Finding user by email: " + email);

        return template.query(SQLQueries.SQL_GET_USER_BY_EMAIL, new UserRowMapper(), email).stream().findFirst();
    }

    public Optional<UserProfile> findUserProfileByUserId(Integer userId) {
        System.out.println("Users Repo - Finding user profile by user id: " + userId);

        return template.query(SQLQueries.SQL_GET_USER_PROFILE_BY_USER_ID, new UserProfileRowMapper(), userId).stream().findFirst();
    }


    public boolean updateUserProfileAfterTest(UserProfile userProfile) {
        System.out.println("Users Repo - Updating existing user profile: " + userProfile.toString());

        int updateAttempt = 0;
        updateAttempt = template.update(SQLQueries.SQL_UPDATE_USER_PROFILE_BY_USER_ID_FOR_AFTER_TESTS,
            userProfile.getTestsCompleted(),
            userProfile.getTimeSpentTyping(),
            userProfile.getCurrentStreak(),
            userProfile.getUserId() // Criteria
        );

        if (updateAttempt > 0) {
            System.out.println("User Profile successfully updated.");
            return true;
        }

        return false;
    }

    // TODO ******
    // Need to update user profile for when hasPremium and selected theme changes......
    // Streak will update (++) after a test is done (above method)





    // Static methods.
    private static class UserRowMapper implements RowMapper<User> {
        @Override
        public User mapRow(ResultSet resultSet, int rowNumber) throws SQLException {
            User user = new User();
            user.setUserId(resultSet.getInt("user_id"));
            user.setJoinedDate(resultSet.getDate("joined_date"));
            user.setUsername(resultSet.getString("username"));
            user.setEmail(resultSet.getString("email"));
            user.setPassword(resultSet.getString("password"));
            return user;
        }
    }

    private static class UserProfileRowMapper implements RowMapper<UserProfile> {
        @Override
        public UserProfile mapRow(ResultSet resultSet, int rowNumber) throws SQLException {
            UserProfile userProfile = new UserProfile();
            userProfile.setProfileId(resultSet.getInt("profile_id"));
            userProfile.setTestsCompleted(resultSet.getInt("tests_completed"));
            userProfile.setTimeSpentTyping(resultSet.getInt("time_spent_typing"));
            userProfile.setCurrentStreak(resultSet.getInt("current_streak"));
            userProfile.setSelectedTheme(resultSet.getString("selected_theme"));
            userProfile.setHasPremium(resultSet.getBoolean("has_premium"));
            userProfile.setUserId(resultSet.getInt("user_id"));
            return userProfile;
        }
    }
}
