import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, UserPlus, Users } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const EventArticle = () => {
  const { id } = useParams();
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();
  console.log('Fetching event with id:', id);

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, profiles(role), event_participants(user_id)')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching event:', error);
        throw error;
      }

      console.log('Fetched event:', data);
      return data;
    },
    enabled: !!id,
  });

  const { data: userRole } = useQuery({
    queryKey: ["user-role", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.role || null;
    },
    enabled: !!session?.user?.id,
  });

  const handleJoin = () => {
    if (!session?.user) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Необходимо авторизоваться",
      });
      return;
    }

    navigate(`/join-event/${id}`);
  };

  const handleViewParticipants = () => {
    navigate(`/event-participants/${id}`);
  };

  const isEmployee = userRole === "employee";
  const isUserParticipant = event?.event_participants?.some(
    (p: any) => p.user_id === session?.user?.id
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Произошла ошибка при загрузке мероприятия
          </div>
        ) : event ? (
          <article className="max-w-4xl mx-auto">
            {event.image_url && (
              <div className="aspect-video relative overflow-hidden rounded-lg mb-6">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <div className="text-muted-foreground mb-4">
              {format(new Date(event.date), 'dd.MM.yyyy HH:mm')}
            </div>
            {event.participants_limit && (
              <div className="text-muted-foreground mb-8">
                Участники: {event.current_participants} / {event.participants_limit}
              </div>
            )}
            <div className="prose prose-invert max-w-none mb-8">
              {event.description}
            </div>
            {session?.user?.id && (
              isEmployee ? (
                <Button onClick={handleViewParticipants} className="w-full md:w-auto">
                  <Users className="h-4 w-4 mr-2" />
                  Список участников
                </Button>
              ) : !isUserParticipant && (
                <Button
                  onClick={handleJoin}
                  disabled={
                    event.participants_limit &&
                    event.current_participants >= event.participants_limit
                  }
                  className="w-full md:w-auto"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Присоединиться
                </Button>
              )
            )}
          </article>
        ) : (
          <div className="text-center">
            Мероприятие не найдено
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default EventArticle;