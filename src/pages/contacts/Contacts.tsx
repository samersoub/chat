import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ChatLayout from "@/components/chat/ChatLayout";

type Contact = { id: string; name: string; email?: string };

const Contacts = () => {
  const contacts = useMemo<Contact[]>(
    () => [
      { id: "1", name: "Alex Johnson", email: "alex@example.com" },
      { id: "2", name: "Sam Patel", email: "sam@example.com" },
    ],
    []
  );

  return (
    <ChatLayout title="Contacts">
      <div className="mx-auto max-w-2xl p-4 space-y-3">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        {contacts.map(c => (
          <Card key={c.id}>
            <CardHeader><CardTitle className="text-base">{c.name}</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">{c.email}</CardContent>
          </Card>
        ))}
      </div>
    </ChatLayout>
  );
};

export default Contacts;