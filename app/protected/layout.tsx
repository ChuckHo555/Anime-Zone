// app/protected/layout.tsx
import Navbar from "@/app/components/NavBar";

    export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex flex-col h-screen">
        <main>{children}</main>
        <Navbar/>
      </div>
    );
  }
