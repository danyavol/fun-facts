import { ruPluralText } from '../../utils/plural.ts';

export const ru = {
    'auth.email': 'Эл. почта',
    'auth.password': 'Пароль',
    'auth.password.confirm': 'Подтвердить пароль',
    'auth.create-account': 'Создать аккаунт',
    'auth.already-have-account': 'Есть аккаунт?',
    'auth.log-in': 'Войти',
    'auth.guest': 'Гость',
    'auth.log-out': 'Выйти',
    'auth.or': 'ИЛИ',
    'auth.via-google': 'Войти через Google',
    'auth.as-guest': 'Войти как Гость',
    'auth.error.invalid-email': 'Неверный адрес эл. почты',
    'auth.error.invalid-credentials': 'Неверная эл. почта или пароль',
    'auth.error.weak-password': 'Слишком слабый пароль',
    'auth.error.unknown-error': 'Произошла неизвестная ошибка',
    'general.next': 'Далее',
    'general.cancel': 'Отмена',
    'general.save': 'Сохранить',
    'general.create': 'Создать',
    'general.delete': 'Удалить',
    'quizzes-list.your-quizzes': 'Твои квизы',
    'quizzes-list.create-quiz': 'Создать квиз',
    'quizzes-list.create-quiz.disabled-tooltip': 'Гости не могут создавать новые квизы',
    'quizzes-list.empty-state': 'Ты не участвуешь ни в одном квизе. Создай новый или попроси друга поделиться ссылкой',
    'quiz.status.preparation': 'Подготовка',
    'quiz.status.started': 'Квиз начался!',
    'quiz.status.ended': 'Квиз окончен',
    'quiz.your-facts': 'Твои факты:',
    'quiz.stage': 'Этап:',
    'quiz.total-facts-number': 'Всего фактов в квизе:',
    'quiz.ended.notification': 'Квиз уже окончен 🥺',
    'quiz.ended.results': 'Результаты',
    'quiz.started.notification.beginning': 'Квиз уже начался! Переходи',
    'quiz.started.notification.link': 'по ссылке',
    'quiz.started.notification.ending': 'и участвуй!',
    'quiz.preparation.explanation':
        'Придумай что-нибудь интересное или необычное о себе. Во время квиза участники будут угадывать кому принадлежит факт. Поэтому не указывай своё имя и пол в фактах 😉. Пример:',
    'quiz.preparation.example': 'Коллекционирую почтовые марки со всего мира',
    'quiz.preparation.no-facts-added-yet': 'Ты не добавил еще ни одного факта',
    'quiz.add-n-more-facts.beginning': 'Пожалуйста, добавь еще',
    'quiz.add-n-more-facts.ending': (facts: number) => {
        const factsText = ruPluralText(facts, {
            one: 'интересный факт',
            few: 'интересных факта',
            many: 'интересных фактов',
        });
        return factsText + ' о себе.';
    },
    'quiz.delete.title': 'Удалить квиз',
    'quiz.delete.description': (name: string) => `Ты уверен, что хочешь удалить "${name}" квиз?`,
    'quiz.status-change.title': 'Изменить этап',
    'quiz.status-change.beginning': 'Изменение статуса на',
    'quiz.status-change.to.preparation': 'откроет участникам возможность менять свои факты.',
    'quiz.status-change.to.started': 'запретит участникам менять свои факты и начнет квиз.',
    'quiz.status-change.to.ended': 'завершит квиз.',
    'quiz.status-change.confirm.text': 'Ты уверен, что хочешь изменить этап квиза?',
    'quiz.status-change.confirm.button': 'Изменить',
    'fact.placeholder': 'Напиши что-нибудь о себе',
    'fact.new': 'Добавить факт',
    'fact.validation': 'Факт должен быть больше 0 и меньше 250 символов',
    'fact.image.add': 'Добавить фото',
    'fact.image.empty': 'Фото отсутствует',
    'fact.image.max-size': 'Максимальный размер картинки 5МБ',
    'fact.number': (facts: number) =>
        ruPluralText(facts, {
            one: 'факт',
            few: 'факта',
            many: 'фактов',
        }),
    'quiz-form.new': 'Создать новый квиз',
    'quiz-form.edit': 'Изменить квиз',
    'quiz-form.quiz-title': 'Название',
    'quiz-form.quiz-title.placeholder': 'Введи название квиза',
    'quiz-form.players.title': 'Имена игроков',
    'quiz-form.players.description': 'Используются в качестве ответов в квизе',
    'quiz-form.players.max': (players: number) =>
        ruPluralText(players, {
            one: `Максимум ${players} игрок`,
            few: `Максимум ${players} игрока`,
            many: `Максимум ${players} игроков`,
        }),
    'quiz-form.players.placeholder': 'Введи имя',
    'quiz-form.facts-limit.title': 'Лимит фактов для игрока',
    'quiz-form.facts-limit.min-value-notification': 'Нельзя уменьшать после создания квиза',
    'quiz-form.estimated-game-time.title': 'Длительность игры около',
    'quiz-form.estimated-game-time.minutes': `минут`,
    'game.me': 'Я',
    'game.registration.title.quiz-started': 'Квиз уже начался!',
    'game.registration.title.quiz-registration': 'Квиз скоро начнется!',
    'game.registration.select-yourself': 'Выбери своё имя из списка:',
    'game.registration.ready': 'Готов',
    'game.registration.not-ready': 'Не готов',
    'game.registration.start': 'Начать квиз',
    'game.fact-view.fact': 'Факт',
    'game.fact-view.fact.out-of': 'из',
    'game.fact-view.voting-ended': 'Голосование окончено!',
    'game.fact-view.voting-ended.hint': 'Самое время признаться чей это факт на самом деле 😉',
    'game.fact-view.voting-ended.correct': 'Правильно! 🥳',
    'game.fact-view.voting-ended.incorrect': 'Неправильно 😿',
    'game.fact-view.voting-ended.no-vote': 'Ты не проголосовал',
    'game.fact-view.choose-answer': 'Выбери чей это факт',
    'game.fact-view.your-own-fact-hint':
        '* Если это твой факт, выбери любой ответ, это не повлияет на количество заработанных очков',
    'game.fact-results.title': 'Выбери правильный ответ',
    'game.fact-results.unknown-answer': 'Неизвестно',
    'game.fact-results.next.confirm': 'Ты уверен?',
    'game.fact-results.end-quiz': 'Завершить квиз',
    'game.results.title': 'Результаты',
    'game.results.table.position': '№',
    'game.results.table.name': 'Имя',
    'game.results.table.score': 'Очки',
    'error.time-sync-failed':
        'Не удалось синхронизировать время. Возможны задержки в игре. Попробуй перезагрузить страницу',
};

export type Translation = typeof ru;
