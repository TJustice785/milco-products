import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact MILCO — Sefika Complex, Maseru" },
      { name: "description", content: "Get in touch with MILCO. Visit us at Sefika Complex, Maseru, or call +266 5892 1648." },
    ],
  }),
});

function Contact() {
  const [sending, setSending] = useState(false);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Thanks! We'll get back to you within 24 hours.");
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-10 max-w-2xl">
        <h1 className="font-display text-4xl font-bold">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">Visit our store, call our team, or send a message — we'd love to hear from you.</p>
      </header>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary"><MapPin className="h-5 w-5" /></div>
              <div>
                <h3 className="font-display text-lg font-semibold">Visit us</h3>
                <p className="text-sm text-muted-foreground">Sefika Complex, Maseru, Lesotho</p>
                <p className="mt-1 text-sm text-muted-foreground">Mon – Sat · 8:00 – 18:00</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary"><Phone className="h-5 w-5" /></div>
              <div>
                <h3 className="font-display text-lg font-semibold">Call us</h3>
                <a href="tel:+26658921648" className="text-sm text-muted-foreground hover:text-primary">+266 5892 1648</a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary"><Mail className="h-5 w-5" /></div>
              <div>
                <h3 className="font-display text-lg font-semibold">Email</h3>
                <a href="mailto:hello@milco.co.ls" className="text-sm text-muted-foreground hover:text-primary">hello@milco.co.ls</a>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
            <h3 className="font-display text-lg font-semibold">Follow us</h3>
            <div className="mt-3 flex gap-3">
              <a href="https://facebook.com" aria-label="Facebook" className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground"><Facebook className="h-4 w-4" /></a>
              <a href="https://instagram.com" aria-label="Instagram" className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground"><Instagram className="h-4 w-4" /></a>
              <a href="https://twitter.com" aria-label="Twitter" className="grid h-11 w-11 place-items-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-primary-foreground"><Twitter className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-[var(--gradient-card)] p-6 shadow-[var(--shadow-soft)]">
          <h3 className="font-display text-xl font-semibold">Send a message</h3>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="msg">Message</Label>
            <Textarea id="msg" name="msg" rows={5} required />
          </div>
          <Button type="submit" disabled={sending} className="w-full bg-primary hover:bg-primary-glow">
            <Send className="mr-2 h-4 w-4" /> {sending ? "Sending…" : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
}
