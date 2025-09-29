import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Test API failed' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    return NextResponse.json({
      success: true,
      message: 'POST method working',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test POST API error:', error);
    return NextResponse.json(
      { error: 'Test POST API failed' },
      { status: 500 }
    );
  }
}
