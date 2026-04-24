import { useState, useEffect } from 'react';

export function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6 mt-6">
      {[
        { label: 'Ngày', value: timeLeft.days },
        { label: 'Giờ', value: timeLeft.hours },
        { label: 'Phút', value: timeLeft.minutes },
        { label: 'Giây', value: timeLeft.seconds }
      ].map((item, idx) => (
        <div key={idx} className="flex flex-col items-center group">
          <div className="w-16 h-18 md:w-24 md:h-28 bg-white/[0.03] backdrop-blur-md rounded-[1.5rem] border border-white/10 flex items-center justify-center relative overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:bg-white/[0.08] group-hover:border-white/20">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
            <span className="text-3xl md:text-5xl font-black text-white tabular-nums drop-shadow-2xl">{item.value.toString().padStart(2, '0')}</span>
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <span className="text-[10px] md:text-xs font-black text-white/40 mt-4 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
