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
    // Custom blue palette for dark theme
    blue: [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#4dabf7',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab'
    ],
    // Custom dark palette
    dark: [
      '#d5d7e0',
      '#acaebf',
      '#8c8fa3',
      '#666980',
      '#4d4f66',
      '#34354a',
      '#2b2c3d',
      '#1d1e30',
      '#0c0d21',
      '#01010a'
    ]
  },
  fontFamily: inter.style.fontFamily,
  defaultRadius: 'md',
  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },
  headings: {
    fontFamily: inter.style.fontFamily,
    sizes: {
      h1: { fontSize: '2rem', fontWeight: '700' },
      h2: { fontSize: '1.75rem', fontWeight: '600' },
      h3: { fontSize: '1.5rem', fontWeight: '600' },
      h4: { fontSize: '1.25rem', fontWeight: '500' },
    },
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
