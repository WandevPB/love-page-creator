import { useState } from "react";
// import { supabase } from "@/lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Heart, Upload, Music, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    recipientName: "",
    title: "",
    message: "",
    photos: [] as File[],
    musicFile: null as File | null,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, photos: [...formData.photos, ...files] });
  };

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, musicFile: file });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.recipientName || !formData.title || formData.photos.length === 0) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o nome, título e adicione pelo menos uma foto",
        variant: "destructive",
      });
      return;
    }



    // Envio de arquivos deve ser feito como multipart/form-data
    const form = new FormData();
    form.append("recipientName", formData.recipientName);
    form.append("title", formData.title);
    form.append("message", formData.message);
    formData.photos.forEach((photo) => {
      form.append("photos", photo);
    });
    if (formData.musicFile) {
      form.append("music", formData.musicFile);
    }
    const pageRes = await fetch("http://18.231.76.48:3000/api/pages", {
      method: "POST",
      body: form,
    });
    const result = await pageRes.json();
    if (!pageRes.ok || !result.id) {
      toast({ title: "Erro ao salvar página", description: result.error || "Erro desconhecido", variant: "destructive" });
      return;
    }
    toast({
      title: "Página criada! 💝",
      description: "Sua página romântica está pronta!",
    });
    navigate(`/view/${result.id}`);
  };

  return (
    <div className="min-h-screen romantic-gradient p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <Heart className="w-16 h-16 mx-auto mb-4 text-white animate-heartbeat" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Crie sua Página Romântica
          </h1>
          <p className="text-white/90 text-lg">
            Faça algo especial para quem você ama ❤️
          </p>
        </div>

        <Card className="p-6 md:p-8 backdrop-blur-sm bg-white/95">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="recipientName">Para quem é?</Label>
              <Input
                id="recipientName"
                placeholder="Nome da pessoa amada"
                value={formData.recipientName}
                onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título da Página</Label>
              <Input
                id="title"
                placeholder="Ex: Feliz Aniversário, Meu Amor!"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Mensagem Especial</Label>
              <Textarea
                id="message"
                placeholder="Escreva uma mensagem do coração..."
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Fotos ({formData.photos.length})</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("photo-upload")?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Adicionar Fotos
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </div>
              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {formData.photos.map((photo, idx) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Música de Fundo (Opcional)</Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById("music-upload")?.click()}
                >
                  <Music className="w-4 h-4 mr-2" />
                  {formData.musicFile ? formData.musicFile.name : "Adicionar Música"}
                </Button>
                <input
                  id="music-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleMusicUpload}
                />
              </div>
            </div>

            <Button type="submit" className="w-full text-lg romantic-gradient border-0">
              <Sparkles className="w-5 h-5 mr-2" />
              Gerar Página Romântica
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Create;
