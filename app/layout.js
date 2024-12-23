// import localFont from "next/font/local";
import { Rubik } from 'next/font/google'
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

const rubik = Rubik({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: {
    template: '%s | NMSU',
    default: 'New Mongol Student Union',
  },
  themeColor: '#1d1d1d',
  description: "NEW MONGOL STUDENT UNION",
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/favicon.ico',
        href: '/favicon.ico',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/favicon-dark.ico',
        href: '/favicon-dark.ico',
      },
    ],
  },
  openGraph: {
    title: 'New Mongol Student Union',
    metadataBase: new URL("https://student.nmit.edu.mn/"),
    description: 'New Mongol Student Union',
    url: 'https://student.nmit.edu.mn/',
    siteName: 'New Mongol Student Union',
    images: [
      {
        url: 'https://student.nmit.edu.mn/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'background',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={rubik.className}>
        <Providers>
        <Navbar/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
