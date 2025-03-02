export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Missing prediction ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
    try {
      const response = await fetch(
        `https://api.replicate.com/v1/predictions/${id}`,
        {
          headers: {
            Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      const prediction = await response.json();
      return new Response(JSON.stringify(prediction), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }