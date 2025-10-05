'use client';

import {
  Box,
  Title,
  Grid,
  Paper,
  Stack,
  Text,
  Group,
  ThemeIcon,
  useMantineColorScheme
} from '@mantine/core';
import {
  IconFingerprint,
  IconFileUpload,
  IconBrandOpenai,
  IconShieldCheck
} from '@tabler/icons-react';

export function FeaturesSection() {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box>
      <Title order={2} size={30} mb="xl" fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>
        Sistem Özellikleri
      </Title>
      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Paper
            p="lg"
            radius="md"
            style={{
              background: colorScheme === 'dark' ? '#0f172a' : '#ffffff',
              border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <Stack gap="md">
              <Group justify="apart">
                <ThemeIcon size={40} radius="md" variant="light" color="blue">
                  <IconFingerprint size={22} />
                </ThemeIcon>
              </Group>
              <div>
                <Text size="sm" c="dimmed" mb={4}>Tespit Türleri</Text>
                <Title order={2} fw={700} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>9</Title>
                <Text size="xs" c="dimmed">Farklı veri türü</Text>
              </div>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Paper
            p="lg"
            radius="md"
            style={{
              background: colorScheme === 'dark' ? '#0f172a' : '#ffffff',
              border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <Stack gap="md">
              <Group justify="apart">
                <ThemeIcon size={40} radius="md" variant="light" color="teal">
                  <IconFileUpload size={22} />
                </ThemeIcon>
              </Group>
              <div>
                <Text size="sm" c="dimmed" mb={4}>Dosya Formatları</Text>
                <Title order={2} fw={700} c={colorScheme === 'dark' ? 'white' : '#059669'}>4+</Title>
                <Text size="xs" c="dimmed">PDF, TXT, CSV, Görsel</Text>
              </div>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Paper
            p="lg"
            radius="md"
            style={{
              background: colorScheme === 'dark' ? '#0f172a' : '#ffffff',
              border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <Stack gap="md">
              <Group justify="apart">
                <ThemeIcon size={40} radius="md" variant="light" color="indigo">
                  <IconBrandOpenai size={22} />
                </ThemeIcon>
              </Group>
              <div>
                <Text size="sm" c="dimmed" mb={4}>Analiz Yöntemi</Text>
                <Title order={2} fw={700} c={colorScheme === 'dark' ? 'white' : '#6366f1'}>AI</Title>
                <Text size="xs" c="dimmed">Yapay Zeka + Regex</Text>
              </div>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
          <Paper
            p="lg"
            radius="md"
            style={{
              background: colorScheme === 'dark' ? '#0f172a' : '#ffffff',
              border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              transition: 'box-shadow 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'}
          >
            <Stack gap="md">
              <Group justify="apart">
                <ThemeIcon size={40} radius="md" variant="light" color="green">
                  <IconShieldCheck size={22} />
                </ThemeIcon>
              </Group>
              <div>
                <Text size="sm" c="dimmed" mb={4}>Doğruluk Oranı</Text>
                <Title order={2} fw={700} c={colorScheme === 'dark' ? 'white' : '#059669'}>%99</Title>
                <Text size="xs" c="dimmed">KVKK Uyumlu</Text>
              </div>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

