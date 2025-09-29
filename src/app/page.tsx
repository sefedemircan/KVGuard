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
  rem
} from '@mantine/core';
import {
  IconShield,
  IconFileUpload,
  IconChartBar,
  IconDownload,
  IconRefresh,
  IconAlertTriangle
} from '@tabler/icons-react';
import { FileUploadZone } from '@/components/FileUploadZone';

export default function HomePage() {

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
            
            <Group>
              <Text size="sm" c="dimmed">
                KVKK Uyumlu Kişisel Veri Analizi
              </Text>
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
            >
              Bu sistem kişisel verileri tespit eder ve maskeler. Lütfen dosyalarınızın güvenliğini sağlamak için 
              gerekli önlemleri alın ve sadece yetkili kişilerin erişimine izin verin.
            </Alert>

            {/* Sistem Özellikleri */}
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text c="dimmed" size="sm" fw={500}>
                        Tespit Türleri
                      </Text>
                      <Text fw={700} size="xl">
                        9 Farklı
                      </Text>
                    </div>
                    <IconShield size={32} color="var(--mantine-color-blue-6)" />
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text c="dimmed" size="sm" fw={500}>
                        Dosya Türleri
                      </Text>
                      <Text fw={700} size="xl">
                        TXT, CSV, PDF, IMG
                      </Text>
                    </div>
                    <IconFileUpload size={32} color="var(--mantine-color-green-6)" />
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text c="dimmed" size="sm" fw={500}>
                        Analiz Yöntemi
                      </Text>
                      <Text fw={700} size="xl">
                        AI + Regex
                      </Text>
                    </div>
                    <IconChartBar size={32} color="var(--mantine-color-orange-6)" />
                  </Group>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
                <Card withBorder>
                  <Group justify="space-between">
                    <div>
                      <Text c="dimmed" size="sm" fw={500}>
                        Güvenlik
                      </Text>
                      <Text fw={700} size="xl">
                        KVKK Uyumlu
                      </Text>
                    </div>
                    <IconShield size={32} color="var(--mantine-color-teal-6)" />
                  </Group>
                </Card>
              </Grid.Col>
            </Grid>

            {/* Ana Dosya Yükleme Alanı */}
            <Card withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Group justify="space-between">
                  <Title order={3}>Kişisel Veri Analizi</Title>
                  <Badge variant="light" color="blue">
                    Gerçek Zamanlı Analiz
                  </Badge>
                </Group>
              </Card.Section>
              <Card.Section inheritPadding py="xl">
                <FileUploadZone />
              </Card.Section>
            </Card>

            {/* Desteklenen Veri Türleri */}
            <Card withBorder>
              <Card.Section withBorder inheritPadding py="xs">
                <Title order={4}>Tespit Edilen Kişisel Veri Türleri</Title>
              </Card.Section>
              <Card.Section inheritPadding py="md">
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
