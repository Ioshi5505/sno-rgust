import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Council from "./pages/Council";
import Documents from "./pages/Documents";
import Support from "./pages/Support";
import Contacts from "./pages/Contacts";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import EventArticle from "./pages/EventArticle";
import JoinEvent from "./pages/JoinEvent";
import EventParticipants from "./pages/EventParticipants";
import ReceivedRequests from "./pages/ReceivedRequests";
import { supabase } from "./integrations/supabase/client";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventArticle />} />
              <Route path="/join-event/:id" element={<JoinEvent />} />
              <Route path="/event-participants/:id" element={<EventParticipants />} />
              <Route path="/login" element={<Login />} />
              <Route path="/council" element={<Council />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/support" element={<Support />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user-management" element={<UserManagement />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsArticle />} />
              <Route path="/received-requests" element={<ReceivedRequests />} />
            </Routes>
          </BrowserRouter>
        </SessionContextProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;