"use client";

import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

const slides = [
  {
    title: "ادعُ الأصدقاء واحصل على مكافآت",
    sub: "مكافآت ذهبية ومزايا حصرية",
    bg: "linear-gradient(135deg, #3b2f2f 0%, #1f1b14 60%), url('https://images.unsplash.com/photo-1548095115-45697e336b54?q=80&w=1200&auto=format&fit=crop')",
  },
  {
    title: "ترقيات VIP وتاج الملك",
    sub: "ارفع مستواك وتميّز بإطار ذهبي",
    bg: "linear-gradient(135deg, #4b2b2b 0%, #2c2218 60%), url('https://images.unsplash.com/photo-1519682335074-1c3b3b66f2d4?q=80&w=1200&auto=format&fit=crop')",
  },
  {
    title: "سجادة حمراء وجوائز يومية",
    sub: "كُن نجم الغرفة واحصل على الجوائز",
    bg: "linear-gradient(135deg, #5a2f1f 0%, #2a1e12 60%), url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop')",
  },
];

const LuxBannerCarousel: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    onSelect();
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="relative rounded-xl overflow-hidden">
      <Carousel setApi={setApi} opts={{ loop: true }}>
        <CarouselContent>
          {slides.map((s, i) => (
            <CarouselItem key={i} className="basis-full">
              <div
                className="h-40 sm:h-56 w-full bg-cover bg-center relative"
                style={{ backgroundImage: s.bg, backgroundBlendMode: "multiply" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-red-500/10" />
                <div className="absolute bottom-4 right-4 text-right text-white drop-shadow">
                  <div className="text-lg sm:text-xl font-bold">{s.title}</div>
                  <div className="text-xs sm:text-sm text-white/80 mt-1">{s.sub}</div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-3 sm:-left-4 bg-black/30 text-white border-none" />
        <CarouselNext className="-right-3 sm:-right-4 bg-black/30 text-white border-none" />
      </Carousel>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => api?.scrollTo(i)}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              index === i ? "bg-yellow-400 w-3" : "bg-white/50"
            )}
            aria-label={`go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default LuxBannerCarousel;