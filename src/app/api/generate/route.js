export async function POST(request) {
    try {
      // Get data from the request
      const { prompt, styles } = await request.json();
      
      // Create the enhanced prompt
      const stylePrompt = styles
        .sort((a, b) => b.weight - a.weight)
        .map(style => `${Math.round(style.weight)}% ${style.name}`)
        .join(", ");
      
      const enhancedPrompt = `${prompt}. Style: ${stylePrompt}`;
      
      // Call Replicate API
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
              prompt: enhancedPrompt,
              negative_prompt: "low quality, bad anatomy, distorted, blurry",
              num_outputs: 4
            },
          }),
        }
      );
      
      const prediction = await response.json();
      return new Response(JSON.stringify(prediction), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }