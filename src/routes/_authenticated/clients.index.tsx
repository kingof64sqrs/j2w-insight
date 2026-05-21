import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clients, consultants, fmtINR } from "@/lib/mockData";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/clients/")({ component: ClientsPage });

const healthStyle: Record<string, string> = {
  Green: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Amber: "bg-amber-100 text-amber-800 border-amber-200",
  Red: "bg-red-100 text-red-800 border-red-200",
};

function ClientsPage() {
  const [q, setQ] = useState("");
  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.industry.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar
        title="Clients"
        subtitle={`${clients.length} active engagements · ${consultants.length} consultants deployed`}
      />
      <main className="flex-1 p-6">
        <Card className="overflow-hidden">
          <div className="p-3 border-b flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>BH Owner</TableHead>
                <TableHead className="text-right">Headcount</TableHead>
                <TableHead className="text-right">PO Value</TableHead>
                <TableHead className="text-right">Active Incidents</TableHead>
                <TableHead>KRA Health</TableHead>
                <TableHead>Last BH Call</TableHead>
                <TableHead>Next Due</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Link
                      to="/clients/$clientId"
                      params={{ clientId: c.id }}
                      className="text-primary hover:underline"
                    >
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">{c.industry}</TableCell>
                  <TableCell className="text-xs">{c.bhOwner}</TableCell>
                  <TableCell className="text-right">{c.headcount}</TableCell>
                  <TableCell className="text-right">{fmtINR(c.poValue)}</TableCell>
                  <TableCell className="text-right">{c.activeIncidents}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={healthStyle[c.kraHealth]}>
                      {c.kraHealth}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{c.lastBhCall}</TableCell>
                  <TableCell className="text-xs">{c.nextDue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
