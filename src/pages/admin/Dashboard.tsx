"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { day: "Mon", coins: 120, gifts: 40 },
  { day: "Tue", coins: 200, gifts: 52 },
  { day: "Wed", coins: 180, gifts: 65 },
  { day: "Thu", coins: 240, gifts: 90 },
  { day: "Fri", coins: 300, gifts: 120 },
  { day: "Sat", coins: 280, gifts: 110 },
  { day: "Sun", coins: 260, gifts: 95 },
];

const Dashboard: React.FC = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader><CardTitle>Daily Coins vs Gifts</CardTitle></CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="coins" stroke="#6366F1" strokeWidth={2} />
                <Line type="monotone" dataKey="gifts" stroke="#EC4899" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Users</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">1,248</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Rooms</CardTitle></CardHeader>
          <CardContent><div className="text-3xl font-bold">86</div></CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;