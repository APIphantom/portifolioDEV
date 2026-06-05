import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminSidebar, AdminMobileBar } from "@/components/admin/AdminSidebar";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "STVX // Workspace" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">
        <Outlet />
      </main>
      <AdminMobileBar />
    </div>
  );
}
