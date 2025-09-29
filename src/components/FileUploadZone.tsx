'use client';

import { useState } from 'react';
import {
  Group,
  Text,
  useMantineTheme,
  rem,
  Stack,
  Button,
  Progress,
  Alert,
  Paper,
  Badge,
  ScrollArea,
  Divider,
  Code,
  Modal,
  Tabs,
  List,
  ThemeIcon
} from '@mantine/core';
import { Dropzone, FileWithPath, MIME_TYPES } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconFileTypePdf,
  IconFileText,
  IconEye,
  IconShield,
  IconAlertTriangle,
  IconCheck
} from '@tabler/icons-react';
import { DetectedPersonalData, PersonalDataType } from '@/lib/models';

interface FileUploadZoneProps {}

interface ProcessingResult {
  fileId: string;
  originalText: string;
  maskedText: string;
  detectedData: DetectedPersonalData[];
  ocrConfidence: number;
  processingTimeMs: number;
}

const DATA_TYPE_LABELS: Record<PersonalDataType, string> = {
  [PersonalDataType.TC_KIMLIK]: 'TC Kimlik No',
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
  [PersonalDataType.ADRES]: 'purple',
  [PersonalDataType.ISIM]: 'teal',
  [PersonalDataType.SAGLIK_VERISI]: 'pink',
  [PersonalDataType.EMAIL]: 'cyan',
  [PersonalDataType.DOGUM_TARIHI]: 'yellow'
};

export function FileUploadZone({}: FileUploadZoneProps) {
  const theme = useMantineTheme();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleUpload = async (files: FileWithPath[]) => {
    const file = files[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 20;
        });
      }, 500);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Dosya yüklenirken hata oluştu');
      }

      setResult(data);
      open();

      notifications.show({
        title: 'Başarılı',
        message: `Dosya işlendi. ${data.detectedData.length} kişisel veri tespit edildi.`,
        color: 'green',
        icon: <IconCheck size={16} />
      });

    } catch (error) {
      notifications.show({
        title: 'Hata',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu',
        color: 'red',
        icon: <IconX size={16} />
      });
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return IconPhoto;
    if (mimeType === 'application/pdf') return IconFileTypePdf;
    return IconFileText;
  };

  return (
    <>
      <Stack gap="md">
        <Dropzone
          onDrop={handleUpload}
          onReject={(files) => {
            notifications.show({
              title: 'Dosya Hatası',
              message: `Geçersiz dosya: ${files[0].file.name}`,
              color: 'red',
            });
          }}
          maxSize={10 * 1024 ** 2} // 10MB
          accept={[
            MIME_TYPES.pdf,
            MIME_TYPES.png,
            MIME_TYPES.jpeg,
            'text/plain',
            'text/csv',
            'image/bmp',
            'image/tiff'
          ]}
          disabled={uploading}
          h={200}
        >
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconFileText
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Dosyaları buraya sürükleyin veya seçmek için tıklayın
              </Text>
              <Text size="sm" c="dimmed" inline mt={7}>
                PDF, TXT, CSV, JPG, PNG dosyaları desteklenir (max 10MB)
              </Text>
            </div>
          </Group>
        </Dropzone>

        {uploading && (
          <Stack gap="xs">
            <Text size="sm" c="dimmed">Dosya işleniyor...</Text>
            <Progress value={progress} animated color="blue" />
          </Stack>
        )}

        <Alert
          icon={<IconAlertTriangle size={16} />}
          title="Güvenlik Uyarısı"
          color="orange"
          variant="light"
        >
          Yüklediğiniz dosyalar kişisel veri tespiti için analiz edilecektir. 
          Hassas bilgiler içeren dosyaları yüklemeden önce güvenlik politikalarınızı gözden geçirin.
        </Alert>
      </Stack>

      <Modal
        opened={opened}
        onClose={close}
        title="Dosya İşleme Sonuçları"
        size="xl"
        scrollAreaComponent={ScrollArea.Autosize}
      >
        {result && (
          <Stack gap="md">
            {/* Özet Bilgiler */}
            <Paper p="lg" withBorder shadow="sm" radius="md">
              <Group justify="space-between" mb="md">
                <Text fw={500} c="blue">İşleme Özeti</Text>
                <Badge color="green" variant="light" size="lg">
                  Tamamlandı
                </Badge>
              </Group>
              
              <Group gap="xl">
                <div>
                  <Text size="sm" c="dimmed">Tespit Edilen Veri</Text>
                  <Text fw={700} size="lg" c="green">{result.detectedData.length}</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">OCR Güveni</Text>
                  <Text fw={700} size="lg" c="blue">{(result.ocrConfidence * 100).toFixed(1)}%</Text>
                </div>
                <div>
                  <Text size="sm" c="dimmed">İşlem Süresi</Text>
                  <Text fw={700} size="lg" c="orange">{result.processingTimeMs}ms</Text>
                </div>
              </Group>
            </Paper>

            {/* Tespit Edilen Veriler */}
            {result.detectedData.length > 0 && (
              <Paper p="lg" withBorder shadow="sm" radius="md">
                <Text fw={500} mb="md" c="teal">Tespit Edilen Kişisel Veriler</Text>
                <Stack gap="xs">
                  {result.detectedData.map((data, index) => (
                    <Group key={index} justify="space-between" p="md" style={{ borderRadius: 8, backgroundColor: 'var(--mantine-color-dark-6)' }}>
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

            {/* Metin Karşılaştırması */}
            <Tabs defaultValue="masked" keepMounted={false}>
              <Tabs.List>
                <Tabs.Tab value="masked" leftSection={<IconShield size={14} />}>
                  Maskelenmiş Metin
                </Tabs.Tab>
                <Tabs.Tab value="original" leftSection={<IconEye size={14} />}>
                  Orijinal Metin
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="masked" pt="md">
                <Paper p="lg" withBorder shadow="sm" radius="md" style={{ backgroundColor: 'var(--mantine-color-green-1)' }}>
                  <Text size="sm" c="dimmed" mb="md">Maskelenmiş Metin (Güvenli)</Text>
                  <ScrollArea.Autosize mah={300}>
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                      {result.maskedText}
                    </Text>
                  </ScrollArea.Autosize>
                </Paper>
              </Tabs.Panel>

              <Tabs.Panel value="original" pt="md">
                <Alert color="red" mb="md">
                  <Group>
                    <IconAlertTriangle size={16} />
                    <Text size="sm">Bu bölüm kişisel veriler içerir. Dikkatli olun!</Text>
                  </Group>
                </Alert>
                <Paper p="lg" withBorder shadow="sm" radius="md" style={{ backgroundColor: 'var(--mantine-color-red-1)' }}>
                  <Text size="sm" c="dimmed" mb="md">Orijinal Metin (Hassas)</Text>
                  <ScrollArea.Autosize mah={300}>
                    <Text size="sm" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                      {result.originalText}
                    </Text>
                  </ScrollArea.Autosize>
                </Paper>
              </Tabs.Panel>
            </Tabs>

            <Group justify="flex-end" mt="md">
              <Button variant="light" onClick={close}>
                Kapat
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </>
  );
}
