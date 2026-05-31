import { DM_Sans, Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ['normal', 'italic'],
  variable: '--font-serif',

})
const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
})


export const metadata = {
  title: "PrepTron",
  description: "inteview prepration platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
      variables: {
        colorPrimary: "#f59e0b",
        colorBackground: "#0f0f11",
        colorForeground: "#e7e5e4",
        colorMutedForeground: "#a8a29e",
        colorNeutral: "#292524",
        colorBorder: "rgba(255, 255, 255, 0.10)",
        colorInput: "#141417",
        colorInputForeground: "#e7e5e4",
        borderRadius: "0.75rem",
        fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
      },
    }}>

      <html
        lang="en"
        suppressHydrationWarning
      >
        <body className={`${lora.variable} ${dmSans.variable} font-sans bg-background`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            {/* Header */}
            <Header />

            <Toaster richColors />
            <main className="min-h-screen">{children}</main>
          </ThemeProvider>

        </body>
      </html>
    </ClerkProvider>
  );
}
