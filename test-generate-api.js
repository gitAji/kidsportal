const fetch = require('node-fetch');

async function run() {
  console.log("Sending request to generate-task endpoint...");
  const aiRes = await fetch('http://localhost:3000/api/generate-task', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gradeId: 'grade-1',
      subjectId: 'english',
      levelId: 'level-1',
      taskId: 'test-ai-task',
      childId: 'dummy-child-id'
    })
  });
  
  const text = await aiRes.text();
  console.log("Response Status:", aiRes.status);
  try {
    const data = JSON.parse(text);
    console.log("Success! Data:", JSON.stringify(data, null, 2));
  } catch(e) {
    console.log("Response text (not JSON):", text);
  }
}
run();
