import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/charts/styles.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";
import { Notifications } from '@mantine/notifications';

const inter = Inter({
  subsets: ["latin"],
});

const theme = createTheme({
  primaryColor: 'blue',
  colors: {
    // Kurumsal Mavi Paleti - KVKK Uyumlu
    blue: [
      '#eff6ff', // 50
      '#dbeafe', // 100
      '#bfdbfe', // 200
      '#93c5fd', // 300
      '#60a5fa', // 400
      '#3b82f6', // 500 - Ana vurgu
      '#2563eb', // 600 - Birincil
      '#1d4ed8', // 700
      '#1e40af', // 800
      '#1e3a8a'  // 900 - Koyu lacivert
    ],
    // Profesyonel Dark Paleti
    dark: [
      '#f8fafc', // 50 - En açık
      '#f1f5f9', // 100
      '#e2e8f0', // 200
      '#cbd5e1', // 300
      '#94a3b8', // 400
      '#64748b', // 500
      '#475569', // 600
      '#334155', // 700
      '#1e293b', // 800
      '#0f172a'  // 900 - En koyu
    ]
  },
  fontFamily: inter.style.fontFamily,
  defaultRadius: 'md',
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  headings: {
    fontFamily: inter.style.fontFamily,
    sizes: {
      h1: { fontSize: '3rem', fontWeight: '700', lineHeight: '1.2' },
      h2: { fontSize: '1.875rem', fontWeight: '600', lineHeight: '1.3' },
      h3: { fontSize: '1.5rem', fontWeight: '600', lineHeight: '1.4' },
      h4: { fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.5' },
      h5: { fontSize: '1.125rem', fontWeight: '500', lineHeight: '1.5' },
      h6: { fontSize: '1rem', fontWeight: '500', lineHeight: '1.5' },
    },
  },
  spacing: {
    xs: '0.5rem', // 8px
    sm: '0.75rem', // 12px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
  },
});

export const metadata: Metadata = {
  title: "KVGuard - Kişisel Veri Koruma Sistemi",
  description: "KVKK uyumlu kişisel veri tespit ve maskeleme sistemi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineProvider theme={theme} defaultColorScheme='dark'>
          <Notifications />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
