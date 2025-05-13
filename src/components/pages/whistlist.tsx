import { useMutation } from "convex/react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { GridPattern } from "../magicui/grid-pattern";
const Whistlist = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const addToWaitlist = useMutation(api.whistlist.newWhistlist);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    await addToWaitlist({ email });
    setEmail("");
    toast.success("Thank you! You have been added to the waitlist");
    setLoading(false);
  };

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-2">
      <GridPattern strokeDasharray={"4 2"} />
      <Card className="p-4 z-10 container gap-6 max-w-4xl flex md:flex-row flex-col shadow-2xl shadow-orange-600/15 rounded-xl border-foreground/20">
        <div className="flex-1 p-6 flex flex-col items-start justify-center">
          <h1 className="text-3xl text-pretty font-bold">
            A modern <span className="bg-foreground/10">open-source</span> platform for assessments and quizzes
          </h1>
          <p className="mt-4">
            Online examination platform that makes creating, distributing, and
            analyzing tests easy and secure.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex md:flex-row flex-col md:items-center gap-2 mt-8 w-full"
          >
            <Input
              type="email"
              required
              className="h-10 border-foreground/50"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button size={"lg"} type="submit" disabled={loading}>
              {loading ? "Adding..." : "Join the waitlist"}
            </Button>
          </form>
        </div>
        <div className="flex-1 h-[50vh] aspect-square hidden md:block bg-[url('/images/login-bg.webp')] bg-cover bg-center rounded-lg"></div>
      </Card>
    </div>
  );
};

export default Whistlist;
