"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseReady } from "@/services/db/supabaseClient";
import { AuthService } from "@/services/AuthService";

const Status: React.FC = () => {
  const [ready, setReady] = useState<boolean>(isSupabaseReady);
  const [token, setToken] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<Date | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  const refresh = async () => {
    setReady(isSupabaseReady);
    const t = await AuthService.getAccessToken();
    setToken(t);
    const exp = await AuthService.getTokenExpiry();
    setExpiry(exp);
    const { data } = await supabase?.auth.getUser()!;
    setEmail(data?.user?.email || null);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <AdminLayout title="System Status & API Docs">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supabase</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <Badge variant={ready ? "secondary" : "destructive"}>{ready ? "Ready" : "Not Configured"}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Current User:</span>
              <Badge variant="outline">{email || "anonymous"}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>JWT Token:</span>
              <Badge variant="outline">{token ? token.slice(0, 16) + "..." : "none"}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Expires:</span>
              <Badge variant="outline">{expiry ? expiry.toLocaleString() : "N/A"}</Badge>
            </div>
            <Button variant="outline" onClick={refresh}>Refresh</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Endpoints (Docs)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              {"POST /api/register — Create account with { username, email, password, phone } • returns ApiResponse<User>."}
            </div>
            <div>
              {"POST /api/login — Login with email or username • returns ApiResponse<User + token>."}
            </div>
            <div>
              {"POST /api/logout — Invalidate session • returns ApiResponse."}
            </div>
            <div>
              {"GET /api/me — Current user profile • returns ApiResponse<Profile>."}
            </div>
            <div>
              {"POST /api/change-password — Update password (auth required) • returns ApiResponse."}
            </div>
            <div className="border-t pt-2">
              {"GET /admin/api/users — List users (admin) • returns ApiResponse<Profile[]>."}
            </div>
            <div>
              {"POST /admin/api/users/<id>/toggle-active — Toggle user active • returns ApiResponse<Profile>."}
            </div>
            <div>
              {"GET /admin/api/stats — Basic stats • returns ApiResponse<{{ total, active, banned, verified, coins }}>."}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Note: In this client-only build, endpoints are backed by Supabase directly; configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable real JWT and database operations.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Live Dashboard route: /admin/dashboard • Users management: /admin/users • Auth pages: /auth/register, /auth/login
      </div>
    </AdminLayout>
  );
};

export default Status;