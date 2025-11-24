// Update this page (the content is just a fallback if you fail to update the page)

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";
import ChatLayout from "@/components/chat/ChatLayout";

const Index = () => {
  return (
    <ChatLayout title="Welcome">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Welcome to Lama Chat</h2>
          <p className="text-sm text-muted-foreground">
            Create a room to start a conversation, or browse existing rooms from the sidebar.
          </p>
          <Card>
            <CardContent className="p-6 grid gap-3 sm:grid-cols-2">
              <Button asChild><Link to="/voice/create">Create Room</Link></Button>
              <Button asChild variant="outline"><Link to="/voice/rooms">Browse Rooms</Link></Button>
              <Button asChild><Link to="/contacts">Contacts</Link></Button>
              <Button asChild variant="outline"><Link to="/settings">Settings</Link></Button>
            </CardContent>
          </Card>
          <div className="pt-2">
            <MadeWithDyad />
          </div>
        </div>
      </div>
    </ChatLayout>
  );
};

export default Index;