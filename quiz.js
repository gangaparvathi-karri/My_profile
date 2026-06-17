// Lightweight, dependency-free quiz engine.
// Each unit page defines a QUIZ array of {q, choices, correct, explain} and calls initQuiz('quiz-root', QUIZ).

function initQuiz(rootId, questions) {
  const root = document.getElementById(rootId);
  if (!root) return;

  let answered = new Array(questions.length).fill(null);

  function render() {
    root.innerHTML = '';

    questions.forEach((item, qIdx) => {
      const card = document.createElement('div');
      card.className = 'quiz-q';

      const qTitle = document.createElement('p');
      qTitle.className = 'quiz-question';
      qTitle.textContent = `${qIdx + 1}. ${item.q}`;
      card.appendChild(qTitle);

      const choiceWrap = document.createElement('div');
      choiceWrap.className = 'quiz-choices';

      item.choices.forEach((choice, cIdx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-choice';
        btn.textContent = choice;

        const state = answered[qIdx];
        if (state !== null) {
          btn.disabled = true;
          if (cIdx === item.correct) btn.classList.add('correct');
          else if (cIdx === state) btn.classList.add('incorrect');
        }

        btn.addEventListener('click', () => {
          answered[qIdx] = cIdx;
          render();
        });

        choiceWrap.appendChild(btn);
      });

      card.appendChild(choiceWrap);

      if (answered[qIdx] !== null) {
        const fb = document.createElement('p');
        fb.className = 'quiz-feedback';
        const correct = answered[qIdx] === item.correct;
        fb.innerHTML = (correct ? '<strong style="color:var(--good)">Correct.</strong> ' : '<strong style="color:var(--bad)">Not quite.</strong> ') + item.explain;
        card.appendChild(fb);
      }

      root.appendChild(card);
    });

    // score summary
    const total = questions.length;
    const done = answered.filter(a => a !== null).length;
    const correctCount = answered.filter((a, i) => a === questions[i].correct).length;

    const summary = document.createElement('div');
    summary.className = 'quiz-summary';
    if (done === total) {
      summary.innerHTML = `Score: <strong>${correctCount} / ${total}</strong> — ` +
        (correctCount === total ? 'great work, you\'ve got this unit down.' : 'review the explanations above and try the ones you missed.');
      const retry = document.createElement('button');
      retry.type = 'button';
      retry.className = 'quiz-retry';
      retry.textContent = 'Retry quiz';
      retry.addEventListener('click', () => {
        answered = new Array(questions.length).fill(null);
        render();
      });
      summary.appendChild(retry);
    } else {
      summary.innerHTML = `Answered ${done} / ${total}`;
    }
    root.appendChild(summary);
  }

  render();
}
