// Скрипти для ігор та інтеграції з мовною моделлю

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
  // Зчитуємо параметри apiKey та model з URL (рядка запиту).
  const params = new URLSearchParams(window.location.search);
  const apiKey = params.get('apiKey') ? params.get('apiKey').trim() : '';
  const model = params.get('model') ? params.get('model').trim() : '';
  const prompt = document.getElementById('prompt').value.trim();
  const resultEl = document.getElementById('result7');
  resultEl.className = 'result';
  // Переконуємося, що всі потрібні дані присутні
  if (!apiKey || !model || !prompt) {
    resultEl.textContent = 'Будь ласка, переконайтеся, що в URL вказано параметри apiKey та model, а також заповніть поле запиту.';
    resultEl.classList.add('error');
    return;
  }
  resultEl.textContent = 'Генерація оповідання…';
  try {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const payload = {
      contents: [
        {
          role: 'user',
          parts: [ { text: prompt } ]
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
    resultEl.textContent = story;
    resultEl.className = 'result success';
  } catch (err) {
    console.error(err);
    resultEl.textContent = 'Не вдалося створити оповідання. Перевірте правильність API ключа та назви моделі.';
    resultEl.className = 'result error';
  }
}