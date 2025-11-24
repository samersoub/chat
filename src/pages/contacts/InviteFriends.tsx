import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

const InviteFriends = () => {
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Invite a friend</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Friend's email" value={email} onChange={e => setEmail(e.target.value)} />
          <Button className="w-full" onClick={() => { setEmail(""); showSuccess("Invitation sent"); }}>
            Send invite
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default InviteFriends;