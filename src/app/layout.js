import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LexVizo",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              background: '#0b1220',
              border: '1px solid #142238',
              color: '#8e9bb2',
              fontSize: '11px',
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderRadius: '2px',
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
              padding: '10px 16px',
            },
            success: {
              iconTheme: {
                primary: '#00bc8c',
                secondary: '#05080f',
              },
              style: {
                border: '1px solid rgba(0, 188, 140, 0.3)',
                color: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#f87171',
                secondary: '#05080f',
              },
              style: {
                border: '1px solid rgba(248, 113, 113, 0.3)',
                color: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
