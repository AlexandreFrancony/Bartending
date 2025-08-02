import { motion } from "framer-motion";

export default function PageWrapper({ children }) {
  return (
    <main className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="transition-colors duration-300"
      >
        {children}
      </motion.div>
    </main>
  );
}
