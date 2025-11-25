import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Music, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import FloatingHearts from "@/components/FloatingHearts";

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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(`romantic-page-${id}`);
    if (stored) {
      setPageData(JSON.parse(stored));
    }
  }, [id]);

  useEffect(() => {
    if (pageData?.photos && pageData.photos.length > 1) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prev) => (prev + 1) % pageData.photos.length);
      }, 4000);
      return () => clearInterval(interval);
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
            className="fixed top-4 right-4 z-50 rounded-full bg-white/90 backdrop-blur-sm"
          >
            <Music className={`w-5 h-5 ${isMusicPlaying ? "text-primary" : ""}`} />
          </Button>
        </>
      )}

      <Button
        onClick={() => navigate("/")}
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 rounded-full bg-white/90 backdrop-blur-sm"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center animate-fade-in-up">
            <div className="mb-6">
              <Heart className="w-20 h-20 mx-auto text-white animate-heartbeat" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shimmer">
              {pageData.title}
            </h1>
            <p className="text-2xl md:text-3xl text-white/95 font-light">
              Para {pageData.recipientName}
            </p>
          </div>

          {/* Photo Gallery */}
          <div className="relative aspect-[3/4] md:aspect-video rounded-3xl overflow-hidden shadow-2xl animate-fade-in-up">
            {pageData.photos.map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Foto ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  idx === currentPhotoIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            {pageData.photos.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {pageData.photos.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentPhotoIndex
                        ? "bg-white w-8"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Message */}
          {pageData.message && (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-xl animate-fade-in-up">
              <p className="text-lg md:text-xl text-foreground leading-relaxed whitespace-pre-wrap text-center">
                {pageData.message}
              </p>
            </div>
          )}

          {/* Final Hearts */}
          <div className="flex justify-center gap-4 animate-fade-in-up">
            <Heart className="w-12 h-12 text-white fill-white animate-heartbeat" />
            <Heart className="w-12 h-12 text-white fill-white animate-heartbeat" style={{ animationDelay: "0.2s" }} />
            <Heart className="w-12 h-12 text-white fill-white animate-heartbeat" style={{ animationDelay: "0.4s" }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default View;
