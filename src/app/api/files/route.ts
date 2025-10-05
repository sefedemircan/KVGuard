import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get processed files from database
    const files = await DatabaseService.getProcessedFiles(limit, offset);

    return NextResponse.json({
      success: true,
      files: files || [],
      count: files?.length || 0
    });

  } catch (error) {
    console.error('Files API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Dosyalar alınırken hata oluştu',
        files: []
      },
      { status: 500 }
    );
  }
}

