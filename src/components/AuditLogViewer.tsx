'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Stack,
  Title,
  Text,
  Group,
  Badge,
  Timeline,
  ThemeIcon,
  useMantineColorScheme,
  Loader,
  Center,
  Alert,
  Select,
  TextInput,
  ScrollArea,
  Code,
  Divider,
  Box,
  Button
} from '@mantine/core';
import {
  IconShieldCheck,
  IconAlertCircle,
  IconSearch,
  IconFilter,
  IconRefresh,
  IconClock,
  IconUser,
  IconDeviceDesktop,
  IconMapPin
} from '@tabler/icons-react';
import { PersonalDataType } from '@/lib/models';

interface AuditLog {
  id: string;
  file_id: string;
  file_name: string;
  data_type: PersonalDataType;
  masked_value: string;
  detection_method: 'regex' | 'nlp' | 'hybrid';
  confidence: number;
  timestamp: string;
  ip_address?: string;
  user_agent?: string;
}

const DATA_TYPE_LABELS: Record<PersonalDataType, string> = {
  [PersonalDataType.TC_KIMLIK]: 'TC Kimlik',
  [PersonalDataType.IBAN]: 'IBAN',
  [PersonalDataType.TELEFON]: 'Telefon',
  [PersonalDataType.KREDI_KARTI]: 'Kredi Kartı',
  [PersonalDataType.ADRES]: 'Adres',
  [PersonalDataType.ISIM]: 'İsim',
  [PersonalDataType.SAGLIK_VERISI]: 'Sağlık Verisi',
  [PersonalDataType.EMAIL]: 'E-posta',
  [PersonalDataType.DOGUM_TARIHI]: 'Doğum Tarihi'
};

const DATA_TYPE_COLORS: Record<PersonalDataType, string> = {
  [PersonalDataType.TC_KIMLIK]: 'red',
  [PersonalDataType.IBAN]: 'blue',
  [PersonalDataType.TELEFON]: 'green',
  [PersonalDataType.KREDI_KARTI]: 'orange',
  [PersonalDataType.ADRES]: 'violet',
  [PersonalDataType.ISIM]: 'teal',
  [PersonalDataType.SAGLIK_VERISI]: 'pink',
  [PersonalDataType.EMAIL]: 'cyan',
  [PersonalDataType.DOGUM_TARIHI]: 'lime'
};

const DETECTION_METHOD_LABELS = {
  regex: 'Regex',
  nlp: 'NLP',
  hybrid: 'Hibrit (Regex + NLP)'
};

export function AuditLogViewer({ fileId }: { fileId?: string }) {
  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  
  // Filtreleme
  const [searchQuery, setSearchQuery] = useState('');
  const [dataTypeFilter, setDataTypeFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const url = fileId 
        ? `/api/audit-logs?fileId=${fileId}`
        : '/api/audit-logs';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Denetim logları yüklenemedi');
      }
      const data = await response.json();
      setLogs(data.logs || []);
      setFilteredLogs(data.logs || []);
    } catch (error) {
      console.error('Audit logs error:', error);
      setLogs([]);
      setFilteredLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [fileId]);

  // Filtreleme
  useEffect(() => {
    let filtered = [...logs];

    // Arama
    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.masked_value.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Veri türü filtresi
    if (dataTypeFilter !== 'all') {
      filtered = filtered.filter(log => log.data_type === dataTypeFilter);
    }

    // Tespit yöntemi filtresi
    if (methodFilter !== 'all') {
      filtered = filtered.filter(log => log.detection_method === methodFilter);
    }

    setFilteredLogs(filtered);
  }, [searchQuery, dataTypeFilter, methodFilter, logs]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimelineColor = (method: string) => {
    switch (method) {
      case 'regex':
        return 'blue';
      case 'nlp':
        return 'teal';
      case 'hybrid':
        return 'violet';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Center h={400}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Denetim logları yükleniyor...</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

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
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2} size={24} fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'} mb={8}>
              Denetim İzi
            </Title>
            <Text c="dimmed" size="sm">
              Tüm kişisel veri tespitlerinin detaylı kaydı ve izleme
            </Text>
          </div>
          <Button
            leftSection={<IconRefresh size={16} />}
            variant="light"
            onClick={fetchAuditLogs}
          >
            Yenile
          </Button>
        </Group>

        <Divider />

        {/* Filtreler */}
        <Group>
          <TextInput
            placeholder="Dosya veya veri ara..."
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Veri Türü"
            leftSection={<IconFilter size={16} />}
            data={[
              { value: 'all', label: 'Tüm Türler' },
              ...Object.entries(DATA_TYPE_LABELS).map(([value, label]) => ({
                value,
                label
              }))
            ]}
            value={dataTypeFilter}
            onChange={(value) => setDataTypeFilter(value || 'all')}
            w={180}
          />
          <Select
            placeholder="Tespit Yöntemi"
            leftSection={<IconFilter size={16} />}
            data={[
              { value: 'all', label: 'Tüm Yöntemler' },
              { value: 'regex', label: 'Regex' },
              { value: 'nlp', label: 'NLP' },
              { value: 'hybrid', label: 'Hibrit' }
            ]}
            value={methodFilter}
            onChange={(value) => setMethodFilter(value || 'all')}
            w={180}
          />
        </Group>

        {/* Timeline */}
        {filteredLogs.length === 0 ? (
          <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
            Henüz denetim kaydı bulunmuyor.
          </Alert>
        ) : (
          <ScrollArea.Autosize mah={600}>
            <Timeline active={filteredLogs.length} bulletSize={32} lineWidth={2}>
              {filteredLogs.map((log, index) => (
                <Timeline.Item
                  key={log.id}
                  bullet={
                    <ThemeIcon
                      size={32}
                      variant="light"
                      color={getTimelineColor(log.detection_method)}
                      radius="xl"
                    >
                      <IconShieldCheck size={18} />
                    </ThemeIcon>
                  }
                  title={
                    <Group gap="xs">
                      <Badge color={DATA_TYPE_COLORS[log.data_type]} size="sm">
                        {DATA_TYPE_LABELS[log.data_type]}
                      </Badge>
                      <Text size="sm" fw={500}>
                        tespit edildi
                      </Text>
                    </Group>
                  }
                >
                  <Box
                    p="md"
                    mt="xs"
                    style={{
                      background: colorScheme === 'dark' ? '#1e293b' : '#f8fafc',
                      borderRadius: 8,
                      border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
                    }}
                  >
                    <Stack gap="xs">
                      {/* Ana Bilgiler */}
                      <Group justify="space-between">
                        <Group gap="xs">
                          <Text size="sm" c="dimmed">Dosya:</Text>
                          <Text size="sm" fw={500}>{log.file_name}</Text>
                        </Group>
                        <Badge variant="light" color="green">
                          %{(log.confidence * 100).toFixed(0)} güven
                        </Badge>
                      </Group>

                      <Group>
                        <Text size="sm" c="dimmed">Maskelenmiş Değer:</Text>
                        <Code>{log.masked_value}</Code>
                      </Group>

                      <Group>
                        <Text size="sm" c="dimmed">Tespit Yöntemi:</Text>
                        <Badge variant="light" color={getTimelineColor(log.detection_method)}>
                          {DETECTION_METHOD_LABELS[log.detection_method]}
                        </Badge>
                      </Group>

                      <Divider variant="dashed" />

                      {/* Meta Bilgiler */}
                      <Group gap="xl" wrap="wrap">
                        <Group gap={4}>
                          <IconClock size={14} />
                          <Text size="xs" c="dimmed">
                            {formatDate(log.timestamp)}
                          </Text>
                        </Group>

                        {log.ip_address && (
                          <Group gap={4}>
                            <IconMapPin size={14} />
                            <Text size="xs" c="dimmed">
                              IP: {log.ip_address}
                            </Text>
                          </Group>
                        )}

                        {log.user_agent && (
                          <Group gap={4}>
                            <IconDeviceDesktop size={14} />
                            <Text 
                              size="xs" 
                              c="dimmed"
                              style={{
                                maxWidth: 200,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {log.user_agent}
                            </Text>
                          </Group>
                        )}
                      </Group>
                    </Stack>
                  </Box>
                </Timeline.Item>
              ))}
            </Timeline>
          </ScrollArea.Autosize>
        )}

        {/* Özet İstatistik */}
        {filteredLogs.length > 0 && (
          <>
            <Divider />
            <Group justify="space-around">
              <div>
                <Text size="xs" c="dimmed" ta="center">Toplam Kayıt</Text>
                <Text size="lg" fw={700} ta="center" c="blue">
                  {filteredLogs.length}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" ta="center">Ortalama Güven</Text>
                <Text size="lg" fw={700} ta="center" c="green">
                  %{(filteredLogs.reduce((sum, log) => sum + log.confidence, 0) / filteredLogs.length * 100).toFixed(1)}
                </Text>
              </div>
              <div>
                <Text size="xs" c="dimmed" ta="center">Farklı Dosya</Text>
                <Text size="lg" fw={700} ta="center" c="violet">
                  {new Set(filteredLogs.map(log => log.file_id)).size}
                </Text>
              </div>
            </Group>
          </>
        )}
      </Stack>
    </Paper>
  );
}

