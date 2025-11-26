import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


const AdminPhotos = () => {
  const [pages, setPages] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuth = localStorage.getItem("admin-auth");
    if (isAuth !== "true") {
      navigate("/admin999");
      return;
    }
    // Buscar todas as páginas do backend Express/Prisma
    const fetchPages = async () => {
      try {
        const res = await fetch("/api/pages");
        const data = await res.json();
        setPages(data || []);
      } catch (err) {
        setPages([]);
      }
    };
    fetchPages();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin-auth");
    navigate("/admin999");
  };

  return (
    <div className="min-h-screen bg-muted p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Todas as Páginas Criadas</h2>
        <Button variant="outline" onClick={handleLogout}>Sair</Button>
      </div>
      {pages.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhuma página criada ainda.</p>
      ) : (
        <div className="space-y-8">
          {pages.map((page, idx) => (
            <Card key={page.id || idx} className="p-4">
              <div className="mb-2">
                <strong>Link:</strong> <a href={`/view/${page.id}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">/view/{page.id}</a>
              </div>
              <div className="mb-2">
                <strong>Para:</strong> {page.recipient_name} <br />
                <strong>Título:</strong> {page.title}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.isArray(page.photos) && page.photos.map((photo: string, i: number) => (
                  <img key={i} src={photo} alt={`Foto ${i + 1}`} className="aspect-square w-full object-cover rounded" />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPhotos;
