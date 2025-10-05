'use client';

import {
  Box,
  Container,
  Stack,
  Title,
  Text,
  Group,
  Paper,
  ThemeIcon,
  useMantineColorScheme
} from '@mantine/core';
import {
  IconRobot,
  IconBolt,
  IconShieldCheck
} from '@tabler/icons-react';

export function HeroSection() {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box py={48} mt="md">
      <Container size="lg">
        <Stack gap="xl" align="center">
          <Stack gap="md" align="center" maw={800}>
            <Title
              order={1}
              size={48}
              fw={700}
              ta="center"
              c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}
              style={{ 
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}
            >
              Kişisel Verilerinizi Güvenle Koruyun
            </Title>
            <Text size="lg" c="dimmed" ta="center" maw={680} style={{ lineHeight: 1.6 }}>
              Yapay zeka destekli teknoloji ile dosyalarınızdaki kişisel verileri 
              otomatik olarak tespit edin, maskeleyin ve KVKK uyumluluğunu sağlayın.
            </Text>
          </Stack>
          
          <Group gap="lg" justify="center">
            <Paper
              p="md"
              radius="md"
              style={{
                border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
                background: colorScheme === 'dark' ? '#0f172a' : '#ffffff'
              }}
            >
              <Group gap="xs">
                <ThemeIcon size={32} radius="md" variant="light" color="blue">
                  <IconRobot size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={500}>Teknoloji</Text>
                  <Text size="sm" fw={600}>AI Destekli</Text>
                </div>
              </Group>
            </Paper>
            
            <Paper
              p="md"
              radius="md"
              style={{
                border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
                background: colorScheme === 'dark' ? '#0f172a' : '#ffffff'
              }}
            >
              <Group gap="xs">
                <ThemeIcon size={32} radius="md" variant="light" color="teal">
                  <IconBolt size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={500}>İşlem</Text>
                  <Text size="sm" fw={600}>Gerçek Zamanlı</Text>
                </div>
              </Group>
            </Paper>
            
            <Paper
              p="md"
              radius="md"
              style={{
                border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
                background: colorScheme === 'dark' ? '#0f172a' : '#ffffff'
              }}
            >
              <Group gap="xs">
                <ThemeIcon size={32} radius="md" variant="light" color="green">
                  <IconShieldCheck size={18} />
                </ThemeIcon>
                <div>
                  <Text size="xs" c="dimmed" fw={500}>Doğruluk</Text>
                  <Text size="sm" fw={600}>%99 Başarı</Text>
                </div>
              </Group>
            </Paper>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}

