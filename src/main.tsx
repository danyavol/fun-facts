import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import './index.scss';
import './firebase.ts';
import './utils/time-sync.ts';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

import { QuizzesListPage } from './pages/quizzes-list/quizzes-list.page.tsx';
import { QuizPage } from './pages/quiz/quiz.page.tsx';
import { SignInPage } from './pages/sign-in/sign-in.page.tsx';
import { GamePage } from './pages/game/game.page.tsx';
import { GameBackupPage } from './pages/game-backup/game-backup.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme hasBackground={false}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<QuizzesListPage />} />
                    <Route path="/quiz/:quizId" element={<QuizPage />} />
                    <Route path="quiz/:gameId/play" element={<GamePage />} />
                    <Route path="quiz/:gameId/play/backup" element={<GameBackupPage />} />
                    <Route path="/login" element={<SignInPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </Theme>
    </StrictMode>
);
