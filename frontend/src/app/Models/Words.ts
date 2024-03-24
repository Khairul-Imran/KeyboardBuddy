export interface Word {
    letters: Letter[];
    fullyCorrect: boolean;
    untouched: boolean;
}

export interface Letter {
    character: string;
    correct: boolean;
    untouched: boolean; // Only for the letters i think.
}