import { createClient } from '@supabase/supabase-js';
import { ProcessedFile, AuditLog, Statistics } from './models';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      processed_files: {
        Row: {
          id: string;
          file_name: string;
          file_type: string;
          file_size: number;
          upload_date: string;
          processed_date: string;
          original_text: string;
          masked_text: string;
          detected_data: any; // JSON field
          user_id: string | null;
          status: 'processing' | 'completed' | 'error';
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_type: string;
          file_size: number;
          upload_date?: string;
          processed_date?: string;
          original_text: string;
          masked_text: string;
          detected_data: any;
          user_id?: string | null;
          status?: 'processing' | 'completed' | 'error';
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          file_type?: string;
          file_size?: number;
          upload_date?: string;
          processed_date?: string;
          original_text?: string;
          masked_text?: string;
          detected_data?: any;
          user_id?: string | null;
          status?: 'processing' | 'completed' | 'error';
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          file_id: string;
          file_name: string;
          data_type: string;
          original_value: string;
          masked_value: string;
          detection_method: 'regex' | 'nlp' | 'hybrid';
          confidence: number;
          user_id: string | null;
          timestamp: string;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_id: string;
          file_name: string;
          data_type: string;
          original_value: string;
          masked_value: string;
          detection_method: 'regex' | 'nlp' | 'hybrid';
          confidence: number;
          user_id?: string | null;
          timestamp?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          file_id?: string;
          file_name?: string;
          data_type?: string;
          original_value?: string;
          masked_value?: string;
          detection_method?: 'regex' | 'nlp' | 'hybrid';
          confidence?: number;
          user_id?: string | null;
          timestamp?: string;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      statistics: {
        Row: {
          id: string;
          date: string;
          total_files_processed: number;
          total_data_detected: number;
          data_type_breakdown: any; // JSON field
          average_confidence: number;
          processing_time_ms: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          total_files_processed: number;
          total_data_detected: number;
          data_type_breakdown: any;
          average_confidence: number;
          processing_time_ms: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          total_files_processed?: number;
          total_data_detected?: number;
          data_type_breakdown?: any;
          average_confidence?: number;
          processing_time_ms?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Typed Supabase client
export const typedSupabase = createClient(supabaseUrl, supabaseKey);

  // Helper functions for database operations
export class DatabaseService {
  // Processed Files operations
  static async createProcessedFile(file: Omit<ProcessedFile, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await typedSupabase
      .from('processed_files')
      .insert({
        file_name: file.fileName,
        file_type: file.fileType,
        file_size: file.fileSize,
        upload_date: file.uploadDate.toISOString(),
        processed_date: file.processedDate.toISOString(),
        original_text: file.originalText,
        masked_text: file.maskedText,
        detected_data: file.detectedData,
        user_id: file.userId || null,
        status: file.status,
        error_message: file.errorMessage || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProcessedFile(id: string) {
    const { data, error } = await typedSupabase
      .from('processed_files')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  static async updateProcessedFile(id: string, updates: Partial<ProcessedFile>) {
    const updateData: any = {};
    
    if (updates.fileName) updateData.file_name = updates.fileName;
    if (updates.status) updateData.status = updates.status;
    if (updates.errorMessage !== undefined) updateData.error_message = updates.errorMessage;
    if (updates.maskedText) updateData.masked_text = updates.maskedText;
    if (updates.detectedData) updateData.detected_data = updates.detectedData;
    if (updates.processedDate) updateData.processed_date = updates.processedDate.toISOString();
    
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await typedSupabase
      .from('processed_files')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getProcessedFiles(limit = 50, offset = 0) {
    const { data, error } = await typedSupabase
      .from('processed_files')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data;
  }

  // Audit Logs operations
  static async createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>) {
    const { data, error } = await typedSupabase
      .from('audit_logs')
      .insert({
        file_id: log.fileId.toString(),
        file_name: log.fileName,
        data_type: log.dataType,
        original_value: log.originalValue,
        masked_value: log.maskedValue,
        detection_method: log.detectionMethod,
        confidence: log.confidence,
        user_id: log.userId || null,
        timestamp: log.timestamp.toISOString(),
        ip_address: log.ipAddress || null,
        user_agent: log.userAgent || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAuditLogs(fileId?: string, limit = 100, offset = 0) {
    let query = typedSupabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (fileId) {
      query = query.eq('file_id', fileId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Statistics operations
  static async createOrUpdateStatistics(stats: Omit<Statistics, 'id' | 'createdAt' | 'updatedAt'>) {
    const dateStr = stats.date.toISOString().split('T')[0]; // YYYY-MM-DD format

    // First try to get existing record for the date
    const { data: existing } = await typedSupabase
      .from('statistics')
      .select('*')
      .eq('date', dateStr)
      .single();

    if (existing) {
      // Update existing record
      const { data, error } = await typedSupabase
        .from('statistics')
        .update({
          total_files_processed: stats.totalFilesProcessed,
          total_data_detected: stats.totalDataDetected,
          data_type_breakdown: stats.dataTypeBreakdown,
          average_confidence: stats.averageConfidence,
          processing_time_ms: stats.processingTimeMs,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new record
      const { data, error } = await typedSupabase
        .from('statistics')
        .insert({
          date: dateStr,
          total_files_processed: stats.totalFilesProcessed,
          total_data_detected: stats.totalDataDetected,
          data_type_breakdown: stats.dataTypeBreakdown,
          average_confidence: stats.averageConfidence,
          processing_time_ms: stats.processingTimeMs,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  static async getStatistics(startDate?: Date, endDate?: Date) {
    let query = typedSupabase
      .from('statistics')
      .select('*')
      .order('date', { ascending: false });

    if (startDate) {
      query = query.gte('date', startDate.toISOString().split('T')[0]);
    }
    
    if (endDate) {
      query = query.lte('date', endDate.toISOString().split('T')[0]);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async getStatisticsSummary() {
    const { data, error } = await typedSupabase
      .from('statistics')
      .select('*')
      .order('date', { ascending: false })
      .limit(30); // Son 30 günlük veri

    if (error) throw error;
    return data;
  }

  // Toplam işlenen dosya sayısını direkt processed_files tablosundan al
  static async getTotalProcessedFilesCount() {
    const { count, error } = await typedSupabase
      .from('processed_files')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (error) throw error;
    return count || 0;
  }
}
