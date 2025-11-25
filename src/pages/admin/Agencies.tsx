"use client";

import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AgencyService, type HostAgency, type RechargeAgency } from "@/services/AgencyService";
import { showSuccess } from "@/utils/toast";

const AgenciesAdmin: React.FC = () => {
  const [hosts, setHosts] = useState<HostAgency[]>([]);
  const [recharges, setRecharges] = useState<RechargeAgency[]>([]);
  const [open, setOpen] = useState(false);
  const [statement, setStatement] = useState<{ title: string; lines: Record<string, any> } | null>(null);

  const refresh = () => {
    setHosts(AgencyService.listHostAgencies());
    setRecharges(AgencyService.listRechargeAgencies());
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AdminLayout title="Agencies">
      <div className="grid gap-4">
        <Card>
          <CardHeader><CardTitle>Host Agencies</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hosts.map(h => (
                  <TableRow key={h.id}>
                    <TableCell>{h.id}</TableCell>
                    <TableCell>{h.name}</TableCell>
                    <TableCell>{h.ownerName}</TableCell>
                    <TableCell>{h.commission}%</TableCell>
                    <TableCell>{h.approved ? "Approved" : "Pending"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={h.approved ? "outline" : "default"}
                          onClick={() => {
                            AgencyService.approveHostAgency(h.id, !h.approved);
                            showSuccess(`${!h.approved ? "Approved" : "Unapproved"} ${h.name}`);
                            refresh();
                          }}
                        >
                          {h.approved ? "Unapprove" : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const st = AgencyService.hostCommissionStatement(h.id);
                            setStatement({ title: `Statement • ${h.name}`, lines: st });
                            setOpen(true);
                          }}
                        >
                          Statement
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recharge Agencies</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recharges.map(r => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell className="uppercase">{r.channel}</TableCell>
                    <TableCell>{r.commission}%</TableCell>
                    <TableCell>{r.approved ? "Approved" : "Pending"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant={r.approved ? "outline" : "default"}
                          onClick={() => {
                            AgencyService.approveRechargeAgency(r.id, !r.approved);
                            showSuccess(`${!r.approved ? "Approved" : "Unapproved"} ${r.name}`);
                            refresh();
                          }}
                        >
                          {r.approved ? "Unapprove" : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const st = AgencyService.rechargeStatement(r.id);
                            setStatement({ title: `Statement • ${r.name}`, lines: st });
                            setOpen(true);
                          }}
                        >
                          Statement
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{statement?.title || "Statement"}</DialogTitle></DialogHeader>
          <div className="space-y-2 text-sm">
            {statement &&
              Object.entries(statement.lines).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-medium">{String(v)}</span>
                </div>
              ))}
          </div>
          <DialogFooter className="mt-2">
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AgenciesAdmin;