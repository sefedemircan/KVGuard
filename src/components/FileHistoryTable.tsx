'use client';

import { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  Stack,
  Title,
  Text,
  Group,
  Badge,
  Button,
  TextInput,
  Select,
  Pagination,
  ActionIcon,
  Tooltip,
  useMantineColorScheme,
  Loader,
  Center,
  Alert,
  Modal,
  ScrollArea,
  Code,
  Divider,
  Box
} from '@mantine/core';
import {
  IconSearch,
  IconEye,
  IconDownload,
  IconFileText,
  IconAlertCircle,
  IconFilter,
  IconRefresh,
  IconCalendar,
  IconCheck,
  IconX,
  IconClock
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { DetectedPersonalData, PersonalDataType } from '@/lib/models';

interface ProcessedFile {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  upload_date: string;
  processed_date: string;
  status: 'processing' | 'completed' | 'error';
  detected_data: DetectedPersonalData[];
  masked_text: string;
  original_text: string;
  error_message?: string;
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

export function FileHistoryTable() {
  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<ProcessedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProcessedFile | null>(null);
  const [detailOpened, { open: openDetail, close: closeDetail }] = useDisclosure(false);
  
  // Filtreleme ve arama
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Sayfalama
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchFiles = async () => {
    setLoading(true);
    try {
      // DatabaseService'i kullanarak dosyaları çek
      const response = await fetch('/api/files');
      if (!response.ok) {
        throw new Error('Dosyalar yüklenemedi');
      }
      const data = await response.json();
      setFiles(data.files || []);
      setFilteredFiles(data.files || []);
    } catch (error) {
      console.error('Dosyalar yüklenirken hata:', error);
      setFiles([]);
      setFilteredFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Filtreleme ve arama
  useEffect(() => {
    let filtered = [...files];

    // Arama
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.file_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Durum filtresi
    if (statusFilter !== 'all') {
      filtered = filtered.filter(file => file.status === statusFilter);
    }

    setFilteredFiles(filtered);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, files]);

  // Sayfalama
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge color="green" variant="light" leftSection={<IconCheck size={12} />}>Tamamlandı</Badge>;
      case 'processing':
        return <Badge color="blue" variant="light" leftSection={<IconClock size={12} />}>İşleniyor</Badge>;
      case 'error':
        return <Badge color="red" variant="light" leftSection={<IconX size={12} />}>Hata</Badge>;
      default:
        return <Badge color="gray" variant="light">Bilinmiyor</Badge>;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewDetail = (file: ProcessedFile) => {
    setSelectedFile(file);
    openDetail();
  };

  const handleExport = async (fileId: string, format: 'json' | 'csv' | 'txt') => {
    try {
      const response = await fetch(`/api/export?fileId=${fileId}&format=${format}`);
      if (!response.ok) {
        throw new Error('Export işlemi başarısız');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${fileId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export hatası:', error);
    }
  };

  if (loading) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Center h={400}>
          <Stack align="center" gap="md">
            <Loader size="lg" />
            <Text c="dimmed">Dosyalar yükleniyor...</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <>
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
                İşlenmiş Dosyalar
              </Title>
              <Text c="dimmed" size="sm">
                Tüm dosya işleme geçmişi ve detayları
              </Text>
            </div>
            <Button
              leftSection={<IconRefresh size={16} />}
              variant="light"
              onClick={fetchFiles}
            >
              Yenile
            </Button>
          </Group>

          <Divider />

          {/* Filtreler */}
          <Group>
            <TextInput
              placeholder="Dosya ara..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Durum filtrele"
              leftSection={<IconFilter size={16} />}
              data={[
                { value: 'all', label: 'Tümü' },
                { value: 'completed', label: 'Tamamlandı' },
                { value: 'processing', label: 'İşleniyor' },
                { value: 'error', label: 'Hatalı' }
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value || 'all')}
              w={180}
            />
          </Group>

          {/* Tablo */}
          {filteredFiles.length === 0 ? (
            <Alert icon={<IconAlertCircle size={16} />} color="blue" variant="light">
              Henüz işlenmiş dosya bulunmuyor.
            </Alert>
          ) : (
            <>
              <ScrollArea>
                <Table striped highlightOnHover withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Dosya Adı</Table.Th>
                      <Table.Th>Tür</Table.Th>
                      <Table.Th>Boyut</Table.Th>
                      <Table.Th>Durum</Table.Th>
                      <Table.Th>Tespit</Table.Th>
                      <Table.Th>Tarih</Table.Th>
                      <Table.Th>İşlemler</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {paginatedFiles.map((file) => (
                      <Table.Tr key={file.id}>
                        <Table.Td>
                          <Group gap="xs">
                            <IconFileText size={16} />
                            <Text size="sm" fw={500} style={{ 
                              maxWidth: 200, 
                              overflow: 'hidden', 
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {file.file_name}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Code>{file.file_type}</Code>
                        </Table.Td>
                        <Table.Td>
                          <Text size="sm">{formatFileSize(file.file_size)}</Text>
                        </Table.Td>
                        <Table.Td>
                          {getStatusBadge(file.status)}
                        </Table.Td>
                        <Table.Td>
                          <Badge color="teal" variant="light">
                            {file.detected_data?.length || 0} veri
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap={4}>
                            <IconCalendar size={14} />
                            <Text size="xs" c="dimmed">
                              {formatDate(file.processed_date)}
                            </Text>
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <Tooltip label="Detayları Gör">
                              <ActionIcon
                                variant="light"
                                color="blue"
                                onClick={() => handleViewDetail(file)}
                              >
                                <IconEye size={16} />
                              </ActionIcon>
                            </Tooltip>
                            <Tooltip label="JSON İndir">
                              <ActionIcon
                                variant="light"
                                color="green"
                                onClick={() => handleExport(file.id, 'json')}
                              >
                                <IconDownload size={16} />
                              </ActionIcon>
                            </Tooltip>
                          </Group>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </ScrollArea>

              {/* Sayfalama */}
              {totalPages > 1 && (
                <Group justify="center" mt="md">
                  <Pagination
                    total={totalPages}
                    value={currentPage}
                    onChange={setCurrentPage}
                  />
                </Group>
              )}
            </>
          )}
        </Stack>
      </Paper>

      {/* Detay Modal */}
      <Modal
        opened={detailOpened}
        onClose={closeDetail}
        title="Dosya Detayları"
        size="xl"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {selectedFile && (
          <Stack gap="md">
            {/* Dosya Bilgileri */}
            <Paper p="lg" withBorder radius="md">
              <Text fw={600} mb="md">Dosya Bilgileri</Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Dosya Adı:</Text>
                  <Text size="sm" fw={500}>{selectedFile.file_name}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Dosya Türü:</Text>
                  <Code>{selectedFile.file_type}</Code>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Dosya Boyutu:</Text>
                  <Text size="sm">{formatFileSize(selectedFile.file_size)}</Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">Durum:</Text>
                  {getStatusBadge(selectedFile.status)}
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c="dimmed">İşlenme Tarihi:</Text>
                  <Text size="sm">{formatDate(selectedFile.processed_date)}</Text>
                </Group>
              </Stack>
            </Paper>

            {/* Tespit Edilen Veriler */}
            {selectedFile.detected_data && selectedFile.detected_data.length > 0 && (
              <Paper p="lg" withBorder radius="md">
                <Text fw={600} mb="md">Tespit Edilen Kişisel Veriler ({selectedFile.detected_data.length})</Text>
                <Stack gap="xs">
                  {selectedFile.detected_data.map((data, index) => (
                    <Group 
                      key={index} 
                      justify="space-between" 
                      p="sm" 
                      style={{ 
                        borderRadius: 8, 
                        backgroundColor: colorScheme === 'dark' 
                          ? 'var(--mantine-color-dark-6)' 
                          : 'var(--mantine-color-gray-0)'
                      }}
                    >
                      <Group gap="xs">
                        <Badge color={DATA_TYPE_COLORS[data.type]} size="sm">
                          {DATA_TYPE_LABELS[data.type]}
                        </Badge>
                        <Code>{data.maskedValue}</Code>
                      </Group>
                      <Badge variant="light" size="sm">
                        {(data.confidence * 100).toFixed(0)}%
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            )}

            {/* Export Butonları */}
            <Group justify="flex-end">
              <Button
                variant="light"
                leftSection={<IconDownload size={16} />}
                onClick={() => handleExport(selectedFile.id, 'json')}
              >
                JSON İndir
              </Button>
              <Button
                variant="light"
                leftSection={<IconDownload size={16} />}
                onClick={() => handleExport(selectedFile.id, 'csv')}
              >
                CSV İndir
              </Button>
              <Button
                variant="light"
                leftSection={<IconDownload size={16} />}
                onClick={() => handleExport(selectedFile.id, 'txt')}
              >
                TXT İndir
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}

