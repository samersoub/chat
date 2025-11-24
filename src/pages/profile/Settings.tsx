import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from "@/services/AuthService";
import { showSuccess } from "@/utils/toast";
import ChatLayout from "@/components/chat/ChatLayout";

const Settings = () => {
  const nav = useNavigate();
  return (
    <ChatLayout title="Settings">
      <div className="mx-auto max-w-xl p-4">
        <Card>
          <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" onClick={() => { AuthService.logout(); showSuccess("Logged out"); nav("/"); }}>
              Log out
            </Button>
          </CardContent>
        </Card>
      </div>
    </ChatLayout>
  );
};

export default Settings;