import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, loginDemo, user, ready } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);

  if (ready && user) return <Navigate to="/dashboard" />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !pwd) { toast.error("Enter email and password"); return; }
    setLoading(true);
    await login(email, pwd);
    setLoading(false);
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/30 to-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-none">J2W HRBP Console</h1>
            <p className="text-xs text-muted-foreground mt-1">Consultant lifecycle operations</p>
          </div>
        </div>
        <Card className="border-border/60 shadow-lg shadow-primary/5">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>Use your HRBP credentials, or try the demo workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@j2w.io" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwd">Password</Label>
                <Input id="pwd" type="password" placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => { loginDemo(); nav({ to: "/dashboard" }); }}>
                <Sparkles className="h-4 w-4 mr-1.5" />Continue with demo
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-4">Internal use only · J2W People Ops</p>
      </div>
    </div>
  );
}
