package com.example.backend.Repositories;

public class SQLQueries {
    
    public static final String SQL_INSERT_USER = """
                    insert into users (username, email, password)
                    values(?, ?, ?)
                    """;
    
    public static final String SQL_INSERT_USER_PROFILE = """
                    insert into user_profiles (tests_completed, time_spent_typing, current_streak, selected_theme, user_id)
                    values(?, ?, ?, ?, ?)
                    """;

    public static final String SQL_INSERT_TEST_DATA = """
                    insert into test_data (test_type, words_per_minute, accuracy, time_taken, user_id)
                    values(?, ?, ?, ?, ?)
                    """;

    public static final String SQL_INSERT_PERSONAL_RECORD = """
                    insert into personal_records (test_type, words_per_minute, accuracy, time_taken, user_id)
                    values(?, ?, ?, ?, ?)
                    """;

    public static final String SQL_GET_LATEST_USER_ID = """
                    select last_insert_id()
                    as user_id
                    """;
    
    public static final String SQL_GET_USER_BY_EMAIL = """
                    select * from users
                    where email = ?
                    """;

    public static final String SQL_GET_USER_PROFILE_BY_USER_ID = """
                    select * from user_profiles
                    where user_id = ?
                    """;

    public static final String SQL_GET_TEST_DATA_BY_USER_ID = """
                    select * from test_data
                    where user_id = ?
                    """;
    
    public static final String SQL_GET_PERSONAL_RECORD_BY_USER_ID = """
                    select * from personal_records 
                    where user_id = ?
                    """;

    public static final String SQL_GET_PERSONAL_RECORD_BY_USER_ID_AND_TEST_TYPE = """
                    select * from personal_records 
                    where user_id = ?
                    and
                    test_type = ?
                    """;

    public static final String SQL_UPDATE_PERSONAL_RECORD_BY_USER_ID_AND_TEST_TYPE = """
                    update personal_records
                    set test_date = ?, words_per_minute = ?, accuracy = ?, time_taken = ?
                    where user_id = ?
                    and
                    test_type = ?
                    """;

    public static final String SQL_UPDATE_USER_PROFILE_BY_USER_ID_FOR_AFTER_TESTS = """
                    update user_profiles
                    set tests_completed = ?, time_spent_typing = ?, current_streak = ?
                    where user_id = ?
                    """;

}
