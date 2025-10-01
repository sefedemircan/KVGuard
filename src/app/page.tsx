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
  useMantineColorScheme,
  Box,
  Divider,
  ThemeIcon,
  Paper
} from '@mantine/core';
import {
  IconShield,
  IconFileUpload,
  IconChartBar,
  IconDownload,
  IconRefresh,
  IconAlertTriangle,
  IconSun,
  IconMoon,
  IconRobot,
  IconLock,
  IconBolt,
  IconTrendingUp,
  IconEye,
  IconFingerprint,
  IconShieldCheck,
  IconBrandOpenai
} from '@tabler/icons-react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { DatabaseStatus } from '@/components/DatabaseStatus';

export default function HomePage() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell
      header={{ height: 80 }}
      padding="md"
    >
      <AppShell.Header>
        <Box
          style={{
            background: colorScheme === 'dark' 
              ? '#0f172a'
              : '#ffffff',
            borderBottom: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <Container size="xl" h="100%">
            <Group h="100%" justify="space-between">
              <Group gap="md">
                <Box
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 6px -1px rgba(30, 58, 138, 0.3)'
                  }}
                >
                  <IconShieldCheck size={26} color="#ffffff" />
                </Box>
                <div>
                  <Text size="xl" fw={700} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'} style={{ letterSpacing: '-0.02em' }}>
                    KVGuard
                  </Text>
                  <Text size="xs" c="dimmed" fw={500}>
                    Kişisel Veri Koruma Sistemi
                  </Text>
                </div>
              </Group>
              
              <Group gap="md">
                <Badge
                  variant="light"
                  color="green"
                  size="md"
                  leftSection={<IconShieldCheck size={12} />}
                  style={{
                    fontWeight: 600,
                    textTransform: 'none',
                    border: '1px solid rgba(5, 150, 105, 0.2)'
                  }}
                >
                  KVKK Uyumlu
                </Badge>
                
                <Tooltip label={colorScheme === 'dark' ? 'Açık Tema' : 'Koyu Tema'} position="bottom">
                  <ActionIcon
                    onClick={toggleColorScheme}
                    variant="subtle"
                    color="gray"
                    size="lg"
                    aria-label="Tema değiştir"
                    style={{
                      borderRadius: 8
                    }}
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
        </Box>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="xl">
          <Stack gap="xl">
            {/* Hero Section - Kurumsal */}
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

            {/* Uyarı Mesajı - Kurumsal */}
            <Alert
              icon={<IconAlertTriangle size={18} />}
              title="KVKK Uyumluluk Uyarısı"
              color="orange"
              variant="light"
              radius="md"
              styles={{
                root: {
                  border: `1px solid ${colorScheme === 'dark' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(251, 146, 60, 0.3)'}`,
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Text size="sm" style={{ lineHeight: 1.6 }}>
                Bu sistem kişisel verileri tespit eder ve maskeler. Lütfen dosyalarınızın güvenliğini sağlamak için 
                gerekli önlemleri alın ve sadece yetkili kişilerin erişimine izin verin.
              </Text>
            </Alert>

            {/* Sistem Özellikleri - Kurumsal Stats */}
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

            {/* Veritabanı Durumu */}
            <DatabaseStatus />

            {/* Ana Dosya Yükleme Alanı - Kurumsal */}
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
                  <Group justify="space-between" align="flex-start" mb="sm">
                    <div>
                      <Title order={2} size={24} fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'} mb={8}>
                        Kişisel Veri Analizi
                      </Title>
                      <Text c="dimmed" size="sm">
                        Dosyalarınızı yükleyin ve yapay zeka destekli analiz başlasın
                      </Text>
                    </div>
                    <Badge
                      variant="light"
                      color="blue"
                      size="lg"
                      leftSection={<IconBolt size={14} />}
                      style={{
                        fontWeight: 600,
                        textTransform: 'none'
                      }}
                    >
                      Gerçek Zamanlı
                    </Badge>
                  </Group>
                </div>
                <Divider />
                <FileUploadZone />
              </Stack>
            </Paper>

            {/* Desteklenen Veri Türleri - Kurumsal */}
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
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
