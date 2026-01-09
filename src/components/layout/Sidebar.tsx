import { Link, useLocation, useNavigate } from "react-router-dom"; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Trophy, 
  LogOut, 
  Flame,
  Clock,
  Star 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { user, userData } = useAuthStore(); 

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Timeline", icon: CalendarDays, path: "/timeline" },
    { name: "Focus Timer", icon: Clock, path: "/timer" },
    { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  ];

  return (
    <div className="h-screen w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col p-4 fixed left-0 top-0">
      
      {/* App Logo & Theme Toggle */}
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight">StudyWell</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Navigation Links */}
      <div className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  isActive && "bg-zinc-100 dark:bg-zinc-900 font-semibold"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section: Stats & User */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-4">
        
        {/* 1. XP Badge (Lift Up Effect Added) */}
        <div 
          onClick={() => navigate('/leaderboard')}
          className="bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-lg flex items-center justify-between border border-yellow-100 dark:border-yellow-900/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-yellow-100 dark:hover:bg-yellow-900/40"
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-500" />
            <span className="font-semibold text-sm">Total XP</span>
          </div>
          <span className="font-bold text-lg">{userData?.xp || 0}</span>
        </div>

        {/* 2. Streak Badge (Lift Up Effect Added) */}
        <div className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 p-3 rounded-lg flex items-center justify-between border border-orange-100 dark:border-orange-900/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-orange-100 dark:hover:bg-orange-900/40">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 fill-orange-500" />
            <span className="font-semibold text-sm">Daily Streak</span>
          </div>
          <span className="font-bold text-lg">{userData?.streak || 1}</span>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-sm font-bold">
            {user?.displayName?.[0] || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">Student</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-destructive"
            onClick={() => auth.signOut()}
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;