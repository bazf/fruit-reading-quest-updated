// Скрипти для ігор та інтеграції з мовною моделлю

// Приховуємо поля для введення, якщо параметри вже є в URL
function hideFieldsIfProvided() {
  const params = new URLSearchParams(window.location.search);
  const apiKeyFromURL = params.get('apiKey');
  const modelFromURL = params.get('model');

  const apiKeyField = document.getElementById('apiKey');
  const modelField = document.getElementById('model');
  const apiKeyLabel = apiKeyField ? apiKeyField.previousElementSibling : null;
  const modelLabel = modelField ? modelField.previousElementSibling : null;

  if (apiKeyFromURL && apiKeyFromURL.trim()) {
    if (apiKeyField) apiKeyField.style.display = 'none';
    if (apiKeyLabel) apiKeyLabel.style.display = 'none';
  }

  if (modelFromURL && modelFromURL.trim()) {
    if (modelField) modelField.style.display = 'none';
    if (modelLabel) modelLabel.style.display = 'none';
  }
}

// Викликаємо функцію після завантаження сторінки
window.addEventListener('DOMContentLoaded', hideFieldsIfProvided);

function checkScramble() {
  const input = document.getElementById('answer1').value.trim().toUpperCase();
  const resultEl = document.getElementById('result1');
  if (input === 'ЛИМОН') {
    resultEl.textContent = 'Правильно! Це ЛИМОН.';
    resultEl.className = 'result success';
  } else {
    resultEl.textContent = 'Спробуйте ще раз.';
    resultEl.className = 'result error';
  }
}

function checkApples() {
  const value = parseInt(document.getElementById('answer2').value, 10);
  const resultEl = document.getElementById('result2');
  if (!isNaN(value) && value === 2) {
    resultEl.textContent = 'Правильно! Залишилося 2 яблука.';
    resultEl.className = 'result success';
  } else {
    resultEl.textContent = 'Ні, спробуйте ще раз.';
    resultEl.className = 'result error';
  }
}

function checkRiddle() {
  const input = document.getElementById('answer3').value.trim().toLowerCase();
  const resultEl = document.getElementById('result3');
  if (input === 'груша' || input === 'груша.') {
    resultEl.textContent = 'Вірно! Загадка була про грушу.';
    resultEl.className = 'result success';
  } else {
    resultEl.textContent = 'Невірно, спробуйте ще.';
    resultEl.className = 'result error';
  }
}

function checkSynonym() {
  const value = document.getElementById('answer4').value;
  const resultEl = document.getElementById('result4');
  if (value === 'веселий') {
    resultEl.textContent = 'Чудово! "Веселий" — синонім до "радісний".';
    resultEl.className = 'result success';
  } else if (value) {
    resultEl.textContent = 'Це не той синонім. Спробуйте знову.';
    resultEl.className = 'result error';
  }
}

function checkProverb() {
  const value = document.getElementById('answer5').value;
  const resultEl = document.getElementById('result5');
  if (value === 'друг') {
    resultEl.textContent = 'Так! Книга — найкращий друг.';
    resultEl.className = 'result success';
  } else if (value) {
    resultEl.textContent = 'Не зовсім. Спробуйте ще раз.';
    resultEl.className = 'result error';
  }
}

function checkBerry() {
  const input = document.getElementById('answer6').value.trim().toLowerCase();
  const resultEl = document.getElementById('result6');
  if (input.includes('полуниц')) {
    resultEl.textContent = 'Саме так! Йдеться про полуницю.';
    resultEl.className = 'result success';
  } else {
    resultEl.textContent = 'Спробуйте ще раз, можливо ви пропустили літери.';
    resultEl.className = 'result error';
  }
}

async function generateStory() {
  // Зчитуємо параметри apiKey та model з URL (рядка запиту) або зі сторінки.
  const params = new URLSearchParams(window.location.search);
  let apiKey = params.get('apiKey') ? params.get('apiKey').trim() : (document.getElementById('apiKey') ? document.getElementById('apiKey').value.trim() : '');
  let model = params.get('model') ? params.get('model').trim() : (document.getElementById('model') ? document.getElementById('model').value.trim() : '');

  const prompt = document.getElementById('prompt').value.trim();
  const resultEl = document.getElementById('result7');
  const generateButton = document.querySelector('#game7 button');
  resultEl.className = 'result';

  // Переконуємося, що всі потрібні дані присутні
  if (!apiKey || !model || !prompt) {
    resultEl.innerHTML = 'Будь ласка, переконайтеся, що в URL або на сторінці вказано параметри apiKey та model, а також заповніть поле запиту.';
    resultEl.classList.add('error');
    return;
  }

  // Деактивуємо кнопку та показуємо спінер
  generateButton.disabled = true;
  generateButton.textContent = 'Створюється...';
  resultEl.innerHTML = '<div class="loading-spinner"><div class="spinner"></div>Генерація оповідання…</div>';
  resultEl.className = 'result';
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const payload = {
      system_instruction: {
        parts: [
          { text: "Ви — дитяча письмениця, яка створює захопливі та цікаві оповідання для дітей. Використовуйте просту мову, яскраві образи та емоції, щоб залучити маленьких читачів. Ваше завдання — створити цікаве оповідання на основі наданої теми та інструкцій. Завжди видавай лише оповідання!" }
        ]
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: `${prompt}` }]
        }
      ]
    };
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      throw new Error('Помилка запиту: ' + response.status);
    }
    const data = await response.json();
    // Обробляємо результат: очікується, що відповідь містить поле candidates з генерованими частинами
    const story = data.candidates && data.candidates.length > 0
      ? data.candidates[0].content.parts.map(part => part.text).join('')
      : 'Відповідь пуста.';
    resultEl.innerHTML = story;
    resultEl.className = 'result success';
  } catch (err) {
    console.error(err);
    resultEl.innerHTML = 'Не вдалося створити оповідання. Перевірте правильність API ключа та назви моделі.';
    resultEl.className = 'result error';
  } finally {
    // Повертаємо кнопку в активний стан
    generateButton.disabled = false;
    generateButton.textContent = 'Створити оповідання';
  }
}