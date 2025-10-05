'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Title,
  Text,
  Grid,
  Card,
  Group,
  Badge,
  ThemeIcon,
  useMantineColorScheme,
  Loader,
  Center,
  Alert,
  Select,
  Divider,
  Box
} from '@mantine/core';
import { LineChart, BarChart, PieChart } from '@mantine/charts';
import {
  IconChartLine,
  IconChartBar,
  IconChartPie,
  IconFileCheck,
  IconFingerprint,
  IconClock,
  IconTrendingUp,
  IconAlertCircle
} from '@tabler/icons-react';
import { PersonalDataType } from '@/lib/models';

interface StatisticsData {
  totalFiles: number;
  totalDataDetected: number;
  averageConfidence: number;
  averageProcessingTime: number;
  topDataTypes: { type: string; count: number }[];
  dailyTrends: {
    date: string;
    filesProcessed: number;
    dataDetected: number;
    averageConfidence: number;
    processingTime: number;
  }[];
  dataTypeBreakdown: { [key: string]: number };
}

const DATA_TYPE_LABELS: Record<string, string> = {
  TC_KIMLIK: 'TC Kimlik',
  IBAN: 'IBAN',
  TELEFON: 'Telefon',
  KREDI_KARTI: 'Kredi Kartı',
  ADRES: 'Adres',
  ISIM: 'İsim',
  SAGLIK_VERISI: 'Sağlık Verisi',
  EMAIL: 'E-posta',
  DOGUM_TARIHI: 'Doğum Tarihi'
};

const DATA_TYPE_COLORS = [
  'red.6', 'blue.6', 'green.6', 'orange.6', 'violet.6',
  'teal.6', 'pink.6', 'cyan.6', 'lime.6'
];

export function StatisticsPanel() {
  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [period, setPeriod] = useState<string>('summary');

  const fetchStatistics = async (periodType: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/statistics?type=${periodType}`);
      if (!response.ok) {
        throw new Error('İstatistikler yüklenemedi');
      }
      const data = await response.json();
      setStats(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics(period);
  }, [period]);

  if (loading) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Center h={400}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">İstatistikler yükleniyor...</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  if (error || !stats) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Hata">
        {error || 'İstatistikler yüklenemedi'}
      </Alert>
    );
  }

  // Grafik verileri hazırla
  const dailyTrendsChartData = stats.dailyTrends.map(trend => ({
    date: new Date(trend.date).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
    'Dosya Sayısı': trend.filesProcessed,
    'Tespit Edilen Veri': trend.dataDetected,
  }));

  const pieChartData = stats.topDataTypes.map((item, index) => ({
    name: DATA_TYPE_LABELS[item.type] || item.type,
    value: item.count,
    color: DATA_TYPE_COLORS[index % DATA_TYPE_COLORS.length]
  }));

  const barChartData = stats.topDataTypes.map(item => ({
    dataType: DATA_TYPE_LABELS[item.type] || item.type,
    count: item.count
  }));

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
      <Stack gap="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} size={24} fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'} mb={8}>
              İstatistikler ve Analiz
            </Title>
            <Text c="dimmed" size="sm">
              Sistem performansı ve veri analizi raporları
            </Text>
          </div>
          <Select
            data={[
              { value: 'summary', label: 'Son 30 Gün' },
              { value: 'daily', label: 'Günlük' },
              { value: 'weekly', label: 'Haftalık' },
              { value: 'monthly', label: 'Aylık' }
            ]}
            value={period}
            onChange={(value) => setPeriod(value || 'summary')}
            w={150}
          />
        </Group>

        <Divider />

        {/* Özet Kartlar */}
        <Grid>
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card
              p="lg"
              radius="md"
              style={{
                background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
              }}
            >
              <Stack gap="md">
                <Group justify="space-between">
                  <ThemeIcon size={40} radius="md" variant="light" color="blue">
                    <IconFileCheck size={22} />
                  </ThemeIcon>
                  <Badge variant="light" color="blue">Toplam</Badge>
                </Group>
                <div>
                  <Text size="sm" c="dimmed" mb={4}>İşlenen Dosya</Text>
                  <Title order={2} fw={700} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>
                    {stats.totalFiles}
                  </Title>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card
              p="lg"
              radius="md"
              style={{
                background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
              }}
            >
              <Stack gap="md">
                <Group justify="space-between">
                  <ThemeIcon size={40} radius="md" variant="light" color="teal">
                    <IconFingerprint size={22} />
                  </ThemeIcon>
                  <Badge variant="light" color="teal">Tespit</Badge>
                </Group>
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Kişisel Veri</Text>
                  <Title order={2} fw={700} c={colorScheme === 'dark' ? 'white' : '#059669'}>
                    {stats.totalDataDetected}
                  </Title>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card
              p="lg"
              radius="md"
              style={{
                background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
              }}
            >
              <Stack gap="md">
                <Group justify="space-between">
                  <ThemeIcon size={40} radius="md" variant="light" color="green">
                    <IconTrendingUp size={22} />
                  </ThemeIcon>
                  <Badge variant="light" color="green">Güven</Badge>
                </Group>
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Ortalama Doğruluk</Text>
                  <Title order={2} fw={700} c={colorScheme === 'dark' ? 'white' : '#059669'}>
                    %{(stats.averageConfidence * 100).toFixed(1)}
                  </Title>
                </div>
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }}>
            <Card
              p="lg"
              radius="md"
              style={{
                background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
              }}
            >
              <Stack gap="md">
                <Group justify="space-between">
                  <ThemeIcon size={40} radius="md" variant="light" color="orange">
                    <IconClock size={22} />
                  </ThemeIcon>
                  <Badge variant="light" color="orange">Süre</Badge>
                </Group>
                <div>
                  <Text size="sm" c="dimmed" mb={4}>Ortalama İşlem</Text>
                  <Title order={2} fw={700} c={colorScheme === 'dark' ? 'white' : '#d97706'}>
                    {stats.averageProcessingTime}ms
                  </Title>
                </div>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Grafikler */}
        <Grid>
          {/* Günlük Trend Grafiği */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Card
              p="lg"
              radius="md"
              style={{
                background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
              }}
            >
              <Group mb="md" gap="xs">
                <ThemeIcon size={32} radius="md" variant="light" color="blue">
                  <IconChartLine size={18} />
                </ThemeIcon>
                <div>
                  <Text fw={600} size="md">Günlük Aktivite Trendi</Text>
                  <Text size="xs" c="dimmed">Son 7 günlük işlem geçmişi</Text>
                </div>
              </Group>
              {dailyTrendsChartData.length > 0 ? (
                <LineChart
                  h={300}
                  data={dailyTrendsChartData}
                  dataKey="date"
                  series={[
                    { name: 'Dosya Sayısı', color: 'blue.6' },
                    { name: 'Tespit Edilen Veri', color: 'teal.6' }
                  ]}
                  curveType="natural"
                  gridAxis="xy"
                  withLegend
                  legendProps={{ verticalAlign: 'bottom', height: 50 }}
                />
              ) : (
                <Center h={300}>
                  <Text c="dimmed">Henüz veri bulunmuyor</Text>
                </Center>
              )}
            </Card>
          </Grid.Col>

          {/* Veri Türü Dağılımı - Pie Chart */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Card
              p="lg"
              radius="md"
              style={{
                background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
              }}
            >
              <Group mb="md" gap="xs">
                <ThemeIcon size={32} radius="md" variant="light" color="teal">
                  <IconChartPie size={18} />
                </ThemeIcon>
                <div>
                  <Text fw={600} size="md">Veri Türü Dağılımı</Text>
                  <Text size="xs" c="dimmed">En çok tespit edilenler</Text>
                </div>
              </Group>
              {pieChartData.length > 0 ? (
                <PieChart
                  h={300}
                  data={pieChartData}
                  withLabels
                  withTooltip
                  tooltipDataSource="segment"
                />
              ) : (
                <Center h={300}>
                  <Text c="dimmed">Henüz veri bulunmuyor</Text>
                </Center>
              )}
            </Card>
          </Grid.Col>

          {/* Veri Türü Sayıları - Bar Chart */}
          <Grid.Col span={12}>
            <Card
              p="lg"
              radius="md"
              style={{
                background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
              }}
            >
              <Group mb="md" gap="xs">
                <ThemeIcon size={32} radius="md" variant="light" color="violet">
                  <IconChartBar size={18} />
                </ThemeIcon>
                <div>
                  <Text fw={600} size="md">Veri Türü Detayları</Text>
                  <Text size="xs" c="dimmed">Tespit edilen kişisel veri türleri ve sayıları</Text>
                </div>
              </Group>
              {barChartData.length > 0 ? (
                <BarChart
                  h={300}
                  data={barChartData}
                  dataKey="dataType"
                  series={[{ name: 'count', color: 'violet.6', label: 'Tespit Sayısı' }]}
                  gridAxis="y"
                  withLegend
                />
              ) : (
                <Center h={300}>
                  <Text c="dimmed">Henüz veri bulunmuyor</Text>
                </Center>
              )}
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Paper>
  );
}

