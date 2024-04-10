export interface UserRegistration {
    username: string;
    email: string;
    password: string;
}

export const DEFAULT_REGISTRATION: UserRegistration = {
    username: '',
    email: '',
    password: ''
}

export interface UserLogin {
    email: string;
    password: string;
}

export const DEFAULT_LOGIN: UserLogin = {
    email: '',
    password: ''
}

export interface UserProfile {
    profileId: number;

    testsCompleted: number;
    timeSpentTyping: number;
    currentStreak: number;
    selectedTheme: string;
    hasPremium: boolean;

    userId: number;
}

export interface DisplayedTestData {
    testDataId: number;

    testDate: Date;
    testType: string; 
    wordsPerMinute: number;
    accuracy: number;
    timeTaken: number; 

    userId: number;
}

export interface PersonalRecords {
    personalRecordsId: number;

    testDate: Date;
    testType: string; 
    wordsPerMinute: number;
    accuracy: number;
    timeTaken: number;

    userId: number;
}