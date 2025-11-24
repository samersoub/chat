import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AuthService } from "@/services/AuthService";
import { showError, showSuccess } from "@/utils/toast";

const Register = () => {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPwd] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={e => setPwd(e.target.value)} />
          <Button
            className="w-full"
            onClick={() => {
              try {
                AuthService.register(email, password, name);
                showSuccess("Account created");
                nav("/auth/verify");
              } catch (e: any) {
                showError(e.message || "Register failed");
              }
            }}
          >
            Continue
          </Button>
          <div className="text-sm text-muted-foreground">
            Already have an account? <Link to="/auth/login" className="underline">Log in</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;