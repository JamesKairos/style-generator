export async function POST(request) {
    try {
      // Get data from the request
      const data = await request.json();
      // We'll use this variable later when uncommenting
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { prompt } = data;
      
      // For testing, return mock data
      return new Response(JSON.stringify({
        id: "test-prediction-id-" + Date.now(),
        status: "starting"
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
      
      /* Uncomment this when ready to connect to Replicate
      const response = await fetch(
        "https://api.replicate.com/v1/predictions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
          body: JSON.stringify({
            version: "stability-ai/sdxl:8beff3369e81422112d93b89ca01426147de542cd4684c244b673b105188fe5f",
            input: {
              prompt: prompt,
              num_outputs: 4
            },
          }),
        }
      );
      
      const prediction = await response.json();
      return new Response(JSON.stringify(prediction), {
        headers: { 'Content-Type': 'application/json' }
      });
      */
    } catch (error) {
      console.error("API error:", error);
      return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }