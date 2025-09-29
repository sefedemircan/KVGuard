import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');
    const type = searchParams.get('type') || 'summary';

    let startDate: Date | undefined;
    let endDate: Date | undefined;

    if (startDateParam) {
      startDate = new Date(startDateParam);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json(
          { error: 'Geçersiz başlangıç tarihi' },
          { status: 400 }
        );
      }
    }

    if (endDateParam) {
      endDate = new Date(endDateParam);
      if (isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Geçersiz bitiş tarihi' },
          { status: 400 }
        );
      }
    }

    let statistics;
    
    if (type === 'summary') {
      // Son 30 günlük özet istatistikler
      statistics = await DatabaseService.getStatisticsSummary();
    } else {
      // Tarih aralığına göre istatistikler
      statistics = await DatabaseService.getStatistics(startDate, endDate);
    }

    // İstatistikleri işle ve özet bilgiler hazırla
    const processedStats = processStatistics(statistics);

    return NextResponse.json({
      success: true,
      data: statistics,
      summary: processedStats,
      period: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        type
      }
    });

  } catch (error) {
    console.error('Statistics API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'İstatistikler alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

function processStatistics(stats: any[]) {
  if (!stats || stats.length === 0) {
    return {
      totalFiles: 0,
      totalDataDetected: 0,
      averageConfidence: 0,
      averageProcessingTime: 0,
      topDataTypes: [],
      dailyTrends: []
    };
  }

  const totalFiles = stats.reduce((sum, stat) => sum + stat.total_files_processed, 0);
  const totalDataDetected = stats.reduce((sum, stat) => sum + stat.total_data_detected, 0);
  
  // Ağırlıklı ortalama güven skoru
  const weightedConfidenceSum = stats.reduce((sum, stat) => 
    sum + (stat.average_confidence * stat.total_files_processed), 0);
  const averageConfidence = totalFiles > 0 ? weightedConfidenceSum / totalFiles : 0;

  // Ağırlıklı ortalama işlem süresi
  const weightedProcessingTimeSum = stats.reduce((sum, stat) => 
    sum + (stat.processing_time_ms * stat.total_files_processed), 0);
  const averageProcessingTime = totalFiles > 0 ? weightedProcessingTimeSum / totalFiles : 0;

  // Veri türü toplamları
  const dataTypeAggregation: { [key: string]: number } = {};
  stats.forEach(stat => {
    if (stat.data_type_breakdown) {
      Object.entries(stat.data_type_breakdown).forEach(([type, count]) => {
        dataTypeAggregation[type] = (dataTypeAggregation[type] || 0) + (count as number);
      });
    }
  });

  // En çok tespit edilen veri türleri
  const topDataTypes = Object.entries(dataTypeAggregation)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Günlük trendler (son 7 günü göster)
  const dailyTrends = stats
    .slice(-7)
    .map(stat => ({
      date: stat.date,
      filesProcessed: stat.total_files_processed,
      dataDetected: stat.total_data_detected,
      averageConfidence: stat.average_confidence,
      processingTime: stat.processing_time_ms
    }));

  return {
    totalFiles,
    totalDataDetected,
    averageConfidence: Math.round(averageConfidence * 100) / 100,
    averageProcessingTime: Math.round(averageProcessingTime),
    topDataTypes,
    dailyTrends,
    dataTypeBreakdown: dataTypeAggregation
  };
}
