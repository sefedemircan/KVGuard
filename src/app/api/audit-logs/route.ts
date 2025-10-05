import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    const limit = parseInt(searchParams.get('limit') || '100');

    // getAuditLogs fileId opsiyonel olduğu için tek fonksiyon yeterli
    const logs = await DatabaseService.getAuditLogs(fileId || undefined, limit);

    return NextResponse.json({
      success: true,
      logs: logs || [],
      count: logs?.length || 0
    });

  } catch (error) {
    console.error('Audit logs API error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Audit logları alınırken hata oluştu',
        logs: []
      },
      { status: 500 }
    );
  }
}

