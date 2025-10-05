'use client';

import { useState } from 'react';
import {
  AppShell,
  Container,
  Group,
  Badge,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  Box,
  Text,
  Tabs,
  Stack,
  Alert
} from '@mantine/core';
import {
  IconShieldCheck,
  IconSun,
  IconMoon,
  IconFileUpload,
  IconChartBar,
  IconHistory,
  IconShield,
  IconAlertTriangle
} from '@tabler/icons-react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { DatabaseStatus } from '@/components/DatabaseStatus';
import { StatisticsPanel } from '@/components/StatisticsPanel';
import { FileHistoryTable } from '@/components/FileHistoryTable';
import { AuditLogViewer } from '@/components/AuditLogViewer';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { DataTypesSection } from '@/components/sections/DataTypesSection';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [activeTab, setActiveTab] = useState<string | null>('upload');

  return (
    <>
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
              {/* Hero Section */}
              <HeroSection />

              {/* KVKK Uyarı */}
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

              {/* Özellikler */}
              <FeaturesSection />

              {/* Veritabanı Durumu */}
              <DatabaseStatus />

              {/* Ana Tab Yapısı */}
              <Tabs value={activeTab} onChange={setActiveTab} keepMounted={false}>
                <Tabs.List>
                  <Tabs.Tab 
                    value="upload" 
                    leftSection={<IconFileUpload size={16} />}
                  >
                    Dosya Yükle
                  </Tabs.Tab>
                  <Tabs.Tab 
                    value="statistics" 
                    leftSection={<IconChartBar size={16} />}
                  >
                    İstatistikler
                  </Tabs.Tab>
                  <Tabs.Tab 
                    value="history" 
                    leftSection={<IconHistory size={16} />}
                  >
                    Dosya Geçmişi
                  </Tabs.Tab>
                  <Tabs.Tab 
                    value="audit" 
                    leftSection={<IconShield size={16} />}
                  >
                    Denetim İzi
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="upload" pt="xl">
                  <Stack gap="xl">
                <FileUploadZone />
                    <DataTypesSection />
              </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="statistics" pt="xl">
                  <StatisticsPanel />
                </Tabs.Panel>

                <Tabs.Panel value="history" pt="xl">
                  <FileHistoryTable />
                </Tabs.Panel>

                <Tabs.Panel value="audit" pt="xl">
                  <AuditLogViewer />
                </Tabs.Panel>
              </Tabs>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>

      {/* Footer */}
      <Footer />
    </>
  );
}
