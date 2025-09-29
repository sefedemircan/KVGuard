'use client';

import { useState, useEffect } from 'react';
import {
  AppShell,
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Stack,
  Button,
  Loader,
  Center,
  Alert,
  ActionIcon,
  Tooltip,
  rem,
  useMantineColorScheme
} from '@mantine/core';
import {
  IconShield,
  IconFileUpload,
  IconChartBar,
  IconDownload,
  IconRefresh,
  IconAlertTriangle,
  IconSun,
  IconMoon
} from '@tabler/icons-react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { DatabaseStatus } from '@/components/DatabaseStatus';

export default function HomePage() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      header={{ height: 70 }}
      padding="md"
    >
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            <Group>
              <IconShield size={32} color="var(--mantine-color-blue-6)" />
              <div>
                <Title order={2} c="blue">KVGuard</Title>
                <Text size="sm" c="dimmed">Kişisel Veri Koruma Sistemi</Text>
              </div>
            </Group>
            
            <Group gap="md">
              <Text size="sm" c="dimmed">
                KVKK Uyumlu Kişisel Veri Analizi
              </Text>
              
              <Tooltip label={colorScheme === 'dark' ? 'Açık tema' : 'Koyu tema'}>
                <ActionIcon
                  onClick={toggleColorScheme}
                  variant="default"
                  size="lg"
                  aria-label="Tema değiştir"
                >
                  {colorScheme === 'dark' ? (
                    <IconSun size={18} />
                  ) : (
                    <IconMoon size={18} />
                  )}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Stack gap="xl">
            {/* Uyarı Mesajı */}
            <Alert
              icon={<IconAlertTriangle size={16} />}
              title="KVKK Uyumluluk Uyarısı"
              color="orange"
              variant="light"
            >
              Bu sistem kişisel verileri tespit eder ve maskeler. Lütfen dosyalarınızın güvenliğini sağlamak için 
              gerekli önlemleri alın ve sadece yetkili kişilerin erişimine izin verin.
            </Alert>

            {/* Sistem Özellikleri */}
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder shadow="sm" padding="lg" radius="md">
                  <Group justify="space-between">
                    <div>
                      <Text c="dimmed" size="sm" fw={500}>
                        Tespit Türleri
                      </Text>
                      <Text fw={700} size="xl" c="blue">
                        9 Farklı
                      </Text>
                    </div>
                    <IconShield size={32} color="var(--mantine-color-blue-6)" />
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder shadow="sm" padding="lg" radius="md">
                  <Group justify="space-between">
                    <div>
                      <Text c="dimmed" size="sm" fw={500}>
                        Dosya Türleri
                      </Text>
                      <Text fw={700} size="xl" c="green">
                        TXT, CSV, PDF, IMG
                      </Text>
                    </div>
                    <IconFileUpload size={32} color="var(--mantine-color-green-6)" />
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder shadow="sm" padding="lg" radius="md">
                  <Group justify="space-between">
                    <div>
                      <Text c="dimmed" size="sm" fw={500}>
                        Analiz Yöntemi
                      </Text>
                      <Text fw={700} size="xl" c="orange">
                        AI + Regex
                      </Text>
                    </div>
                    <IconChartBar size={32} color="var(--mantine-color-orange-6)" />
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder shadow="sm" padding="lg" radius="md">
                  <Group justify="space-between">
                    <div>
                      <Text c="dimmed" size="sm" fw={500}>
                        Güvenlik
                      </Text>
                      <Text fw={700} size="xl" c="teal">
                        KVKK Uyumlu
                      </Text>
                    </div>
                    <IconShield size={32} color="var(--mantine-color-teal-6)" />
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>

            {/* Veritabanı Durumu */}
            <DatabaseStatus />

            {/* Ana Dosya Yükleme Alanı */}
            <Card withBorder shadow="md" radius="lg">
              <Card.Section withBorder inheritPadding py="md">
                <Group justify="space-between">
                  <Title order={3} c="blue">Kişisel Veri Analizi</Title>
                  <Badge variant="light" color="blue" size="lg">
                    Gerçek Zamanlı Analiz
                  </Badge>
                </Group>
              </Card.Section>
              <Card.Section inheritPadding py="xl">
                <FileUploadZone />
              </Card.Section>
            </Card>

            {/* Desteklenen Veri Türleri */}
            <Card withBorder shadow="sm" radius="md">
              <Card.Section withBorder inheritPadding py="md">
                <Title order={4} c="teal">Tespit Edilen Kişisel Veri Türleri</Title>
              </Card.Section>
              <Card.Section inheritPadding py="lg">
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Group gap="xs">
                      <Badge color="red" variant="light">TC Kimlik</Badge>
                      <Badge color="blue" variant="light">IBAN</Badge>
                      <Badge color="green" variant="light">Telefon</Badge>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Group gap="xs">
                      <Badge color="orange" variant="light">Kredi Kartı</Badge>
                      <Badge color="purple" variant="light">Adres</Badge>
                      <Badge color="teal" variant="light">İsim</Badge>
                    </Group>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                    <Group gap="xs">
                      <Badge color="pink" variant="light">Sağlık Verisi</Badge>
                      <Badge color="cyan" variant="light">E-posta</Badge>
                      <Badge color="yellow" variant="light">Doğum Tarihi</Badge>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card.Section>
            </Card>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
