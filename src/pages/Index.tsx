// Update this page (the content is just a fallback if you fail to update the page)

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-2xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">Voice Chat (Web)</h1>
        <Card>
          <CardContent className="p-6 grid gap-3 sm:grid-cols-2">
            <Button asChild><Link to="/auth/login">Login</Link></Button>
            <Button asChild variant="outline"><Link to="/auth/register">Register</Link></Button>
            <Button asChild><Link to="/voice/rooms">Room List</Link></Button>
            <Button asChild variant="outline"><Link to="/voice/create">Create Room</Link></Button>
            <Button asChild><Link to="/contacts">Contacts</Link></Button>
            <Button asChild variant="outline"><Link to="/contacts/invite">Invite Friends</Link></Button>
            <Button asChild><Link to="/profile">Profile</Link></Button>
            <Button asChild variant="outline"><Link to="/settings">Settings</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;