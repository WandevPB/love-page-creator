import { useEffect, useState, useRef } from "react";
// importação removida: supabase
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Music, ArrowLeft, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import FloatingHearts from "@/components/FloatingHearts";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface PageData {
  recipientName: string;
  title: string;
  message: string;
  photos: string[];
  music: string | null;
  createdAt: string;
}

const View = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`http://54.207.26.26:3001/api/pages/${id}`);
        if (!res.ok) {
          setPageData(null);
          return;
        }
        const data = await res.json();
        setPageData(data);
      } catch (err) {
        setPageData(null);
      }
    };
    fetchPage();
  }, [id]);

  useEffect(() => {
    if (pageData?.music && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsMusicPlaying(true);
      }).catch(() => {
        // Autoplay bloqueado pelo navegador
        setIsMusicPlaying(false);
      });
    }
  }, [pageData]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isMusicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center romantic-gradient">
        <div className="text-center text-white">
          <Heart className="w-16 h-16 mx-auto mb-4 animate-heartbeat" />
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  const currentUrl = `${window.location.origin}/view/${id}`;

  return (
    <div className="min-h-screen romantic-gradient relative overflow-hidden">
      <FloatingHearts />
      
      {pageData.music && (
        <>
          <audio ref={audioRef} src={pageData.music} loop />
          <Button
            onClick={toggleMusic}
            variant="outline"
            size="icon"
            className="fixed top-4 right-16 z-50 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <Music className={`w-5 h-5 ${isMusicPlaying ? "text-primary" : ""}`} />
          </Button>
        </>
      )}

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 right-4 z-50 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
          >
            <QrCode className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-center">Compartilhe esta página</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <QRCodeSVG value={currentUrl} size={256} level="H" />
            <p className="text-sm text-muted-foreground text-center">
              Escaneie o QR Code para abrir esta página
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        onClick={() => navigate("/")}
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center animate-fade-in-up space-y-6">
            <div className="flex justify-center gap-3">
              <Heart className="w-16 h-16 md:w-24 md:h-24 text-white fill-white animate-heartbeat" />
              <Heart className="w-20 h-20 md:w-28 md:h-28 text-white fill-white animate-heartbeat" style={{ animationDelay: "0.2s" }} />
              <Heart className="w-16 h-16 md:w-24 md:h-24 text-white fill-white animate-heartbeat" style={{ animationDelay: "0.4s" }} />
            </div>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 text-shimmer leading-tight">
                {pageData.title}
              </h1>
              <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-8 py-4 border-2 border-white/40">
                <p className="text-2xl md:text-4xl text-white font-medium">
                  Para {pageData.recipientName} ♥
                </p>
              </div>
            </div>
          </div>

          {/* Photo Carousel */}
          <div className="animate-fade-in-up">
            <Carousel 
              className="w-full max-w-5xl mx-auto"
              plugins={[autoplayPlugin.current]}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {pageData.photos.map((photo, idx) => (
                  <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-2">
                      <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/50 hover:scale-105 transition-transform duration-300">
                        <img
                          src={photo}
                          alt={`Memória especial ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {pageData.photos.length > 3 && (
                <>
                  <CarouselPrevious className="bg-white/90 backdrop-blur-sm hover:bg-white" />
                  <CarouselNext className="bg-white/90 backdrop-blur-sm hover:bg-white" />
                </>
              )}
            </Carousel>
          </div>

          {/* Message Section */}
          {pageData.message && (
            <div className="animate-fade-in-up">
              <div className="bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border-2 border-white/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-center mb-6">
                    <Heart className="w-12 h-12 text-primary fill-primary" />
                  </div>
                  <p className="text-xl md:text-2xl text-foreground leading-relaxed whitespace-pre-wrap text-center font-light">
                    {pageData.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Decorative Hearts Grid */}
          <div className="grid grid-cols-5 gap-4 max-w-md mx-auto animate-fade-in-up">
            {[...Array(5)].map((_, i) => (
              <Heart 
                key={i}
                className="w-full text-white fill-white animate-heartbeat opacity-80" 
                style={{ animationDelay: `${i * 0.15}s` }} 
              />
            ))}
          </div>

          {/* Final Section with Date */}
          <div className="text-center animate-fade-in-up space-y-6 pb-8">
            <div className="flex justify-center gap-6">
              <Heart className="w-16 h-16 text-white fill-white animate-heartbeat" />
              <Heart className="w-16 h-16 text-white fill-white animate-heartbeat" style={{ animationDelay: "0.2s" }} />
              <Heart className="w-16 h-16 text-white fill-white animate-heartbeat" style={{ animationDelay: "0.4s" }} />
            </div>
            <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-6 py-3 border border-white/30">
              <p className="text-white/90 text-sm">
                Criado com amor em {new Date(pageData.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
