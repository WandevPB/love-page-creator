import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Image, Music, Gift } from "lucide-react";
import FloatingHearts from "@/components/FloatingHearts";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen romantic-gradient relative overflow-hidden">
      <FloatingHearts />
      
      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12 animate-fade-in-up">
            <Heart className="w-24 h-24 mx-auto mb-6 text-white animate-heartbeat" />
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shimmer">
              Momentos de Amor
            </h1>
            <p className="text-xl md:text-2xl text-white/95 mb-8 leading-relaxed">
              Crie uma página romântica personalizada com fotos, mensagens e música.<br />
              O presente perfeito para expressar seu amor! 💝
            </p>
            <Button
              onClick={() => navigate("/create")}
              size="lg"
              className="text-lg px-8 py-6 sunset-gradient border-0 text-white hover:scale-105 transition-transform"
            >
              <Sparkles className="w-6 h-6 mr-2" />
              Criar Página Romântica
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-in-up">
              <Image className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Suas Fotos</h3>
              <p className="text-muted-foreground">
                Adicione quantas fotos quiser para criar uma galeria linda
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <Music className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Música de Fundo</h3>
              <p className="text-muted-foreground">
                Escolha a música especial de vocês para tocar de fundo
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Gift className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Presente Único</h3>
              <p className="text-muted-foreground">
                Crie algo especial e compartilhe com quem você ama
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-white/95 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Pronto para surpreender? ✨
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Leva apenas alguns minutos para criar algo inesquecível
            </p>
            <Button
              onClick={() => navigate("/create")}
              size="lg"
              className="romantic-gradient border-0 text-white text-lg px-8 py-6"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
