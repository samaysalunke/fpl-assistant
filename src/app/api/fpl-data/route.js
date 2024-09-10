import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching FPL data:', error);
    return NextResponse.json({ error: 'Failed to fetch FPL data' }, { status: 500 });
  }
}