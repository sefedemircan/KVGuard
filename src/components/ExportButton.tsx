'use client';

import { useState } from 'react';
import {
  Button,
  Menu,
  Checkbox,
  Stack,
  Group,
  Text,
  Divider
} from '@mantine/core';
import {
  IconDownload,
  IconFileCode,
  IconFileSpreadsheet,
  IconFileText,
  IconChevronDown
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

interface ExportButtonProps {
  fileId: string;
  fileName?: string;
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function ExportButton({ 
  fileId, 
  fileName = 'export',
  variant = 'light',
  color = 'blue',
  size = 'sm'
}: ExportButtonProps) {
  const [includeOriginal, setIncludeOriginal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleExport = async (format: 'json' | 'csv' | 'txt') => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        fileId,
        format,
        includeOriginal: includeOriginal.toString()
      });

      const response = await fetch(`/api/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Export işlemi başarısız oldu');
      }

      // Dosyayı indir
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}_analysis.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      notifications.show({
        title: 'Başarılı',
        message: `Dosya ${format.toUpperCase()} formatında indirildi`,
        color: 'green',
      });
    } catch (error) {
      console.error('Export error:', error);
      notifications.show({
        title: 'Hata',
        message: error instanceof Error ? error.message : 'Export işlemi başarısız oldu',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Menu shadow="md" width={260} position="bottom-end">
      <Menu.Target>
        <Button
          variant={variant}
          color={color}
          size={size}
          leftSection={<IconDownload size={16} />}
          rightSection={<IconChevronDown size={14} />}
          loading={loading}
        >
          Dışa Aktar
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Export Formatı Seçin</Menu.Label>
        
        <Menu.Item
          leftSection={<IconFileCode size={16} />}
          onClick={() => handleExport('json')}
        >
          <Group justify="space-between" w="100%">
            <Text size="sm">JSON</Text>
            <Text size="xs" c="dimmed">.json</Text>
          </Group>
        </Menu.Item>

        <Menu.Item
          leftSection={<IconFileSpreadsheet size={16} />}
          onClick={() => handleExport('csv')}
        >
          <Group justify="space-between" w="100%">
            <Text size="sm">CSV</Text>
            <Text size="xs" c="dimmed">.csv</Text>
          </Group>
        </Menu.Item>

        <Menu.Item
          leftSection={<IconFileText size={16} />}
          onClick={() => handleExport('txt')}
        >
          <Group justify="space-between" w="100%">
            <Text size="sm">Text</Text>
            <Text size="xs" c="dimmed">.txt</Text>
          </Group>
        </Menu.Item>

        <Divider my="xs" />

        <Menu.Label>Export Seçenekleri</Menu.Label>
        
        <Menu.Item closeMenuOnClick={false}>
          <Checkbox
            label="Orijinal metni dahil et"
            size="xs"
            checked={includeOriginal}
            onChange={(event) => setIncludeOriginal(event.currentTarget.checked)}
            description="Maskelenmiş metin ile birlikte orijinal metni de dahil eder"
          />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

