export const db = {
  grades: [
    { id: 1, name: "Grade 1" },
    { id: 2, name: "Grade 2" },
    { id: 3, name: "Grade 3" },
    { id: 4, name: "Grade 4" },
  ],
  subjects: [
    // Grade 1
    { id: "math", name: "Math", gradeId: 1 },
    { id: "english", name: "English", gradeId: 1 },
    { id: "tamil", name: "Tamil", gradeId: 1 },
    { id: "ariviyal", name: "Ariviyal", gradeId: 1 },
    // Grade 2
    { id: "math", name: "Math", gradeId: 2 },
    { id: "english", name: "English", gradeId: 2 },
    { id: "tamil", name: "Tamil", gradeId: 2 },
    { id: "ariviyal", name: "Ariviyal", gradeId: 2 },
    // Grade 3
    { id: "math", name: "Math", gradeId: 3 },
    { id: "english", name: "English", gradeId: 3 },
    { id: "tamil", name: "Tamil", gradeId: 3 },
    { id: "ariviyal", name: "Ariviyal", gradeId: 3 },
    // Grade 4
    { id: "math", name: "Math", gradeId: 4 },
    { id: "english", name: "English", gradeId: 4 },
    { id: "tamil", name: "Tamil", gradeId: 4 },
    { id: "ariviyal", name: "Ariviyal", gradeId: 4 },
  ],
  levels: Array.from({ length: 4 * 4 * 12 }, (_, i) => {
    const gradeId = Math.floor(i / 48) + 1;
    const subjectIndex = Math.floor((i % 48) / 12);
    const level = (i % 12) + 1;
    const subjectId = ["math", "english", "tamil", "ariviyal"][subjectIndex];
    return {
      id: `${gradeId}-${subjectId}-${level}`,
      gradeId,
      subjectId,
      level,
    };
  }),
  tasks: Array.from({ length: 4 * 4 * 12 * 2 }, (_, i) => {
    const gradeId = Math.floor(i / 96) + 1;
    const subjectIndex = Math.floor((i % 96) / 24);
    const level = Math.floor((i % 24) / 2) + 1;
    const task = (i % 2) + 1;
    const subjectId = ["math", "english", "tamil", "ariviyal"][subjectIndex];
    return {
      id: `task${task}`,
      title: `Task ${task}`,
      levelId: level,
      subjectId,
      gradeId,
      question: `This is a placeholder question for Grade ${gradeId}, ${subjectId}, Level ${level}, Task ${task}.`,
      options: ["Option 1", "Option 2", "Option 3"],
      answer: "Option 1",
    };
  }),
};