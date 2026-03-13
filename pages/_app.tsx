import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import { AdminAuthProvider, useAdminAuth } from "@/lib/adminAuth";
import { AdminLogin } from "@/components/admin/AdminLogin";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAdminAuth();
  if (!isLoggedIn) return <AdminLogin />;
  return <>{children}</>;
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith("/admin");

  return (
    <div className={`${inter.variable} font-sans`}>
      {isAdmin ? (
        <AdminAuthProvider>
          <AdminGuard>
            <Component {...pageProps} />
          </AdminGuard>
        </AdminAuthProvider>
      ) : (
        <Component {...pageProps} />
      )}
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
