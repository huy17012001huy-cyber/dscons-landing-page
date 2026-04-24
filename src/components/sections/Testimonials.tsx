import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Quote, Play } from "lucide-react";
import { landingData } from "@/data/landingContent";
import { getSectionData } from "@/lib/api";
import { usePageContext } from "@/contexts/PageContext";
import { formatTextGradients } from "@/lib/textUtils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import AutoScroll from "embla-carousel-auto-scroll";

export default function Testimonials({ data: previewData }: { data?: any }) {
  const { pageId } = usePageContext();
  const [data, setData] = useState(landingData.testimonials);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (previewData) {
      setData({ ...landingData.testimonials, ...previewData });
      return;
    }

    const loadData = async () => {
      const dbData = await getSectionData("testimonials", pageId);
      if (dbData) {
        setIsVisible(dbData.is_visible);
        if (dbData.published_content) {
          setData({ ...landingData.testimonials, ...dbData.published_content });
        }
      }
    };
    loadData();
  }, [previewData, pageId]);

  if (!isVisible || !data) return null;

  const renderVideoModal = (item: any) => {
    if (!item.videoUrl) return null;

    let videoElement;
    if (item.videoUrl.includes("youtube") || item.videoUrl.includes("youtu.be")) {
      const videoId = item.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
      videoElement = (
        <iframe 
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} 
          title={item.name}
          className="w-full h-[80vh] max-h-[800px] border-0 rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      );
    } else if (item.videoUrl.includes("drive.google.com")) {
      const driveId = item.videoUrl.match(/\/d\/(.+?)\/(?:view|preview)/)?.[1] || item.videoUrl.match(/id=(.+?)(?:&|$)/)?.[1];
      videoElement = (
        <iframe 
          src={`https://drive.google.com/file/d/${driveId}/preview`} 
          className="w-full aspect-[9/16] md:w-auto md:h-[90vh] md:aspect-[9/16] max-h-[900px] border-0 rounded-lg"
          allow="autoplay"
          allowFullScreen
        />
      );
    } else {
      videoElement = (
        <video src={item.videoUrl} controls autoPlay className="w-full aspect-[9/16] md:w-auto md:h-[90vh] md:aspect-[9/16] max-h-[900px] object-contain rounded-lg" />
      );
    }

    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center text-primary-foreground transform scale-90 group-hover:scale-100 transition-transform shadow-xl">
              <Play className="w-8 h-8 ml-1" />
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] md:max-w-fit p-0 bg-black border-none shadow-2xl rounded-2xl overflow-hidden ring-0 outline-none">
          <div className="relative flex items-center justify-center">
            {videoElement}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const textItems = data.textItems || [];
  const videoItems = data.videoItems || [];

  let row1 = data.partners || [];
  let row2 = data.partnersRow2 || [];
  let row3 = data.partnersRow3 || [];

  // Guarantee enough items for smooth infinite loop if there are very few
  if (row1.length > 0 && row1.length < 6) row1 = [...row1, ...row1, ...row1, ...row1, ...row1];
  if (row2.length > 0 && row2.length < 6) row2 = [...row2, ...row2, ...row2, ...row2, ...row2];
  if (row3.length > 0 && row3.length < 6) row3 = [...row3, ...row3, ...row3, ...row3, ...row3];

  return (
    <section id="testimonials" className="py-24 px-4 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Marquee Đối tác (Đẩy lên trên) */}
        {(row1.length > 0 || row2.length > 0) && (
          <div className="mb-24 relative">
            <div className="absolute left-1/2 -top-3 -translate-x-1/2 bg-muted/30 px-4 z-10">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Đối tác tin cậy</p>
            </div>
            <div className="pt-6 md:pt-10 border-t border-border/50">
              <div className="max-w-5xl mx-auto flex flex-col gap-6 relative">
                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-[hsl(var(--muted)/0.3)] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-[hsl(var(--muted)/0.3)] to-transparent z-10 pointer-events-none"></div>

                {row1.length > 0 && (
                  <InfiniteSlider durationOnHover={500} duration={300} gap={40} className="py-4">
                    {row1.map((partner: any, index: number) => (
                      <div key={index} className="flex flex-col shrink-0 items-center justify-center opacity-80 hover:opacity-100 transition-opacity gap-3">
                        {partner.logoUrl && (
                          <img src={partner.logoUrl} alt={partner.name || "Đối tác"} className="h-14 md:h-18 w-auto object-contain max-w-[250px] transition-transform hover:scale-105" />
                        )}
                        {partner.name && (
                          <span className="font-bold text-xs md:text-sm text-foreground/70 uppercase tracking-widest whitespace-nowrap">{partner.name}</span>
                        )}
                      </div>
                    ))}
                  </InfiniteSlider>
                )}

                {row2.length > 0 && (
                  <InfiniteSlider durationOnHover={500} duration={300} gap={40} reverse className="py-4">
                    {row2.map((partner: any, index: number) => (
                      <div key={index} className="flex flex-col shrink-0 items-center justify-center opacity-80 hover:opacity-100 transition-opacity gap-3">
                        {partner.logoUrl && (
                          <img src={partner.logoUrl} alt={partner.name || "Đối tác"} className="h-14 md:h-18 w-auto object-contain max-w-[250px] transition-transform hover:scale-105" />
                        )}
                        {partner.name && (
                          <span className="font-bold text-xs md:text-sm text-foreground/70 uppercase tracking-widest whitespace-nowrap">{partner.name}</span>
                        )}
                      </div>
                    ))}
                  </InfiniteSlider>
                )}

                {row3.length > 0 && (
                  <InfiniteSlider durationOnHover={500} duration={300} gap={40} className="py-4">
                    {row3.map((partner: any, index: number) => (
                      <div key={index} className="flex flex-col shrink-0 items-center justify-center opacity-80 hover:opacity-100 transition-opacity gap-3">
                        {partner.logoUrl && (
                          <img src={partner.logoUrl} alt={partner.name || "Đối tác"} className="h-14 md:h-18 w-auto object-contain max-w-[250px] transition-transform hover:scale-105" />
                        )}
                        {partner.name && (
                          <span className="font-bold text-xs md:text-sm text-foreground/70 uppercase tracking-widest whitespace-nowrap">{partner.name}</span>
                        )}
                      </div>
                    ))}
                  </InfiniteSlider>
                )}
              </div>
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {data.badge && (<div className="inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase mb-6 bg-primary/10 text-primary border-transparent">{data.badge}</div>)}
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            dangerouslySetInnerHTML={{ __html: formatTextGradients(data.title) }}
          />
        </motion.div>

        {/* Carousel cho đánh giá Text (1 dòng) */}
        {textItems.length > 0 && (
          <div className="relative px-12 md:px-20 mb-20">
            <Carousel 
              opts={{ align: "start", loop: true }} 
              className="w-full max-w-7xl mx-auto"
            >
              <CarouselContent className="-ml-4">
                {textItems.map((item: any, index: number) => (
                  <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-card p-6 rounded-2xl border-[2px] shadow-card relative group flex flex-col items-center text-center h-full min-h-[300px] justify-between hover:shadow-card-hover transition-all duration-300"
                    >
                      <div className="absolute top-4 left-4 text-primary/10">
                        <Quote size={30} />
                      </div>
                      <div 
                        className="text-[13px] md:text-sm text-foreground/80 italic mb-6 relative z-10 prose prose-sm dark:prose-invert leading-relaxed mt-6"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      <div className="mt-auto">
                        <h4 className="font-bold text-base mb-0.5">{item.name}</h4>
                        <p className="text-[11px] text-primary font-semibold uppercase tracking-wider">{item.role}</p>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {textItems.length > 5 && (
                <>
                  <CarouselPrevious className="-left-12 h-10 w-10 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all shadow-md" />
                  <CarouselNext className="-right-12 h-10 w-10 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all shadow-md" />
                </>
              )}
            </Carousel>
          </div>
        )}

        {/* Carousel cho đánh giá Video (9:16) */}
        {videoItems.length > 0 && (
          <div className="relative px-12 md:px-16">
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent className="-ml-4 md:-ml-6 py-4">
                {videoItems.map((item: any, index: number) => (
                  <CarouselItem key={index} className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative aspect-[9/16] rounded-2xl overflow-hidden group shadow-card hover:shadow-card-hover transition-all duration-300 border border-border"
                    >
                      {/* Background: Image/Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90 z-10 pointer-events-none" />
                      <div className="absolute inset-0 bg-muted flex items-center justify-center pointer-events-none">
                         {(() => {
                           const isYoutube = item.videoUrl?.includes("youtube") || item.videoUrl?.includes("youtu.be");
                           const isDrive = item.videoUrl?.includes("drive.google.com");
                           
                           let thumb = item.thumbnailUrl;
                           
                           // If user provides a Drive link for thumbnail, convert it to direct preview link
                           if (thumb && thumb.includes("drive.google.com")) {
                             const driveId = thumb.match(/\/d\/(.+?)\/(?:view|preview)/)?.[1] || thumb.match(/id=(.+?)(?:&|$)/)?.[1];
                             if (driveId) thumb = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
                           }
                           
                           if (!thumb) {
                             if (isYoutube) {
                               const youtubeId = item.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
                               if (youtubeId) thumb = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
                             } else if (isDrive) {
                               const driveId = item.videoUrl.match(/\/d\/(.+?)\/(?:view|preview)/)?.[1] || item.videoUrl.match(/id=(.+?)(?:&|$)/)?.[1];
                               if (driveId) thumb = `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`;
                             }
                           }
                           
                           if (thumb) return <img src={thumb} alt={item.name} className="w-full h-full object-cover" />;
                           
                           return (
                             <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-4">
                               <div className="w-full h-full bg-gradient-to-br from-primary/30 via-slate-900 to-purple-900/30 absolute inset-0" />
                               <div className="relative z-10 w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                                 <Play className="w-6 h-6 text-white/40" />
                               </div>
                               <span className="relative z-10 text-xs text-white/40 font-medium">Bấm vào để xem</span>
                             </div>
                           );
                         })()}
                      </div>

                      {/* Video Play Button Overlay */}
                      {renderVideoModal(item)}

                      {/* Thông tin học viên */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none flex flex-col justify-end">
                        <h4 className="font-bold text-white text-[15px]">{item.name}</h4>
                        <p className="text-[13px] text-white/70 font-medium">{item.role}</p>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="flex -left-12 h-10 w-10 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all shadow-md" />
              <CarouselNext className="flex -right-12 h-10 w-10 border-primary/20 hover:bg-primary/10 hover:text-primary transition-all shadow-md" />
            </Carousel>
          </div>
        )}
      </div>
    </section>
  );
}
