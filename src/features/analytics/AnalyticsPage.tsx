import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, Calendar } from 'lucide-react';

export default function AnalyticsPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      // Fetch last 7 days of stats
      const statsRef = collection(db, "users", user.uid, "stats");
      const q = query(statsRef, orderBy("date", "desc"), limit(7));
      
      const snapshot = await getDocs(q);
      const rawData = snapshot.docs.map(doc => doc.data()).reverse(); // Reverse to show Mon -> Sun
      
      // Normalize data (ensure we have labels like "Mon", "Tue")
      const formattedData = rawData.map(item => {
        const date = new Date(item.date);
        return {
          day: date.toLocaleDateString('en-US', { weekday: 'short' }), // "Mon"
          minutes: item.minutes || 0,
          xp: item.xp || 0
        };
      });

      setData(formattedData);
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-xl">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-sm text-primary">{payload[0].value} minutes focused</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10 max-w-5xl mx-auto">
        
        {/* Header */}
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">Track your focus habits over the last 7 days.</p>
        </div>

        {/* The Chart Card */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-sm"
        >
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold">Weekly Focus Time</h2>
                </div>
                {/* Total Summary */}
                <div className="text-right">
                    <span className="text-3xl font-bold">
                        {data.reduce((acc, curr) => acc + curr.minutes, 0)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-2">Total Mins</span>
                </div>
            </div>

            <div className="h-[300px] w-full">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-800/50 rounded-xl animate-pulse">
                        <span className="text-muted-foreground">Loading data...</span>
                    </div>
                ) : data.length === 0 ? (
                    <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                        <Calendar className="w-10 h-10 mb-2 opacity-20" />
                        <p>No study sessions recorded this week yet.</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <XAxis 
                                dataKey="day" 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false}
                            />
                            <YAxis 
                                stroke="#888888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => `${value}m`}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="minutes" radius={[4, 4, 0, 0]} maxBarSize={60}>
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill="currentColor" className="text-primary hover:text-primary/80 transition-colors" />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 p-6 rounded-2xl flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                    <Clock className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Daily Average</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {data.length > 0 ? Math.round(data.reduce((acc, curr) => acc + curr.minutes, 0) / data.length) : 0} mins
                    </p>
                </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl flex items-center gap-4">
                 <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Most Productive Day</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {data.length > 0 ? data.reduce((a, b) => a.minutes > b.minutes ? a : b).day : "-"}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}