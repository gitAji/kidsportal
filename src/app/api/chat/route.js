export const POST = async (req) => {
  try {
    const { message } = await req.json();

    // Detect whether running on Netlify or local
    const isLocal = process.env.NODE_ENV === "development";

    const endpoint = isLocal
      ? "http://localhost:8888/.netlify/functions/chat" // when running locally with `netlify dev`
      : "/.netlify/functions/chat"; // works on deployed Netlify site

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ response: data.response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("route.js error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
