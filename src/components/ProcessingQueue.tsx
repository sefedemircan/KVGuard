'use client';

import { useState } from 'react';
import {
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Progress,
  Badge,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  Box,
  Divider,
  ScrollArea,
  ThemeIcon
} from '@mantine/core';
import {
  IconX,
  IconCheck,
  IconAlertCircle,
  IconClock,
  IconFileText,
  IconLoader
} from '@tabler/icons-react';

export interface QueuedFile {
  id: string;
  file: File;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
  result?: any;
}

interface ProcessingQueueProps {
  files: QueuedFile[];
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
}

export function ProcessingQueue({ files, onRemove, onRetry }: ProcessingQueueProps) {
  const { colorScheme } = useMantineColorScheme();

  const getStatusIcon = (status: QueuedFile['status']) => {
    switch (status) {
      case 'pending':
        return <IconClock size={20} />;
      case 'processing':
        return <IconLoader size={20} className="animate-spin" />;
      case 'completed':
        return <IconCheck size={20} />;
      case 'error':
        return <IconAlertCircle size={20} />;
      default:
        return <IconFileText size={20} />;
    }
  };

  const getStatusColor = (status: QueuedFile['status']) => {
    switch (status) {
      case 'pending':
        return 'gray';
      case 'processing':
        return 'blue';
      case 'completed':
        return 'green';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: QueuedFile['status']) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'processing':
        return 'İşleniyor';
      case 'completed':
        return 'Tamamlandı';
      case 'error':
        return 'Hata';
      default:
        return 'Bilinmiyor';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return null;
  }

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const processingCount = files.filter(f => f.status === 'processing').length;
  const completedCount = files.filter(f => f.status === 'completed').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <Paper
      p="lg"
      radius="md"
      style={{
        background: colorScheme === 'dark' ? '#0f172a' : '#ffffff',
        border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Title order={3} size={20} fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>
              İşlem Sırası
            </Title>
            <Text size="sm" c="dimmed">
              {files.length} dosya kuyruğa alındı
            </Text>
          </div>
          
          {/* Özet Badge'ler */}
          <Group gap="xs">
            {pendingCount > 0 && (
              <Badge color="gray" variant="light" size="sm">
                {pendingCount} bekliyor
              </Badge>
            )}
            {processingCount > 0 && (
              <Badge color="blue" variant="light" size="sm">
                {processingCount} işleniyor
              </Badge>
            )}
            {completedCount > 0 && (
              <Badge color="green" variant="light" size="sm">
                {completedCount} tamamlandı
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge color="red" variant="light" size="sm">
                {errorCount} hata
              </Badge>
            )}
          </Group>
        </Group>

        <Divider />

        {/* Dosya Listesi */}
        <ScrollArea.Autosize mah={400}>
          <Stack gap="sm">
            {files.map((queuedFile) => (
              <Box
                key={queuedFile.id}
                p="md"
                style={{
                  background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                  borderRadius: 8,
                  border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
                }}
              >
                <Stack gap="sm">
                  {/* Dosya Bilgisi */}
                  <Group justify="space-between" align="flex-start">
                    <Group gap="sm" style={{ flex: 1 }}>
                      <ThemeIcon
                        size={40}
                        radius="md"
                        variant="light"
                        color={getStatusColor(queuedFile.status)}
                      >
                        {getStatusIcon(queuedFile.status)}
                      </ThemeIcon>
                      
                      <div style={{ flex: 1 }}>
                        <Text 
                          size="sm" 
                          fw={500}
                          style={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {queuedFile.file.name}
                        </Text>
                        <Group gap="xs" mt={4}>
                          <Text size="xs" c="dimmed">
                            {formatFileSize(queuedFile.file.size)}
                          </Text>
                          <Text size="xs" c="dimmed">•</Text>
                          <Text size="xs" c="dimmed">
                            {queuedFile.file.type}
                          </Text>
                        </Group>
                      </div>
                    </Group>

                    <Group gap="xs">
                      <Badge 
                        color={getStatusColor(queuedFile.status)} 
                        variant="light"
                        size="sm"
                      >
                        {getStatusLabel(queuedFile.status)}
                      </Badge>
                      
                      {onRemove && (
                        <Tooltip label="Kaldır">
                          <ActionIcon
                            variant="subtle"
                            color="red"
                            onClick={() => onRemove(queuedFile.id)}
                            disabled={queuedFile.status === 'processing'}
                          >
                            <IconX size={16} />
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </Group>
                  </Group>

                  {/* Progress Bar */}
                  {(queuedFile.status === 'processing' || queuedFile.status === 'pending') && (
                    <Progress
                      value={queuedFile.progress}
                      size="sm"
                      radius="sm"
                      color={queuedFile.status === 'processing' ? 'blue' : 'gray'}
                      animated={queuedFile.status === 'processing'}
                    />
                  )}

                  {/* Hata Mesajı */}
                  {queuedFile.status === 'error' && queuedFile.error && (
                    <Box
                      p="xs"
                      style={{
                        background: colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(254, 226, 226, 0.5)',
                        borderRadius: 6,
                        border: `1px solid ${colorScheme === 'dark' ? 'rgba(239, 68, 68, 0.3)' : '#fecaca'}`
                      }}
                    >
                      <Group gap="xs">
                        <IconAlertCircle size={14} color="#ef4444" />
                        <Text size="xs" c="red">
                          {queuedFile.error}
                        </Text>
                      </Group>
                    </Box>
                  )}

                  {/* Sonuç Bilgisi */}
                  {queuedFile.status === 'completed' && queuedFile.result && (
                    <Group gap="xs">
                      <IconCheck size={14} color="#10b981" />
                      <Text size="xs" c="green">
                        {queuedFile.result.detectedData?.length || 0} kişisel veri tespit edildi
                      </Text>
                    </Group>
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </ScrollArea.Autosize>

        {/* Genel Progress */}
        {files.length > 0 && (
          <>
            <Divider />
            <Box>
              <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Toplam İlerleme</Text>
                <Text size="sm" c="dimmed">
                  {completedCount} / {files.length} tamamlandı
                </Text>
              </Group>
              <Progress
                value={(completedCount / files.length) * 100}
                size="md"
                radius="sm"
                color="green"
                striped={processingCount > 0}
                animated={processingCount > 0}
              />
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}

