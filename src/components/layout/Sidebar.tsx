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
  ChevronUp 
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuthStore } from "@/store/useAuthStore";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EditProfileDialog from "@/features/dashboard/EditProfileDialog"; 

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const { user, userData } = useAuthStore(); 
  
  // State for the Edit Profile Dialog
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Timeline", icon: CalendarDays, path: "/timeline" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  ];

  return (
    <>
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
        
        {/* 1. XP Badge */}
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

        {/* 2. Streak Badge */}
        <div className="bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 p-3 rounded-lg flex items-center justify-between border border-orange-100 dark:border-orange-900/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:bg-orange-100 dark:hover:bg-orange-900/40">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 fill-orange-500" />
            <span className="font-semibold text-sm">Daily Streak</span>
          </div>
          <span className="font-bold text-lg">{userData?.streak || 1}</span>
        </div>

        {/* 3. USER PROFILE (Drop-up Menu) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 cursor-pointer transition-colors">
              {/* Using Avatar Component now for better styling */}
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>{user?.displayName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 overflow-hidden text-left">
                <p className="text-sm font-medium truncate">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground truncate">Student</p>
              </div>
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent align="start" className="w-56" side="top">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => setIsEditProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              <span>Edit Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => auth.signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
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