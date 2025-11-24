import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthService } from "@/services/AuthService";
import { showSuccess } from "@/utils/toast";

const Settings = () => {
  const nav = useNavigate();
  return (
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
  );
};

export default Settings;