import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");
  const isLanding = router.pathname === "/landing";

  return (
    <div className={`${inter.variable} font-sans`}>
      {!isAdmin && !isLanding && <Navbar />}
      <Component {...pageProps} />
      {!isAdmin && !isLanding && <Footer />}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#161616",
            color: "#fff",
            border: "1px solid #ffffff1a",
            fontSize: "14px",
          },
        }}
      />
    </div>
  );
}
