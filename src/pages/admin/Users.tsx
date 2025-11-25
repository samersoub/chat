"use client";

import React, { useMemo, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type AdminUser = { id: string; name: string; email: string; status?: "active" | "banned"; country?: string; lastLogin?: string };

const Users: React.FC = () => {
  const users = useMemo<AdminUser[]>(
    () => [
      { id: "u1", name: "Alex Johnson", email: "alex@example.com", status: "active", country: "US", lastLogin: "2025-11-20" },
      { id: "u2", name: "Maya Ali", email: "maya@example.com", status: "active", country: "AE", lastLogin: "2025-11-22" },
      { id: "u3", name: "Omar Khan", email: "omar@example.com", status: "banned", country: "JO", lastLogin: "2025-11-18" },
    ],
    []
  );

  const [balanceOpen, setBalanceOpen] = useState(false);
  const [coins, setCoins] = useState<string>("");
  const [diamonds, setDiamonds] = useState<string>("");
  const [targetUser, setTargetUser] = useState<AdminUser | null>(null);

  return (
    <AdminLayout title="Users">
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.id}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.country}</TableCell>
                <TableCell>{u.lastLogin}</TableCell>
                <TableCell>{u.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant={u.status === "banned" ? "outline" : "destructive"}
                      size="sm"
                      onClick={() => showSuccess(`${u.status === "banned" ? "Unbanned" : "Banned"} ${u.name}`)}
                    >
                      {u.status === "banned" ? "Unban" : "Ban"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => showSuccess(`Reset password for ${u.name}`)}>
                      Reset Password
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setTargetUser(u);
                        setBalanceOpen(true);
                      }}
                    >
                      Adjust Balance
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={balanceOpen} onOpenChange={setBalanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Balance {targetUser ? `• ${targetUser.name}` : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Input placeholder="Coins" value={coins} onChange={(e) => setCoins(e.target.value)} />
            <Input placeholder="Diamonds" value={diamonds} onChange={(e) => setDiamonds(e.target.value)} />
          </div>
          <DialogFooter className="mt-3">
            <Button
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white"
              onClick={() => {
                showSuccess(`Updated ${targetUser?.name}: Coins=${coins || 0}, Diamonds=${diamonds || 0}`);
                setCoins("");
                setDiamonds("");
                setBalanceOpen(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Users;