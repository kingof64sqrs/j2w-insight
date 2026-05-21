import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  clients,
  consultants,
  cohortBadgeStyles,
  fmtINR,
  type Cohort,
  type Client,
} from "@/lib/mockData";
import { Search, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/_authenticated/clients/$clientId")({
  loader: ({ params }) => {
    const client = clients.find((c) => c.id === params.clientId);
    if (!client) throw notFound();
    return { client };
  },
  component: ClientDetail,
  notFoundComponent: () => <div className="p-10">Client not found.</div>,
});

const cohortFilters: Cohort[] = [
  "Star",
  "High Performer",
  "Rising",
  "Bedrock",
  "New Joiner",
  "Watch Exit",
  "Watch Rate Revision",
  "Watch General",
  "Rescue/PIP",
];

function ClientDetail() {
  const { client } = Route.useLoaderData() as { client: Client };
  const [q, setQ] = useState("");
  const [cohort, setCohort] = useState<Cohort | null>(null);

  const list = consultants.filter((c) => c.clientId === client.id);
  const filtered = list.filter(
    (c) =>
      (!cohort || c.cohort === cohort) &&
      (c.name.toLowerCase().includes(q.toLowerCase()) ||
        c.skill.toLowerCase().includes(q.toLowerCase())),
  );

  const dist = cohortFilters.map((co) => ({ co, n: list.filter((x) => x.cohort === co).length }));

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title={client.name} subtitle={`${client.industry} · BH owner ${client.bhOwner}`} />
      <main className="flex-1 p-6 space-y-6">
        <Link
          to="/clients"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          All clients
        </Link>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Headcount", v: client.headcount },
            { l: "PO Value", v: fmtINR(client.poValue) },
            { l: "Active Incidents", v: client.activeIncidents },
            { l: "KRA Health", v: client.kraHealth },
          ].map((s) => (
            <Card key={s.l}>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">{s.l}</div>
                <div className="text-xl font-semibold mt-1">{s.v}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">Cohort distribution</h3>
            <div className="flex flex-wrap gap-2">
              {dist.map((d) => (
                <button
                  key={d.co}
                  onClick={() => setCohort(cohort === d.co ? null : d.co)}
                  className={`text-xs px-2.5 py-1 rounded-md border ${cohortBadgeStyles[d.co]} ${cohort === d.co ? "ring-2 ring-primary" : ""}`}
                >
                  {d.co} · {d.n}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 border-b flex items-center gap-2">
            <div className="relative max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 h-9"
                placeholder="Search consultants..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            {cohort && (
              <Button size="sm" variant="ghost" onClick={() => setCohort(null)}>
                Clear cohort
              </Button>
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consultant</TableHead>
                <TableHead>Emp ID</TableHead>
                <TableHead>Skill</TableHead>
                <TableHead>Cohort</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead className="text-right">PO</TableHead>
                <TableHead className="text-right">NPS</TableHead>
                <TableHead>Tenure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    <Link
                      to="/consultants/$consultantId"
                      params={{ consultantId: c.id }}
                      className="text-primary hover:underline"
                    >
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs">{c.empId}</TableCell>
                  <TableCell className="text-xs">{c.skill}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cohortBadgeStyles[c.cohort] + " text-xs"}>
                      {c.cohort}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">{c.manager}</TableCell>
                  <TableCell className="text-right text-xs">{fmtINR(c.poAmount)}</TableCell>
                  <TableCell className="text-right text-xs">{c.nps}</TableCell>
                  <TableCell className="text-xs">{c.tenure}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                    No consultants match.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
}
