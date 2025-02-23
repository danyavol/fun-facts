import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import './index.scss';
import './firebase.ts';
import './utils/time-sync.ts';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import styles from './main.module.scss';

import { QuizzesListPage } from './pages/quizzes-list/quizzes-list.page.tsx';
import { QuizPage } from './pages/quiz/quiz.page.tsx';
import { SignInPage } from './pages/sign-in/sign-in.page.tsx';
import { GamePage } from './pages/game/game.page.tsx';
import { GameBackupPage } from './pages/game-backup/game-backup.tsx';
import * as Toast from '@radix-ui/react-toast';
import { ToastViewport } from '@radix-ui/react-toast';
import { AuthGuard } from './guards/auth.guard.tsx';
import { UnAuthGuard } from './guards/unauth.guard.tsx';
import { CreateAccountPage } from './pages/create-account/create-account-page.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme hasBackground={false}>
            <Toast.Provider>
                <BrowserRouter>
                    <Routes>
                        {/* Auth Routes*/}
                        <Route path="/" element={<AuthGuard component={() => <QuizzesListPage />} />} />
                        <Route path="/quiz/:quizId" element={<AuthGuard component={() => <QuizPage />} />} />
                        <Route path="quiz/:gameId/play" element={<AuthGuard component={() => <GamePage />} />} />
                        <Route
                            path="quiz/:gameId/play/backup"
                            element={<AuthGuard component={() => <GameBackupPage />} />}
                        />
                        {/* UnAuth routes */}
                        <Route path="/login" element={<UnAuthGuard component={() => <SignInPage />} />} />
                        <Route
                            path="/create-account"
                            element={<UnAuthGuard component={() => <CreateAccountPage />} />}
                        />
                        {/* Wildcard*/}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
                <ToastViewport className={styles.toast} />
            </Toast.Provider>
        </Theme>
    </StrictMode>
);
