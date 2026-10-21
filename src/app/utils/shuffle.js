// Fisher-Yates — never mutates the input array.
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Shuffles question order and, for multiple-choice questions, their option
// order too. Scoring compares by value (correctAnswer text), never by
// position, so reordering options is always safe.
export function shuffleQuestions(questions) {
  return shuffleArray(questions || []).map(q =>
    q?.options ? { ...q, options: shuffleArray(q.options) } : q
  );
}

// Re-applies a previously saved question order (by questionId) so a page
// refresh mid-attempt resumes the same shuffle the student already saw,
// instead of desyncing their saved currentQuestionIndex from a fresh
// shuffle. Falls back to the task unchanged if the saved order doesn't
// cleanly cover every current question (e.g. AI-generated questions with
// no questionId, or content that changed since the order was saved).
export function applySavedQuestionOrder(task, savedOrder) {
  if (!savedOrder || !task?.questions?.length) return task;
  const byId = new Map(task.questions.map(q => [q.questionId, q]));
  const reordered = savedOrder.map(id => byId.get(id)).filter(Boolean);
  if (reordered.length !== task.questions.length) return task;
  return { ...task, questions: reordered };
}
