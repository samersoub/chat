import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PhoneVerification from "./pages/auth/PhoneVerification";
import RoomList from "./pages/voice-chat/RoomList";
import CreateRoom from "./pages/voice-chat/CreateRoom";
import VoiceChat from "./pages/voice-chat/VoiceChat";
import RoomDetails from "./pages/voice-chat/RoomDetails";
import Contacts from "./pages/contacts/Contacts";
import InviteFriends from "./pages/contacts/InviteFriends";
import Profile from "./pages/profile/Profile";
import Settings from "./pages/profile/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/verify" element={<PhoneVerification />} />
          <Route path="/voice/rooms" element={<RoomList />} />
          <Route path="/voice/create" element={<CreateRoom />} />
          <Route path="/voice/rooms/:id" element={<RoomDetails />} />
          <Route path="/voice/rooms/:id/join" element={<VoiceChat />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/invite" element={<InviteFriends />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;