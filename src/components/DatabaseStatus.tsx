'use client';

import { useState, useEffect } from 'react';
import { Card, Text, Badge, Group, Stack, Button, Alert } from '@mantine/core';
import { IconDatabase, IconCheck, IconX, IconRefresh } from '@tabler/icons-react';
import { DatabaseService } from '@/lib/supabase';

interface DatabaseStatusProps {}

interface StatusInfo {
  connected: boolean;
  tablesExist: boolean;
  lastProcessedFile?: any;
  totalFiles: number;
  error?: string;
}

export function DatabaseStatus({}: DatabaseStatusProps) {
  const [status, setStatus] = useState<StatusInfo>({
    connected: false,
    tablesExist: false,
    totalFiles: 0
  });
  const [loading, setLoading] = useState(true);

  const checkDatabaseStatus = async () => {
    setLoading(true);
    try {
      // Test database connection and get recent files
      const files = await DatabaseService.getProcessedFiles(1);
      const stats = await DatabaseService.getStatisticsSummary();
      
      setStatus({
        connected: true,
        tablesExist: true,
        lastProcessedFile: files && files.length > 0 ? files[0] : null,
        totalFiles: stats && stats.length > 0 ? stats.reduce((sum, s) => sum + s.total_files_processed, 0) : 0
      });
    } catch (error) {
      console.error('Database status check failed:', error);
      setStatus({
        connected: false,
        tablesExist: false,
        totalFiles: 0,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="md">
        <Group justify="space-between">
          <Group gap="xs">
            <IconDatabase size={20} color="var(--mantine-color-blue-6)" />
            <Text fw={500} c="blue">Veritabanı Durumu</Text>
          </Group>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconRefresh size={14} />}
            onClick={checkDatabaseStatus}
            loading={loading}
            color="blue"
          >
            Yenile
          </Button>
        </Group>
      </Card.Section>

      <Card.Section inheritPadding py="lg">
        <Stack gap="sm">
          {status.error ? (
            <Alert color="red" icon={<IconX size={16} />}>
              <Text size="sm">{status.error}</Text>
            </Alert>
          ) : (
            <>
              <Group justify="space-between">
                <Text size="sm">Bağlantı Durumu:</Text>
                <Badge 
                  color={status.connected ? 'green' : 'red'}
                  leftSection={status.connected ? <IconCheck size={12} /> : <IconX size={12} />}
                >
                  {status.connected ? 'Bağlı' : 'Bağlantı Yok'}
                </Badge>
              </Group>

              <Group justify="space-between">
                <Text size="sm">Tablolar:</Text>
                <Badge 
                  color={status.tablesExist ? 'green' : 'red'}
                  leftSection={status.tablesExist ? <IconCheck size={12} /> : <IconX size={12} />}
                >
                  {status.tablesExist ? 'Mevcut' : 'Bulunamadı'}
                </Badge>
              </Group>

              <Group justify="space-between">
                <Text size="sm">Toplam İşlenen Dosya:</Text>
                <Badge variant="light" color="blue">
                  {status.totalFiles}
                </Badge>
              </Group>

              {status.lastProcessedFile && (
                <Group justify="space-between">
                  <Text size="sm">Son İşlenen:</Text>
                  <Text size="xs" c="dimmed">
                    {status.lastProcessedFile.file_name}
                  </Text>
                </Group>
              )}
            </>
          )}
        </Stack>
      </Card.Section>
    </Card>
  );
}
