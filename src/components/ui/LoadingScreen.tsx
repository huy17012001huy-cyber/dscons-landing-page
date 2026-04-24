import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center">
        {/* Logo or Main Icon */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.9, 1, 0.9],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-32 h-32 bg-card border border-border/50 rounded-[2rem] flex items-center justify-center mb-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 opacity-60" />
          <img 
            src="/favicon.ico" 
            alt="DSCons Logo" 
            className="w-20 h-20 relative z-10 drop-shadow-[0_0_25px_rgba(51,170,239,0.4)]"
          />
        </motion.div>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden relative">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>

        {/* Text */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-sm font-medium text-muted-foreground tracking-widest uppercase"
        >
          Đang tải trải nghiệm...
        </motion.p>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
    </motion.div>
  );
};

export default LoadingScreen;
