"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

const Settings: React.FC = () => {
  return (
    <AdminLayout title="Settings">
      <Card className="max-w-xl">
        <CardHeader><CardTitle>System Settings</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={() => showSuccess("Settings saved")} className="w-full">Save Settings</Button>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default Settings;