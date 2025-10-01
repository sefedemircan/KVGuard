'use client';

import { useState, useEffect } from 'react';
import { Card, Text, Badge, Group, Stack, Button, Alert, Paper, ThemeIcon, Divider, useMantineColorScheme } from '@mantine/core';
import { IconDatabase, IconCheck, IconX, IconRefresh, IconTrendingUp } from '@tabler/icons-react';
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
  const { colorScheme } = useMantineColorScheme();
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
      
      // Eğer statistics tablosu boşsa, direkt processed_files tablosundan say
      let totalFiles = 0;
      if (stats && stats.length > 0) {
        totalFiles = stats.reduce((sum, s) => sum + s.total_files_processed, 0);
      } else {
        // Statistics tablosu boşsa, direkt processed_files tablosundan toplam sayıyı al
        totalFiles = await DatabaseService.getTotalProcessedFilesCount();
      }
      
      setStatus({
        connected: true,
        tablesExist: true,
        lastProcessedFile: files && files.length > 0 ? files[0] : null,
        totalFiles: totalFiles
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
    <Paper
      p="xl"
      radius="xl"
      shadow="lg"
      style={{
        background: colorScheme === 'dark' 
          ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
          : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Group gap="md">
            <ThemeIcon
              size={40}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              <IconDatabase size={22} />
            </ThemeIcon>
            <div>
              <Text fw={700} c="blue" size="lg">
                Veritabanı Durumu
              </Text>
              <Text c="dimmed" size="sm">
                Sistem bağlantı ve performans bilgileri
              </Text>
            </div>
          </Group>
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            size="sm"
            leftSection={<IconRefresh size={16} />}
            onClick={checkDatabaseStatus}
            loading={loading}
            radius="xl"
          >
            Yenile
          </Button>
        </Group>
        
        <Divider />

        <Stack gap="md">
          {status.error ? (
            <Alert color="red" icon={<IconX size={16} />} radius="lg">
              <Text size="sm">{status.error}</Text>
            </Alert>
          ) : (
            <>
              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon
                    size={24}
                    radius="xl"
                    color={status.connected ? 'green' : 'red'}
                    variant="light"
                  >
                    {status.connected ? <IconCheck size={14} /> : <IconX size={14} />}
                  </ThemeIcon>
                  <Text size="sm" fw={500}>Bağlantı Durumu</Text>
                </Group>
                <Badge 
                  variant="gradient"
                  gradient={status.connected ? 
                    { from: 'teal', to: 'green' } : 
                    { from: 'red', to: 'pink' }
                  }
                  size="lg"
                >
                  {status.connected ? 'Aktif' : 'Bağlantı Yok'}
                </Badge>
              </Group>

              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon
                    size={24}
                    radius="xl"
                    color={status.tablesExist ? 'green' : 'red'}
                    variant="light"
                  >
                    {status.tablesExist ? <IconCheck size={14} /> : <IconX size={14} />}
                  </ThemeIcon>
                  <Text size="sm" fw={500}>Veri Tabloları</Text>
                </Group>
                <Badge 
                  variant="gradient"
                  gradient={status.tablesExist ? 
                    { from: 'teal', to: 'green' } : 
                    { from: 'red', to: 'pink' }
                  }
                  size="lg"
                >
                  {status.tablesExist ? 'Hazır' : 'Bulunamadı'}
                </Badge>
              </Group>

              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <ThemeIcon
                    size={24}
                    radius="xl"
                    color="blue"
                    variant="light"
                  >
                    <IconTrendingUp size={14} />
                  </ThemeIcon>
                  <Text size="sm" fw={500}>İşlenen Dosya</Text>
                </Group>
                <Badge 
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  size="lg"
                >
                  {status.totalFiles} Dosya
                </Badge>
              </Group>

              {status.lastProcessedFile && (
                <>
                  <Divider variant="dashed" />
                  <Group justify="space-between" align="center">
                    <Text size="sm" fw={500} c="dimmed">Son İşlenen Dosya:</Text>
                    <Text size="sm" c="blue" fw={600} style={{ 
                      maxWidth: '200px', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {status.lastProcessedFile.file_name}
                    </Text>
                  </Group>
                </>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
