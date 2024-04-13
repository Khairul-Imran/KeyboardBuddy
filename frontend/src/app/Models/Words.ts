export interface Word {
    letters: Letter[];
    fullyCorrect: boolean;
    untouched: boolean;
}

export interface Quote {
    sentence: Word[];
    author: string;
}

export interface Letter {
    character: string;
    correct: boolean;
    untouched: boolean; // Only for the letters i think.
}