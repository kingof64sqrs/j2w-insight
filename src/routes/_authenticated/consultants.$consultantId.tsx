import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { TopBar } from "@/components/TopBar";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { consultants, clients, signals, tickets, sentEmails, cohortBadgeStyles, riskBadgeStyles, fmtINR } from "@/lib/mockData";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/consultants/$consultantId")({
  loader: ({ params }) => {
    const c = consultants.find(x => x.id === params.consultantId);
    if (!c) throw notFound();
    return { c };
  },
  component: ConsultantProfile,
  notFoundComponent: () => <div className="p-10">Consultant not found.</div>,
});

function ConsultantProfile() {
  const { c } = Route.useLoaderData();
  const client = clients.find(cl => cl.id === c.clientId);
  const mySignals = signals.filter(s => s.consultantId === c.id);
  const myTickets = tickets.filter(t => t.consultantId === c.id);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className="flex-1 p-6 space-y-6">
        <Link to="/clients/$clientId" params={{ clientId: c.clientId }} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4 mr-1" />Back to {client?.name}</Link>
        <PageHeader
          title={c.name}
          subtitle={`${c.empId} · ${c.skill} · ${c.modality} at ${client?.name}`}
          actions={<Badge variant="outline" className={cohortBadgeStyles[c.cohort]}>{c.cohort}</Badge>}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { l: "Manager", v: c.manager },
            { l: "PO Amount", v: fmtINR(c.poAmount) },
            { l: "CTC", v: fmtINR(c.ctc) },
            { l: "Margin", v: fmtINR(c.margin) },
            { l: "Tenure", v: c.tenure },
            { l: "NPS", v: c.nps },
            { l: "Hike", v: c.hike },
            { l: "L&D Status", v: c.ldStatus },
          ].map(s => (
            <Card key={s.l}><CardContent className="p-3">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.l}</div>
              <div className="text-sm font-semibold mt-1 truncate">{s.v}</div>
            </CardContent></Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pip">PIP Tracker</TabsTrigger>
            <TabsTrigger value="signals">Signal Log</TabsTrigger>
            <TabsTrigger value="comms">Communications</TabsTrigger>
            <TabsTrigger value="routine">Routine Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card><CardContent className="p-4">
                <h4 className="font-semibold mb-3">Contract timeline</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Joined</span><span>2024-08-15</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Current PO</span><span>2025-08-15 → 2026-08-15</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Renewal window</span><span>Opens 2026-05-15</span></div>
                </div>
              </CardContent></Card>
              <Card><CardContent className="p-4">
                <h4 className="font-semibold mb-3">BH Feedback</h4>
                <p className="text-sm text-muted-foreground">{c.bhFeedback}</p>
              </CardContent></Card>
              <Card className="lg:col-span-2"><CardContent className="p-4">
                <h4 className="font-semibold mb-2">Retention / Opening Script</h4>
                <p className="text-sm text-muted-foreground italic">"Hi {c.name}, I wanted to take 15 minutes to check in on your experience at {client?.name}. What's been going well, and where can we support you better?"</p>
              </CardContent></Card>
            </div>
          </TabsContent>

          <TabsContent value="pip" className="space-y-4 mt-4">
            <Card><CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">30-day PIP progress</h4>
                  <p className="text-xs text-muted-foreground">Started 2026-05-01 · Ends 2026-05-31</p>
                </div>
                <span className="text-sm font-medium">Day 17 of 30</span>
              </div>
              <Progress value={56} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                {["Week 1 — Foundation", "Week 2 — Stretch", "Week 3 — Demonstrate"].map((w, i) => (
                  <div key={w} className="border rounded-md p-3">
                    <div className="text-sm font-medium">{w}</div>
                    <div className={`text-xs mt-1 ${i < 2 ? "text-emerald-600" : "text-amber-600"}`}>{i < 2 ? "Completed" : "Scheduled"}</div>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <h5 className="text-sm font-medium mb-2">Skill gap focus</h5>
                <div className="flex flex-wrap gap-1.5">
                  {["Stakeholder updates", "Code review velocity", "Documentation"].map(s => <Badge key={s} variant="outline">{s}</Badge>)}
                </div>
              </div>
              <div className="pt-2 text-sm text-muted-foreground">Next check-in: <span className="text-foreground font-medium">Friday 11:00 with {c.manager}</span></div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="signals" className="mt-4">
            <Card>
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Signal log</h4>
                  <p className="text-xs text-muted-foreground">Risk score: <span className="font-medium text-foreground">{c.riskScore}/100</span></p>
                </div>
                <Button size="sm" onClick={() => toast.success("Signal recorded")}><Plus className="h-4 w-4 mr-1" />Add signal</Button>
              </div>
              <Table>
                <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Risk</TableHead><TableHead>Action taken</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mySignals.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">No signals recorded.</TableCell></TableRow>}
                  {mySignals.map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.type}</TableCell>
                      <TableCell><Badge variant="outline" className={riskBadgeStyles[s.risk]}>{s.risk}</Badge></TableCell>
                      <TableCell className="text-xs">{s.action}</TableCell>
                      <TableCell className="text-xs">{s.at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="comms" className="mt-4">
            <Card><Table>
              <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Template</TableHead><TableHead>Subject</TableHead><TableHead>Recipient</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {sentEmails.map(e => (
                  <TableRow key={e.id}>
                    <TableCell className="text-xs">{e.date}</TableCell>
                    <TableCell className="text-xs">{e.template}</TableCell>
                    <TableCell className="text-xs">{e.subject}</TableCell>
                    <TableCell className="text-xs">{e.recipient}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{e.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table></Card>
          </TabsContent>

          <TabsContent value="routine" className="mt-4">
            <Card><CardContent className="p-4 space-y-3">
              {[
                { t: "Monthly check-in", d: "2026-05-22", o: c.manager },
                { t: "NPS call", d: "2026-05-26", o: "HRBP" },
                { t: "BH follow-up", d: "2026-06-02", o: client?.bhOwner ?? "BH" },
              ].map(r => (
                <div key={r.t} className="flex items-center justify-between border rounded-md p-3">
                  <div>
                    <div className="text-sm font-medium">{r.t}</div>
                    <div className="text-xs text-muted-foreground">Owner: {r.o}</div>
                  </div>
                  <div className="text-sm">{r.d}</div>
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>
        </Tabs>

        {myTickets.length > 0 && (
          <Card>
            <div className="p-4 border-b"><h4 className="font-semibold">Active tickets</h4></div>
            <Table>
              <TableHeader><TableRow><TableHead>Ticket</TableHead><TableHead>SOP</TableHead><TableHead>Status</TableHead><TableHead>Risk</TableHead><TableHead>Owner</TableHead></TableRow></TableHeader>
              <TableBody>
                {myTickets.map(t => (
                  <TableRow key={t.id}>
                    <TableCell><Link to="/tickets/$ticketId" params={{ ticketId: t.id }} className="text-primary hover:underline">{t.id}</Link></TableCell>
                    <TableCell className="text-xs">{t.sopType}</TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{t.status}</Badge></TableCell>
                    <TableCell><Badge variant="outline" className={riskBadgeStyles[t.riskLevel]}>{t.riskLevel}</Badge></TableCell>
                    <TableCell className="text-xs">{t.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </main>
    </div>
  );
}
