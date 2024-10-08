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
};

export default function RootLayout({ children }) {
  return (
    <html lang="mn">
      <body className={rubik.className}>
        <Providers>
        <Navbar/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
