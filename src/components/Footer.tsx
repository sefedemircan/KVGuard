'use client';

import {
  Box,
  Container,
  Group,
  Text,
  Stack,
  Divider,
  Anchor,
  ThemeIcon,
  useMantineColorScheme,
  Grid
} from '@mantine/core';
import {
  IconShieldCheck,
  IconBrandGithub,
  IconMail,
  IconPhone,
  IconMapPin,
  IconLock,
  IconScale,
  IconBook
} from '@tabler/icons-react';

export function Footer() {
  const { colorScheme } = useMantineColorScheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      style={{
        background: colorScheme === 'dark' ? '#0f172a' : '#f8fafc',
        borderTop: `1px solid ${colorScheme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
        marginTop: 'auto'
      }}
    >
      <Container size="xl" py="xl">
        <Grid gutter="xl">
          {/* Logo ve Açıklama */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="md">
              <Group gap="sm">
                <Box
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 6,
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <IconShieldCheck size={20} color="#ffffff" />
                </Box>
                <Text size="lg" fw={700} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>
                  KVGuard
                </Text>
              </Group>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                KVKK uyumlu kişisel veri koruma ve maskeleme sistemi. 
                Yapay zeka destekli teknoloji ile verilerinizi güvende tutun.
              </Text>
              <Group gap="xs">
                <ThemeIcon variant="light" size="lg" color="blue">
                  <IconLock size={16} />
                </ThemeIcon>
                <Text size="xs" c="dimmed">
                  %99 Güvenlik | KVKK Uyumlu
                </Text>
              </Group>
            </Stack>
          </Grid.Col>

          {/* Hızlı Bağlantılar */}
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Stack gap="sm">
              <Text size="sm" fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>
                Ürün
              </Text>
              <Stack gap="xs">
                <Anchor size="sm" c="dimmed" underline="never">
                  Özellikler
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  Fiyatlandırma
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  Dokümantasyon
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  API
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Şirket */}
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Stack gap="sm">
              <Text size="sm" fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>
                Şirket
              </Text>
              <Stack gap="xs">
                <Anchor size="sm" c="dimmed" underline="never">
                  Hakkımızda
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  Blog
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  Kariyer
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  İletişim
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* Yasal */}
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Stack gap="sm">
              <Text size="sm" fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>
                Yasal
              </Text>
              <Stack gap="xs">
                <Anchor 
                  size="sm" 
                  c="dimmed" 
                  underline="never"
                  href="https://www.kvkk.gov.tr/"
                  target="_blank"
                >
                  <Group gap={4}>
                    <IconScale size={12} />
                    KVKK Metni
                  </Group>
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  <Group gap={4}>
                    <IconBook size={12} />
                    Gizlilik
                  </Group>
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  Kullanım Koşulları
                </Anchor>
                <Anchor size="sm" c="dimmed" underline="never">
                  Çerez Politikası
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>

          {/* İletişim */}
          <Grid.Col span={{ base: 12, sm: 6, md: 2 }}>
            <Stack gap="sm">
              <Text size="sm" fw={600} c={colorScheme === 'dark' ? 'white' : '#1e3a8a'}>
                İletişim
              </Text>
              <Stack gap="xs">
                <Group gap={4}>
                  <IconMail size={14} />
                  <Anchor size="sm" c="dimmed" href="mailto:info@kvguard.com" underline="never">
                    info@kvguard.com
                  </Anchor>
                </Group>
                <Group gap={4}>
                  <IconPhone size={14} />
                  <Text size="sm" c="dimmed">
                    +90 (212) 555-0000
                  </Text>
                </Group>
                <Group gap={4}>
                  <IconMapPin size={14} />
                  <Text size="sm" c="dimmed">
                    İstanbul, Türkiye
                  </Text>
                </Group>
                <Anchor 
                  href="https://github.com/kvguard" 
                  target="_blank"
                  c="dimmed"
                  size="sm"
                >
                  <Group gap={4}>
                    <IconBrandGithub size={14} />
                    GitHub
                  </Group>
                </Anchor>
              </Stack>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        {/* Alt Bilgi */}
        <Group justify="space-between" wrap="wrap">
          <Text size="xs" c="dimmed">
            © {currentYear} KVGuard. Tüm hakları saklıdır.
          </Text>
          <Group gap="xs">
            <Text size="xs" c="dimmed">
              Made with ❤️ in Turkey
            </Text>
            <Text size="xs" c="dimmed">•</Text>
            <Text size="xs" c="dimmed">
              KVKK Uyumlu Sistem
            </Text>
          </Group>
        </Group>

        {/* KVKK Aydınlatma Metni */}
        <Box
          mt="md"
          p="md"
          style={{
            background: colorScheme === 'dark' ? '#1e293b' : '#ffffff',
            borderRadius: 8,
            border: `1px solid ${colorScheme === 'dark' ? '#334155' : '#e2e8f0'}`
          }}
        >
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.8 }}>
            <strong>KVKK Aydınlatma Metni:</strong> KVGuard, 6698 sayılı Kişisel Verilerin Korunması Kanunu 
            kapsamında kişisel verilerinizi korumak için gerekli tüm teknik ve idari tedbirleri almaktadır. 
            Sistemimiz üzerinden yüklediğiniz dosyalar ve tespit edilen kişisel veriler, güvenli bir şekilde 
            şifrelenerek saklanmakta ve yetkisiz erişimlere karşı korunmaktadır. Verilerinizin işlenme amacı, 
            KVKK uyumluluğunun sağlanması ve kişisel verilerin korunmasıdır. Detaylı bilgi için 
            <Anchor size="xs" ml={4} href="/kvkk" c="blue">
              KVKK Aydınlatma Metni
            </Anchor> sayfamızı ziyaret edebilirsiniz.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}

