"use client";

import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { EconomyService } from "@/services/EconomyService";

const financial = [
  { day: "Mon", recharge: 120, gifts: 50 },
  { day: "Tue", recharge: 180, gifts: 70 },
  { day: "Wed", recharge: 160, gifts: 65 },
  { day: "Thu", recharge: 210, gifts: 90 },
  { day: "Fri", recharge: 260, gifts: 130 },
  { day: "Sat", recharge: 240, gifts: 120 },
  { day: "Sun", recharge: 220, gifts: 100 },
];

const hosts = [
  { id: "h1", name: "Host A", salary: 500, commission: 15, approved: true },
  { id: "h2", name: "Host B", salary: 450, commission: 12, approved: false },
  { id: "h3", name: "Host C", salary: 600, commission: 18, approved: true },
];

const Reports: React.FC = () => {
  return (
    <AdminLayout title="Reports">
      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="financial">Financial Stats</TabsTrigger>
          <TabsTrigger value="agency">Agency / Agents</TabsTrigger>
          <TabsTrigger value="recharges">Recharge Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="financial">
          <Card>
            <CardHeader><CardTitle>Daily Coin Recharges & Gift Transactions</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={financial}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="recharge" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="gifts" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="agency">
          <div className="grid gap-3">
            {hosts.map((h) => (
              <Card key={h.id}>
                <CardHeader><CardTitle className="text-base">{h.name}</CardTitle></CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Salary: ${h.salary} • Commission: {h.commission}%
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant={h.approved ? "outline" : "default"} onClick={() => showSuccess(`${h.approved ? "Unapproved" : "Approved"} ${h.name}`)}>
                      {h.approved ? "Unapprove" : "Approve"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => showSuccess(`Edit ${h.name}`)}>Edit</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recharges">
          <Card>
            <CardHeader><CardTitle>Recent Coin Recharges</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>TX</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {EconomyService.getLogs()
                    .filter((l) => l.type === "recharge")
                    .slice(-50)
                    .reverse()
                    .map((l) => (
                      <TableRow key={l.id}>
                        <TableCell className="font-mono text-xs">{l.id}</TableCell>
                        <TableCell className="capitalize">{(l.meta?.channel as string) || "-"}</TableCell>
                        <TableCell>{l.amount}</TableCell>
                        <TableCell>{new Date(l.at).toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default Reports;