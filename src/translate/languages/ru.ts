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
    'general.cancel': 'Отмена',
    'general.save': 'Сохранить',
    'general.create': 'Создать',
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
    'quiz.preparation.example':
        'Люблю лошадей. В детстве занимался(ась) конным спортом. Есть своя лошадь по имени Бэмби',
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
};

export type Translation = typeof ru;
