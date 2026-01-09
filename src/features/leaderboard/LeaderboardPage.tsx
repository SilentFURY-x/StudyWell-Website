import { useLeaderboard, LeaderboardUser } from "@/hooks/useLeaderboard";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";
import { Trophy, Medal, Crown, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const { users, loading } = useLeaderboard();
  const { user: currentUser } = useAuthStore();

  // --- NEW: Helper to generate "Aesthetic" avatars ---
  const getAvatar = (user: LeaderboardUser) => {
    if (user.photoURL) return user.photoURL;
    // Uses the user's ID as a seed to create a unique, consistent avatar
    return `https://api.dicebear.com/9.x/notionists/svg?seed=${user.displayName || user.id}&backgroundColor=e5e7eb,fdba74,fde047`;
  };

  // Animation variants for the staggered list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />; // Gold
      case 1: return <Medal className="w-6 h-6 text-zinc-400 fill-zinc-400" />;     // Silver
      case 2: return <Shield className="w-6 h-6 text-amber-700 fill-amber-700" />;  // Bronze
      default: return <span className="text-zinc-500 font-bold w-6 text-center">{index + 1}</span>;
    }
  };

  const getRowStyle = (index: number, isMe: boolean) => {
    const baseStyle = "flex items-center p-4 rounded-xl border transition-all duration-300";
    
    if (isMe) {
        // Highlight logic for YOUR row
        return cn(baseStyle, "bg-primary/5 border-primary/50 shadow-md scale-[1.02] ring-1 ring-primary");
    }

    // Top 3 Styling
    if (index === 0) return cn(baseStyle, "bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-zinc-900 border-yellow-200 dark:border-yellow-800");
    if (index === 1) return cn(baseStyle, "bg-gradient-to-r from-zinc-50 to-white dark:from-zinc-800/40 dark:to-zinc-900 border-zinc-200 dark:border-zinc-700");
    if (index === 2) return cn(baseStyle, "bg-gradient-to-r from-orange-50 to-white dark:from-orange-900/20 dark:to-zinc-900 border-orange-200 dark:border-orange-800");

    return cn(baseStyle, "bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700");
  };

  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-4 pt-4">
        <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
        >
            <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
        </motion.div>
        <h1 className="text-4xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground text-lg">
            See who's focusing the most. Can you reach the top?
        </p>
      </div>

      {/* The List */}
      <div className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm rounded-3xl p-2 sm:p-8">
        {loading ? (
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-20 bg-zinc-100 dark:bg-zinc-800 rounded-xl animate-pulse" />
                ))}
            </div>
        ) : (
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-3"
            >
                {users.map((user, index) => {
                    const isMe = user.id === currentUser?.uid;
                    
                    return (
                        <motion.div 
                            key={user.id} 
                            variants={item}
                            className={getRowStyle(index, isMe)}
                        >
                            {/* Rank Icon */}
                            <div className="flex-shrink-0 w-12 flex justify-center">
                                {getRankIcon(index)}
                            </div>

                            {/* User Info */}
                            <div className="flex items-center gap-4 flex-1">
                                <Avatar className={cn("h-12 w-12 border-2", 
                                    index === 0 ? "border-yellow-400" : 
                                    index === 1 ? "border-zinc-300" :
                                    index === 2 ? "border-orange-400" : "border-transparent"
                                )}>
                                    <AvatarImage src={getAvatar(user)} />
                                    <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
                                </Avatar>
                                
                                <div className="flex flex-col">
                                    <span className={cn("font-bold text-lg", isMe && "text-primary")}>
                                        {user.displayName} {isMe && "(You)"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Level {user.level || 1} • {Math.floor((user.xp || 0) / 60)} hrs focused
                                    </span>
                                </div>
                            </div>

                            {/* XP Score */}
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-zinc-900 dark:text-white">
                                    {user.xp || 0}
                                </span>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    XP Earned
                                </span>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        )}
      </div>
    </div>
  );
}