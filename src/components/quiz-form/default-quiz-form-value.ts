export type QuizFormData = {
    name: string;
    answers: string[];
    factsLimit: number;
};

export const getDefaultQuizValue = (): QuizFormData => ({ name: '', answers: [''], factsLimit: 3 });
