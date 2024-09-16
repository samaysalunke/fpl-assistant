import { NextResponse } from 'next/server';

const RATE_LIMIT = 10; // number of requests
const TIME_FRAME = 60 * 1000; // 1 minute in milliseconds

let requestCount = 0;
let lastRequestTime = Date.now();

export async function GET(request) {
  console.log('FPL proxy request received');
  const currentTime = Date.now();
  if (currentTime - lastRequestTime > TIME_FRAME) {
    requestCount = 0;
    lastRequestTime = currentTime;
  }

  if (requestCount >= RATE_LIMIT) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  requestCount++;

  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  console.log(`Proxying request to: ${url}`);

  
  if (!url) {
    console.log('URL parameter is missing');
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log(`Fetching data from FPL API: ${url}`);
    const response = await fetch(`https://fantasy.premierleague.com/api/${url}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log(`FPL API response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`FPL API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Successfully fetched and parsed data from FPL API');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in FPL proxy:', error);
    return NextResponse.json({ error: 'Failed to fetch data from FPL API', details: error.message }, { status: 500 });
  }
}