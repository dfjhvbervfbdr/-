(() => {
  const questions = [
    { question: 'Какой пароль безопаснее использовать для нескольких разных сайтов?', answers: ['Один удобный пароль везде', 'Уникальный длинный пароль для каждого сайта', 'Имя и дату рождения', 'Пароль из слова «password»'], correct: 1, explanation: 'Уникальные пароли не дают одной утечке открыть сразу несколько аккаунтов.' },
    { question: 'Что лучше сделать, если пришло неожиданное письмо со ссылкой «срочно подтвердить аккаунт»?', answers: ['Сразу нажать, чтобы аккаунт не заблокировали', 'Ответить отправителю и попросить пароль', 'Открыть сайт самостоятельно через официальный адрес и проверить уведомления там', 'Переслать письмо всем знакомым'], correct: 2, explanation: 'Перейдите на сайт самостоятельно, а не по ссылке из неожиданного сообщения.' },
    { question: 'Что означает HTTPS в адресе сайта?', answers: ['Сайт гарантированно безопасен и честен', 'Соединение браузера с сайтом шифруется', 'На устройстве включён VPN', 'Сайт не собирает данные'], correct: 1, explanation: 'HTTPS шифрует соединение, но сам по себе не гарантирует честность сайта.' },
    { question: 'Для чего обычно нужен VPN?', answers: ['Чтобы заменить антивирус', 'Чтобы скрыть любые действия в интернете от всех', 'Чтобы создать зашифрованное соединение до VPN-сервера', 'Чтобы автоматически удалить вредоносные программы'], correct: 2, explanation: 'VPN шифрует участок соединения от устройства до VPN-сервера.' },
    { question: 'Что следует сделать с одноразовым кодом входа?', answers: ['Сообщить его «службе поддержки», если позвонят', 'Опубликовать в личной переписке', 'Не передавать другим людям', 'Использовать вместо пароля на всех сайтах'], correct: 2, explanation: 'Одноразовый код предназначен только для вас. Не сообщайте его звонящим и пишущим людям.' },
    { question: 'Что такое фишинг?', answers: ['Способ сжатия файлов', 'Обманная попытка получить данные или заставить выполнить опасное действие', 'Тип резервного копирования', 'Программа для шифрования диска'], correct: 1, explanation: 'Фишинговые сообщения притворяются настоящими, чтобы выманить данные или побудить нажать опасную ссылку.' },
    { question: 'Какой подход безопаснее при установке приложения?', answers: ['Скачать файл из любого всплывающего окна', 'Устанавливать из официального магазина или сайта разработчика', 'Отключить обновления перед установкой', 'Запустить случайное вложение из письма'], correct: 1, explanation: 'Официальные источники снижают риск загрузки поддельного или вредоносного приложения.' },
    { question: 'Какую задачу помогает решить резервная копия?', answers: ['Не допустить любых фишинговых писем', 'Восстановить важные файлы при потере или повреждении оригинала', 'Скрыть IP-адрес', 'Заменить все обновления системы'], correct: 1, explanation: 'Резервная копия даёт возможность восстановить данные после поломки, потери или повреждения файлов.' },
    { question: 'Что происходит при шифровании данных?', answers: ['Данные превращаются в вид, который нельзя понять без ключа', 'Файлы автоматически удаляются', 'Устройство подключается к VPN', 'Пароль становится видимым всем пользователям'], correct: 0, explanation: 'Для чтения зашифрованных данных нужен подходящий ключ.' },
    { question: 'Где сохраняется результат теста CyberShield?', answers: ['В постоянной базе данных Render', 'В профиле VPN-провайдера', 'В localStorage текущего браузера', 'В общем файле для всех пользователей'], correct: 2, explanation: 'Результат хранится только в localStorage браузера и не отправляется на сервер.' }
  ];

  const startScreen = document.querySelector('#quiz-start');
  const questionScreen = document.querySelector('#quiz-question');
  const resultScreen = document.querySelector('#quiz-result');
  if (!startScreen || !questionScreen || !resultScreen) return;

  const startButton = document.querySelector('#start-quiz');
  const nextButton = document.querySelector('#next-question');
  const restartButton = document.querySelector('#restart-quiz');
  const quitButton = document.querySelector('#quit-quiz');
  const questionText = document.querySelector('#question-text');
  const answerList = document.querySelector('#answer-list');
  const feedback = document.querySelector('#answer-feedback');
  const counter = document.querySelector('#question-counter');
  const progressPercent = document.querySelector('#progress-percent');
  const progressBar = document.querySelector('#progress-bar');
  const progressTrack = document.querySelector('.progress-track');
  let questionIndex = 0;
  let score = 0;
  let answered = false;

  function loadLastResult() {
    const lastResult = document.querySelector('#last-result');
    if (!lastResult) return;
    try {
      const saved = JSON.parse(window.localStorage.getItem('cybershield:lastQuizResult') || 'null');
      if (!saved || !Number.isInteger(saved.score) || !Number.isInteger(saved.total)) return;
      const date = new Date(saved.date);
      const dateText = Number.isNaN(date.getTime()) ? '' : ` · ${new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(date)}`;
      lastResult.textContent = `Последний результат: ${saved.score} из ${saved.total}${dateText}`;
      lastResult.hidden = false;
    } catch {
      lastResult.hidden = true;
    }
  }

  function showScreen(screen) {
    startScreen.hidden = screen !== 'start';
    questionScreen.hidden = screen !== 'question';
    resultScreen.hidden = screen !== 'result';
  }

  function renderQuestion() {
    const item = questions[questionIndex];
    answered = false;
    feedback.textContent = '';
    nextButton.disabled = true;
    counter.textContent = `ВОПРОС ${questionIndex + 1} / ${questions.length}`;
    progressPercent.textContent = `${Math.round(((questionIndex + 1) / questions.length) * 100)}%`;
    progressBar.style.width = `${((questionIndex + 1) / questions.length) * 100}%`;
    progressTrack.setAttribute('aria-valuenow', String(questionIndex + 1));
    questionText.textContent = item.question;
    answerList.replaceChildren();

    item.answers.forEach((answer, index) => {
      const button = document.createElement('button');
      button.className = 'answer-option';
      button.type = 'button';
      button.dataset.answer = String(index);
      button.innerHTML = `<span class="answer-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span><span></span>`;
      button.querySelector('span:last-child').textContent = answer;
      button.addEventListener('click', () => selectAnswer(index));
      answerList.append(button);
    });

    showScreen('question');
    questionText.focus();
  }

  function selectAnswer(selectedIndex) {
    if (answered) return;
    answered = true;
    const item = questions[questionIndex];
    const isCorrect = selectedIndex === item.correct;
    if (isCorrect) score += 1;

    answerList.querySelectorAll('.answer-option').forEach((button) => {
      const index = Number(button.dataset.answer);
      button.disabled = true;
      if (index === item.correct) button.classList.add('is-correct');
      if (index === selectedIndex && !isCorrect) button.classList.add('is-wrong');
      if (index === selectedIndex) button.classList.add('is-selected');
    });

    feedback.textContent = `${isCorrect ? 'Верно.' : 'Не совсем.'} ${item.explanation}`;
    nextButton.disabled = false;
    nextButton.textContent = questionIndex === questions.length - 1 ? 'Показать результат' : 'Следующий вопрос →';
  }

  function finishQuiz() {
    document.querySelector('#score-value').textContent = String(score);
    const resultTitle = document.querySelector('#result-title');
    const resultMessage = document.querySelector('#result-message');
    if (score >= 8) {
      resultTitle.textContent = 'Отличный результат!';
      resultMessage.textContent = 'Ты хорошо знаешь основы. Продолжай применять эти привычки в сети.';
    } else if (score >= 5) {
      resultTitle.textContent = 'Хорошая работа!';
      resultMessage.textContent = 'Базовые знания уже есть. Изучи темы, где хочется увереннее ориентироваться.';
    } else {
      resultTitle.textContent = 'Есть что изучить';
      resultMessage.textContent = 'Это хорошее начало. Пройди учебные темы и попробуй ещё раз.';
    }
    try {
      window.localStorage.setItem('cybershield:lastQuizResult', JSON.stringify({ score, total: questions.length, date: new Date().toISOString() }));
    } catch {
      document.querySelector('.result-saved').textContent = 'Браузер не разрешил сохранить результат на этом устройстве.';
    }
    showScreen('result');
    resultTitle.focus?.();
  }

  function startQuiz() {
    questionIndex = 0;
    score = 0;
    renderQuestion();
  }

  startButton.addEventListener('click', startQuiz);
  restartButton.addEventListener('click', startQuiz);
  quitButton.addEventListener('click', () => {
    showScreen('start');
    loadLastResult();
    startButton.focus();
  });
  nextButton.addEventListener('click', () => {
    if (!answered) return;
    if (questionIndex === questions.length - 1) {
      finishQuiz();
      return;
    }
    questionIndex += 1;
    renderQuestion();
  });

  loadLastResult();
})();
