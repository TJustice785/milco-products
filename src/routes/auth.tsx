import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mountain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: Auth,
  head: () => ({ meta: [{ title: "Sign in — MILCO" }] }),
});

function Auth() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) nav({ to: "/account" }); });
  }, [nav]);

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(f.get("email")), password: String(f.get("password")),
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    nav({ to: "/account" });
  };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email"));
    const password = String(f.get("password"));
    const name = String(f.get("name"));

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { full_name: name },
      },
    });
    setLoading(false);
    
    if (error) return toast.error(error.message);
    
    // Save credentials to localStorage for the user to remember
    const credentials = JSON.parse(localStorage.getItem("milco_credentials") || "[]");
    credentials.push({ name, email, password, date: new Date().toLocaleString() });
    localStorage.setItem("milco_credentials", JSON.stringify(credentials));
    
    toast.success("Account created! Credentials saved in your browser.");
    nav({ to: "/account" });
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] max-w-md items-center px-4 py-12">
      <div className="w-full">
        <div className="mb-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Mountain className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold">Welcome to MILCO</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to shop and track your orders</p>
        </div>

        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <form onSubmit={onSignIn} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-glow">
                {loading ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={onSignUp} className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
              <div>
                <Label htmlFor="name2">Full name</Label>
                <Input id="name2" name="name" required />
              </div>
              <div>
                <Label htmlFor="email2">Email</Label>
                <Input id="email2" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="password2">Password</Label>
                <Input id="password2" name="password" type="password" minLength={6} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-glow">
                {loading ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
