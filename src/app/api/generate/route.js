export async function POST(request) {
    try {
      // Get data from the request
      const data = await request.json();
      const { prompt, styles } = data;
      
      // Create enhanced prompt with style information
      const stylePrompt = styles
        .sort((a, b) => b.weight - a.weight)
        .map(style => `${Math.round(style.weight)}% ${style.name}`)
        .join(", ");
      
      const enhancedPrompt = `${prompt}. Style: ${stylePrompt}`;
      console.log("Sending prompt to Replicate:", enhancedPrompt);
      
      // Call Replicate API with the SD 3.5 Large model
      const response = await fetch(
        "https://api.replicate.com/v1/predictions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          },
          body: JSON.stringify({
            // Updated to Stable Diffusion 3.5 Large model
            version: "stability-ai/stable-diffusion-3.5-large:6ec12be2a7e14876c026debdf959fb34979c6e521a5ab7da41e97c042c172855",
            input: {
              prompt: enhancedPrompt,
              width: 1024,
              height: 1024,
              num_outputs: 4
            },
          }),
        }
      );
      
      const prediction = await response.json();
      
      // Add debugging
      console.log("Replicate API response:", JSON.stringify(prediction));
      
      // Check if there's an error in the API response
      if (prediction.error) {
        console.error("Replicate API error:", prediction.error);
        return new Response(JSON.stringify({ error: prediction.error }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(prediction), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("API error:", error);
      return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }