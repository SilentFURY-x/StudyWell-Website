import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AppLayout = () => {
  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-900">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />
      
      {/* Main Content Area (changes when you click links) */}
      <main className="flex-1 h-full overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
           {/* 'Outlet' is where the child routes (Dashboard, Timeline, etc.) will render */}
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;