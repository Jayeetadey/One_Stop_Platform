import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f131c]">
      <Sidebar />
      <main className="pl-64 min-h-screen">{children}</main>
    </div>
  );
}
