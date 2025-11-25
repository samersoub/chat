"use client";

import React, { useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { showSuccess } from "@/utils/toast";

type AdminUser = { id: string; name: string; email: string; status?: "active" | "banned" };

const Users: React.FC = () => {
  const users = useMemo<AdminUser[]>(
    () => [
      { id: "u1", name: "Alex Johnson", email: "alex@example.com", status: "active" },
      { id: "u2", name: "Maya Ali", email: "maya@example.com", status: "active" },
      { id: "u3", name: "Omar Khan", email: "omar@example.com", status: "banned" },
    ],
    []
  );

  return (
    <AdminLayout title="Users">
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
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
                <TableCell>{u.status}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="destructive" size="sm" onClick={() => showSuccess(`Banned ${u.name}`)}>Ban</Button>
                    <Button variant="outline" size="sm" onClick={() => showSuccess(`Deleted ${u.name}`)}>Delete</Button>
                    <Button size="sm" onClick={() => showSuccess(`Editing ${u.name}`)}>Edit</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
};

export default Users;