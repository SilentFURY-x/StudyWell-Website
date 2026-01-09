import { useState } from "react"; 
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
  Star,
  BarChart3, 
  Settings, 
  User, 
  ChevronUp,
  Sparkles 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileDialog from "@/features/dashboard/EditProfileDialog"; 

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { user, userData } = useAuthStore(); 
  
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Timeline", icon: CalendarDays, path: "/timeline" },
    { name: "Focus Timer", icon: Clock, path: "/timer" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  ];

  return (
    <>
    <div className="h-screen w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col p-4 fixed left-0 top-0">
      
      {/* App Logo & Theme Toggle */}
      <div className="flex items-center justify-between px-2 mb-8">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
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
                  "w-full justify-start gap-3 mb-1 font-medium transition-all duration-200",
                  isActive && "bg-zinc-100 dark:bg-zinc-900 shadow-sm translate-x-1"
                )}
              >
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>

      {/* Bottom Section: Stats & User */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-4">
        
        {/* 1. XP Badge */}
        <div 
          onClick={() => navigate('/leaderboard')}
          className="group bg-gradient-to-br from-yellow-50 to-white dark:from-yellow-950/30 dark:to-zinc-900 text-yellow-700 dark:text-yellow-400 p-3 rounded-xl flex items-center justify-between border border-yellow-200/60 dark:border-yellow-900/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg group-hover:scale-110 transition-transform">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
            </div>
            <span className="font-semibold text-sm">Total XP</span>
          </div>
          <span className="font-bold text-lg tracking-tight">{userData?.xp || 0}</span>
        </div>

        {/* 2. Streak Badge */}
        <div className="group bg-gradient-to-br from-orange-50 to-white dark:from-orange-950/30 dark:to-zinc-900 text-orange-700 dark:text-orange-400 p-3 rounded-xl flex items-center justify-between border border-orange-200/60 dark:border-orange-900/30 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/10">
          <div className="flex items-center gap-2">
             <div className="p-1.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg group-hover:scale-110 transition-transform">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
             </div>
            <span className="font-semibold text-sm">Streak</span>
          </div>
          <span className="font-bold text-lg tracking-tight">{userData?.streak || 1}</span>
        </div>

        {/* 3. PREMIUM USER PROFILE (Drop-up Menu) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/50 cursor-pointer transition-all duration-200 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
              <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-700 transition-transform group-hover:scale-105">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 overflow-hidden text-left transition-opacity">
                <p className="text-sm font-semibold truncate text-zinc-700 dark:text-zinc-200">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                   Level {userData?.level || 1} Scholar
                </p>
              </div>
              <ChevronUp className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            align="start" 
            side="top" 
            sideOffset={12}
            className="w-64 p-2 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-2xl"
          >
            {/* Inner Header Card */}
            <div className="flex items-center gap-3 p-3 mb-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800/50">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {user?.displayName?.[0] || "U"}
                </div>
                <div className="overflow-hidden">
                    <p className="font-semibold text-sm truncate">{user?.displayName}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[140px]">{user?.email}</p>
                </div>
            </div>

            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
            
            <DropdownMenuItem onClick={() => setIsEditProfileOpen(true)} className="p-3 rounded-lg cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
              <User className="mr-3 h-4 w-4" />
              <span className="font-medium">Edit Profile</span>
            </DropdownMenuItem>

            {/* ✅ LINKED TO ANALYTICS */}
            <DropdownMenuItem 
              onClick={() => navigate('/analytics')}
              className="p-3 rounded-lg cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-900 text-zinc-600 dark:text-zinc-300"
            >
              <Sparkles className="mr-3 h-4 w-4 text-amber-500" />
              <span className="font-medium">My Stats</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800 my-1" />
            
            <DropdownMenuItem onClick={() => auth.signOut()} className="p-3 rounded-lg cursor-pointer focus:bg-red-50 dark:focus:bg-red-950/30 text-red-600 dark:text-red-400 focus:text-red-600">
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>

    {/* The Hidden Dialog */}
    <EditProfileDialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen} />
    </>
  );
};

export default Sidebar;