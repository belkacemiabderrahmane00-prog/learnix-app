import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FileText,
  Clock,
  ShieldCheck,
  Settings as SettingsIcon,
  LogOut,
  FileSpreadsheet,
  History,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/apprenants", label: "Apprenants", icon: Users },
  { to: "/formations", label: "Formations", icon: GraduationCap },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/generer", label: "Générer", icon: ShieldCheck },
  { to: "/import", label: "Import Excel", icon: FileSpreadsheet },
  { to: "/expirations", label: "Expirations", icon: Clock },
  { to: "/historique", label: "Historique", icon: History },
  { to: "/parametres", label: "Paramètres", icon: SettingsIcon },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserName(user.user_metadata?.name ?? user.email ?? "");
        setUserRole(user.user_metadata?.role ?? "admin");
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  };

  return (
    <aside className="bg-gradient-ink flex h-screen w-64 flex-col border-r border-sidebar-border text-sidebar-foreground">
      {/* Logo */}
      <div className="border-b border-sidebar-border px-6 py-5">
        <div className="font-sans text-2xl font-extrabold tracking-widest text-sidebar-foreground">
          <span className="text-primary">L</span>EARNIX
        </div>
        <div className="mt-1 text-[10px] font-medium tracking-[0.3em] text-sidebar-foreground/60">
          CERTIFY
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = location.pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground shadow-sm"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3">
          <div className="text-sm font-semibold">{userName}</div>
          <div className="text-xs text-sidebar-foreground/60">
            {userRole === "super_admin" ? "Super Administrateur" : "Administrateur"}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-md bg-sidebar-accent/60 px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
