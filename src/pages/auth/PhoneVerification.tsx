import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/AuthService";
import { showError, showSuccess } from "@/utils/toast";
import ChatLayout from "@/components/chat/ChatLayout";

const PhoneVerification = () => {
  const nav = useNavigate();
  const [code, setCode] = useState("");
  return (
    <ChatLayout title="Verify Phone">
      <div className="p-6 max-w-sm mx-auto">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Verify phone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Enter 6-digit code (hint: 123456)" value={code} onChange={e => setCode(e.target.value)} />
            <Button
              className="w-full"
              onClick={() => {
                const ok = AuthService.verifyPhone(code);
                if (ok) {
                  showSuccess("Phone verified");
                  nav("/voice/rooms");
                } else {
                  showError("Invalid code");
                }
              }}
            >
              Verify
            </Button>
          </CardContent>
        </Card>
      </div>
    </ChatLayout>
  );
};

export default PhoneVerification;