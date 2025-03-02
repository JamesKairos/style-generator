export async function GET(request) {
    const { searchParams } = new URL(request.url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const id = searchParams.get('id');
    
    // For testing, return mock data with better placeholder URLs
    return new Response(JSON.stringify({
      status: "succeeded",
      output: [
        "https://placehold.co/400x400/gray/white?text=Style+Mix+1",
        "https://placehold.co/400x400/gray/white?text=Style+Mix+2",
        "https://placehold.co/400x400/gray/white?text=Style+Mix+3",
        "https://placehold.co/400x400/gray/white?text=Style+Mix+4"
      ]
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }