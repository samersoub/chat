"use client";

import React, { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { VoiceChatService } from "@/services/VoiceChatService";
import { MusicService } from "@/services/MusicService";
import { ReportService } from "@/services/ReportService";
import { showSuccess } from "@/utils/toast";

type ApprovalPoint = { label: string; count: number };
type AutoAction = { type: string; target?: string; at: number; roomId: string; priority: string };

function computeMetrics() {
  const now = Date.now();
  const dayAgo = now - 24 * 60 * 60 * 1000;
  const rooms = VoiceChatService.listRooms();

  let participantsTotal = 0;
  let queueTotal = 0;

  const counts = new Array<number>(24).fill(0);
  const autoActions: AutoAction[] = [];

  rooms.forEach((r) => {
    participantsTotal += r.participants?.length ?? 0;

    const q = MusicService.getQueue(r.id);
    queueTotal += q.length;

    // approvals in last 24h
    q.forEach((req) => {
      if (req.approved && req.createdAt >= dayAgo) {
        const bucket = Math.floor((now - req.createdAt) / 3600000);
        if (bucket >= 0 && bucket < 24) {
          const idx = 23 - bucket; // oldest to newest
          counts[idx] += 1;
        }
      }
    });

    // auto-moderation actions in last 24h
    const reports = ReportService.list(r.id).filter((rep) => rep.createdAt >= dayAgo && rep.autoActionApplied);
    reports.forEach((rep) => {
      autoActions.push({
        type: rep.type,
        target: rep.targetUserId,
        at: rep.createdAt,
        roomId: r.id,
        priority: rep.priority,
      });
    });
  });

  // Build chart points (oldest -> newest)
  const approvals: ApprovalPoint[] = counts.map((c, i) => {
    const ts = now - (23 - i) * 3600000;
    const label = new Date(ts).toLocaleTimeString([], { hour: "2-digit" });
    return { label, count: c };
  });

  // Sort auto actions by time desc
  autoActions.sort((a, b) => b.at - a.at);

  return {
    roomsCount: rooms.length,
    participantsTotal,
    queueTotal,
    approvals,
    autoActions: autoActions.slice(0, 6),
  };
}

const Status: React.FC = () => {
  const [data, setData] = useState(() => computeMetrics());

  const summary = useMemo(
    () => [
      { label: "Rooms", value: data.roomsCount },
      { label: "Participants", value: data.participantsTotal },
      { label: "Queue size", value: data.queueTotal },
    ],
    [data],
  );

  return (
    <AdminLayout title="Status">
      <div className="grid gap-4">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {summary.map((s) => (
            <Card key={s.label}>
              <CardHeader><CardTitle className="text-base">{s.label}</CardTitle></CardHeader>
              <CardContent><div className="text-3xl font-bold">{s.value}</div></CardContent>
            </Card>
          ))}
        </div>

        {/* Approvals in last 24h */}
        <Card>
          <CardHeader><CardTitle>Approvals (last 24 hours)</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.approvals}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent auto-moderation actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Auto Actions</span>
              <Button variant="outline" size="sm" onClick={() => { setData(computeMetrics()); showSuccess("Refreshed"); }}>
                Refresh
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.autoActions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-xs text-muted-foreground">
                      No auto actions in the last 24 hours.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.autoActions.map((a, idx) => (
                    <TableRow key={`${a.roomId}-${a.at}-${idx}`}>
                      <TableCell className="capitalize">{a.type.replace("-", " ")}</TableCell>
                      <TableCell>{a.roomId}</TableCell>
                      <TableCell>{a.target ?? "—"}</TableCell>
                      <TableCell className="capitalize">{a.priority}</TableCell>
                      <TableCell>{new Date(a.at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Status;