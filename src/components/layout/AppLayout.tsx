import { useLocation, useOutlet } from "react-router-dom"; // ✅ Import useOutlet
import Sidebar from "./Sidebar";
import { AnimatePresence } from "framer-motion"; 
import PageTransition from "./PageTransition"; 

const AppLayout = () => {
  const location = useLocation(); 
  const currentOutlet = useOutlet(); // ✅ Capture the element to freeze it

  return (
    <div className="flex h-screen w-full bg-zinc-50 dark:bg-zinc-900">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-8 ml-64">
        <div className="max-w-6xl mx-auto">
           {/* mode="wait" ensures the old page fades out completely 
              before the new one starts fading in. 
           */}
           <AnimatePresence mode="wait">
             <PageTransition key={location.pathname}>
                {/* ✅ Use the variable, not the component. This prevents the glitch. */}
                {currentOutlet}
             </PageTransition>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AppLayout;