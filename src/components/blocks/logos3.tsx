"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { formatTextGradients } from "@/lib/textUtils";

export interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

export interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Công cụ và công nghệ trong khóa học",
  logos = [
    {
      id: "logo-1",
      description: "Nvidia Logo",
      image: "https://svgl.app/library/nvidia-wordmark-light.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-2",
      description: "Supabase Logo",
      image: "https://svgl.app/library/supabase_wordmark_light.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-3",
      description: "OpenAI Logo",
      image: "https://svgl.app/library/openai_wordmark_light.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-4",
      description: "Turso Logo",
      image: "https://svgl.app/library/turso-wordmark-light.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-5",
      description: "Vercel Logo",
      image: "https://svgl.app/library/vercel_wordmark.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-6",
      description: "GitHub Logo",
      image: "https://svgl.app/library/github_wordmark_light.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-7",
      description: "Claude AI Logo",
      image: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg",
      className: "h-7 w-auto",
    },
    {
      id: "logo-8",
      description: "Clerk Logo",
      image: "https://svgl.app/library/clerk-wordmark-light.svg",
      className: "h-7 w-auto",
    },
  ],
  className = "",
}: Logos3Props) => {
  return (
    <div className={`py-12 ${className}`}>
      <div className="container flex flex-col items-center text-center">
        <h2 className="mb-5 text-center">
          <span 
            className="block font-medium text-lg md:text-xl text-muted-foreground uppercase tracking-widest mb-2"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(heading) }}
          />
        </h2>
      </div>
      <div className="pt-6 md:pt-10">
        <div className="relative mx-auto w-full lg:max-w-5xl overflow-hidden">
          <InfiniteSlider durationOnHover={50} duration={35} gap={40} className="py-2">
            {logos.map((logo) => (
              <div key={logo.id} className="flex shrink-0 items-center justify-center gap-3 opacity-80 hover:opacity-100 transition-opacity">
                {logo.image && (
                  <img
                    src={logo.image}
                    alt={logo.description || "Công nghệ"}
                    className="h-10 md:h-14 w-auto object-contain max-w-[200px] transition-transform hover:scale-105"
                  />
                )}
                {logo.description && (
                  <span className="font-bold text-lg md:text-xl text-foreground whitespace-nowrap tracking-tight">{logo.description}</span>
                )}
              </div>
            ))}
          </InfiniteSlider>
          <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-muted/50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-muted/50 to-transparent z-10 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export { Logos3 };
