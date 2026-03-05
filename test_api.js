fetch("http://localhost:3000/api/chat", {
  method: "POST",
  body: JSON.stringify({ message: "Hello!" }),
  headers: { "Content-Type": "application/json" }
}).then(r => r.json()).then(console.log).catch(console.error);
