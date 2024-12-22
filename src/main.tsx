import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import './index.scss';
import './firebase.ts';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

import { QuizzesListPage } from './pages/quizzes-list/quizzes-list.page.tsx';
import { QuizPage } from './pages/quiz/quiz.page.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<QuizzesListPage />} />
                    <Route path="/quiz/:quizId" element={<QuizPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </Theme>
    </StrictMode>
);
