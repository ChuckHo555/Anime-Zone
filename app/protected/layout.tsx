import Navbar from "@/app/components/(utility)/NavBar";
import UserProfileMenu from "../components/(scripts)/UserMenu";

    export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="flex flex-col h-screen">
      <div className="absolute top-4 left-4">
        <UserProfileMenu />
      </div>
        <main>{children}</main>
        <Navbar/>
      </div>
    );
  }
