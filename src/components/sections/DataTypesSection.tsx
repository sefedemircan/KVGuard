'use client';

import {
  Paper,
  Stack,
  Title,
  Text,
  Divider,
  Grid,
  Group,
  Badge,
  useMantineColorScheme
} from '@mantine/core';

export function DataTypesSection() {
  const { colorScheme } = useMantineColorScheme();

  return (
    <Paper
      p="xl"
      radius="md"
      style={{
        background: colorScheme === 'dark' ? '#0f172a' : '#ffffff',
        border: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <Stack gap="lg">
        <div>
          <Title order={2} size={24} fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'} mb={8}>
            Tespit Edilen Kişisel Veri Türleri
          </Title>
          <Text c="dimmed" size="sm">
            Sistemimiz 9 farklı kişisel veri türünü yüksek doğrulukla tespit eder ve maskeler
          </Text>
        </div>
        
        <Divider />
        
        <Grid gutter="md">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={600} c={colorScheme === 'dark' ? 'blue.3' : 'blue.7'} size="sm">
                Kimlik Bilgileri
              </Text>
              <Group gap="xs">
                <Badge 
                  variant="light"
                  color="red"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  TC Kimlik
                </Badge>
                <Badge 
                  variant="light"
                  color="blue"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  IBAN
                </Badge>
                <Badge 
                  variant="light"
                  color="teal"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  Telefon
                </Badge>
              </Group>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={600} c={colorScheme === 'dark' ? 'orange.3' : 'orange.7'} size="sm">
                Finansal Bilgiler
              </Text>
              <Group gap="xs">
                <Badge 
                  variant="light"
                  color="orange"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  Kredi Kartı
                </Badge>
                <Badge 
                  variant="light"
                  color="violet"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  Adres
                </Badge>
                <Badge 
                  variant="light"
                  color="indigo"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  İsim
                </Badge>
              </Group>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={600} c={colorScheme === 'dark' ? 'pink.3' : 'pink.7'} size="sm">
                Hassas Bilgiler
              </Text>
              <Group gap="xs">
                <Badge 
                  variant="light"
                  color="pink"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  Sağlık Verisi
                </Badge>
                <Badge 
                  variant="light"
                  color="cyan"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  E-posta
                </Badge>
                <Badge 
                  variant="light"
                  color="lime"
                  size="md"
                  style={{ fontWeight: 500, textTransform: 'none' }}
                >
                  Doğum Tarihi
                </Badge>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
}

