import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/AuthService";
import { showError, showSuccess } from "@/utils/toast";

const Login = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPwd(e.target.value)} />
          <Button
            className="w-full"
            onClick={() => {
              try {
                AuthService.login(email, password);
                showSuccess("Logged in");
                nav("/voice/rooms");
              } catch (e: any) {
                showError(e.message || "Login failed");
              }
            }}
          >
            Continue
          </Button>
          <div className="text-sm text-muted-foreground">
            New here? <Link to="/auth/register" className="underline">Create an account</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;