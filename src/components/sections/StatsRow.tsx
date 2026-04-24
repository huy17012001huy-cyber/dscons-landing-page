import { motion } from "framer-motion";
import { landingData } from "@/data/landingContent";

export default function StatsRow() {
  const { pageId } = usePageContext();
  const { stats } = landingData;

  // Nếu không có stats trong landingContent, bạn nên xử lý fallback
  if (!stats) return null;

  return (
    <section className="pb-12 bg-transparent">
      <div className="w-full mx-auto px-4 sm:px-6 mt-8 sm:mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-card rounded-2xl p-5 sm:p-8 flex flex-col items-center justify-center text-center border-[2px] border-border shadow-card hover:shadow-card-hover transition-all duration-300 ease-out hover:-translate-y-1"
            >
              <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300 rounded-tl-sm pointer-events-none"></span>
              <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300 rounded-tr-sm pointer-events-none"></span>
              <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300 rounded-bl-sm pointer-events-none"></span>
              <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-primary/0 group-hover:border-primary/40 transition-all duration-300 rounded-br-sm pointer-events-none"></span>
              <span className="text-[32px] sm:text-[40px] font-extrabold text-foreground mb-1 leading-none">{stat.value}</span>
              <span className="text-[13px] sm:text-[15px] font-medium text-muted-foreground">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
