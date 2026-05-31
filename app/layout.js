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
  title: "LockIn",
  description: "inteview prepration platform",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: dark,
      variables: {
        colorPrimary: "#f59e0b",
        colorBackground: "#0f0f11",
        colorText: "#e7e5e4",
        colorTextOnPrimaryBackground: "#0a0a0b",
        colorTextSecondary: "#a8a29e",
        colorInputBackground: "#141417",
        colorInputText: "#e7e5e4",
        colorNeutral: "#e7e5e4",
        colorDanger: "#ef4444",
        borderRadius: "0.75rem",
        fontFamily: "var(--font-sans), 'DM Sans', sans-serif",
      },
      elements: {
        card: "bg-[#0f0f11] border border-white/10 shadow-2xl",
        socialButtonsBlockButton:
          "bg-[#141417] border border-white/10 text-stone-200 hover:bg-[#1a1a1f] hover:border-white/20 transition-all",
        socialButtonsBlockButtonText: "text-stone-200 font-medium",
        formButtonPrimary:
          "bg-amber-500 hover:bg-amber-400 text-black font-semibold",
        footerActionLink: "text-amber-400 hover:text-amber-300",
        headerTitle: "text-stone-100",
        headerSubtitle: "text-stone-400",
        dividerLine: "bg-white/10",
        dividerText: "text-stone-500",
        formFieldLabel: "text-stone-300",
        formFieldInput:
          "bg-[#141417] border-white/10 text-stone-100 focus:border-amber-400/50",
        identityPreview: "bg-[#141417] border border-white/10",
        identityPreviewText: "text-stone-200",
        identityPreviewEditButton: "text-amber-400 hover:text-amber-300",
        otpCodeFieldInput:
          "bg-[#141417] border-white/10 text-stone-100",
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
