import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner"; 

export const metadata = {
  title: "Turf Booking App | Book Your Game Easily",
  description: "Turf Booking App helps players and turf owners manage, book, and update sports turfs with ease.",
  icons: {
    icons: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={metadata.description} />
        <meta name="author" content="Turf Booking Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <title>{metadata.title}</title>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" /> 
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
