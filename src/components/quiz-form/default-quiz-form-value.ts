export type QuizFormData = {
    name: string;
    answers: string[];
};

export const getDefaultQuizValue = (): QuizFormData => ({ name: '', answers: [] });
