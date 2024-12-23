import PocketBase from 'pocketbase';

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new Response(JSON.stringify({ error: 'No image URL provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Construct the full image URL based on your PocketBase setup
    const fullImageUrl = `${process.env.NEXT_PUBLIC_POCKETBASE_URL}/api/files/clubs/${imageUrl}`;

    // Fetch the image from PocketBase
    const imageResponse = await fetch(fullImageUrl);

    if (!imageResponse.ok) {
      throw new Error('Failed to fetch image from PocketBase');
    }

    // Get the image data
    const imageData = await imageResponse.arrayBuffer();

    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': imageResponse.headers.get('Content-Type'),
      },
    });
  } catch (error) {
    console.error('Error fetching image:', error);
    return new Response(JSON.stringify({ error: 'Error fetching image' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
