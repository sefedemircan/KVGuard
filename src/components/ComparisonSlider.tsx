'use client';

import { useState } from 'react';
import {
  Box,
  Group,
  Text,
  Badge,
  useMantineColorScheme,
  ScrollArea,
  Paper,
  Stack,
  Divider
} from '@mantine/core';
import { IconEye, IconShield, IconAlertTriangle } from '@tabler/icons-react';

interface ComparisonSliderProps {
  originalText: string;
  maskedText: string;
  detectedCount?: number;
}

export function ComparisonSlider({ 
  originalText, 
  maskedText,
  detectedCount = 0
}: ComparisonSliderProps) {
  const { colorScheme } = useMantineColorScheme();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    
    // Sınırları kontrol et
    if (percentage >= 0 && percentage <= 100) {
      setSliderPosition(percentage);
    }
  };

  return (
    <Paper
      p="md"
      radius="md"
      style={{
        background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
        border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
      }}
    >
      <Stack gap="md">
        {/* Header */}
        <Group justify="space-between">
          <Group gap="xs">
            <Text size="sm" fw={600}>Metin Karşılaştırma</Text>
            {detectedCount > 0 && (
              <Badge color="teal" variant="light" size="sm">
                {detectedCount} kişisel veri maskelendi
              </Badge>
            )}
          </Group>
          <Group gap="xs">
            <Badge color="orange" variant="light" size="xs" leftSection={<IconEye size={10} />}>
              Sol: Orijinal
            </Badge>
            <Badge color="green" variant="light" size="xs" leftSection={<IconShield size={10} />}>
              Sağ: Maskelenmiş
            </Badge>
          </Group>
        </Group>

        <Divider />

        {/* Uyarı */}
        <Box
          p="xs"
          style={{
            background: colorScheme === 'dark' ? 'rgba(217, 119, 6, 0.1)' : 'rgba(251, 146, 60, 0.1)',
            borderRadius: 6,
            border: `1px solid ${colorScheme === 'dark' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(251, 146, 60, 0.3)'}`
          }}
        >
          <Group gap="xs">
            <IconAlertTriangle size={14} color={colorScheme === 'dark' ? '#fb923c' : '#ea580c'} />
            <Text size="xs" c="dimmed">
              Sol taraf hassas kişisel veriler içerir. Slider'ı hareket ettirerek karşılaştırın.
            </Text>
          </Group>
        </Box>

        {/* Comparison Container */}
        <Box
          pos="relative"
          h={400}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            overflow: 'hidden',
            borderRadius: 8,
            userSelect: 'none'
          }}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Orijinal Metin (Sol) */}
          <Box
            pos="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            style={{
              clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
              background: colorScheme === 'dark' ? '#dc2626' : '#fef2f2',
              border: `2px solid ${colorScheme === 'dark' ? '#991b1b' : '#fecaca'}`
            }}
          >
            <ScrollArea h="100%" p="md">
              <Text 
                size="sm" 
                style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontFamily: 'monospace',
                  color: colorScheme === 'dark' ? '#fca5a5' : '#991b1b'
                }}
              >
                {originalText || 'Orijinal metin bulunamadı'}
              </Text>
            </ScrollArea>
            
            {/* Orijinal Label */}
            <Box
              pos="absolute"
              top={16}
              left={16}
              px="md"
              py="xs"
              style={{
                background: colorScheme === 'dark' ? '#991b1b' : '#dc2626',
                borderRadius: 6,
                color: 'white'
              }}
            >
              <Group gap="xs">
                <IconEye size={14} />
                <Text size="xs" fw={600}>Orijinal Metin</Text>
              </Group>
            </Box>
          </Box>

          {/* Maskelenmiş Metin (Sağ) */}
          <Box
            pos="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            style={{
              clipPath: `inset(0 0 0 ${sliderPosition}%)`,
              background: colorScheme === 'dark' ? '#059669' : '#f0fdf4',
              border: `2px solid ${colorScheme === 'dark' ? '#047857' : '#bbf7d0'}`
            }}
          >
            <ScrollArea h="100%" p="md">
              <Text 
                size="sm" 
                style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontFamily: 'monospace',
                  color: colorScheme === 'dark' ? '#86efac' : '#166534'
                }}
              >
                {maskedText || 'Maskelenmiş metin bulunamadı'}
              </Text>
            </ScrollArea>

            {/* Maskelenmiş Label */}
            <Box
              pos="absolute"
              top={16}
              right={16}
              px="md"
              py="xs"
              style={{
                background: colorScheme === 'dark' ? '#047857' : '#059669',
                borderRadius: 6,
                color: 'white'
              }}
            >
              <Group gap="xs">
                <IconShield size={14} />
                <Text size="xs" fw={600}>Maskelenmiş Metin</Text>
              </Group>
            </Box>
          </Box>

          {/* Slider Handle */}
          <Box
            pos="absolute"
            top={0}
            left={`${sliderPosition}%`}
            h="100%"
            style={{
              width: 4,
              background: colorScheme === 'dark' ? '#3b82f6' : '#2563eb',
              cursor: 'ew-resize',
              transform: 'translateX(-50%)',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
              zIndex: 10
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Slider Button */}
            <Box
              pos="absolute"
              top="50%"
              left="50%"
              w={32}
              h={32}
              style={{
                transform: 'translate(-50%, -50%)',
                background: colorScheme === 'dark' ? '#3b82f6' : '#2563eb',
                borderRadius: '50%',
                border: `3px solid ${colorScheme === 'dark' ? '#1e293b' : '#ffffff'}`,
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M4 8l4-4v8L4 8zm8 0l-4-4v8l4-4z" />
              </svg>
            </Box>
          </Box>
        </Box>

        {/* Bilgi */}
        <Group justify="center">
          <Text size="xs" c="dimmed">
            Slider'ı sürükleyerek orijinal ve maskelenmiş metni karşılaştırın
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}

