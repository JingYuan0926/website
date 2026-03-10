import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");

  return (
    <div className={`${jakarta.variable} font-sans`}>
      {!isAdmin && <Navbar />}
      <Component {...pageProps} />
      {!isAdmin && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(21% 0.01 285)",
            color: "oklch(93% 0.01 285)",
            border: "1px solid oklch(25% 0.015 285)",
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
}
