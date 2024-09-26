import './global.css';
import { Inter } from 'next/font/google';
import AuthProvider from '@/context/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'True Feedback',
  description: 'Real feedback from real people.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <Navbar /> {/* Navbar added here */}
          {children}
          <Toaster />
        </body>
      </AuthProvider>
    </html>
  );
}
