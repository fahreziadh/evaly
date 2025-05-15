import { useMutation } from "convex/react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { useState } from "react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
import { GridPattern } from "../magicui/grid-pattern";
import { GithubIcon } from "lucide-react";
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
      <Card className="p-2 z-10 container gap-6 max-w-5xl flex md:flex-row flex-col rounded-xl border-foreground/25">
        <div className="flex-1 p-3 md:p-6 flex flex-col items-start justify-center">
          <a href="https://github.com/fahreziadh/evaly">
            <Button variant={"outline-solid"} size={"xs"} className="w-max mb-4 px-2" rounded>
              <GithubIcon /> Star on Github
            </Button>
          </a>
          <h1 className="text-3xl text-pretty font-bold">
            A modern <span className="bg-foreground/10">open-source</span>{" "}
            platform for assessments and quizzes
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
        <div className="flex-1 h-[40vh] aspect-square hidden md:block bg-[url('/images/login-bg.webp')] bg-cover bg-center rounded-lg"></div>
      </Card>
    </div>
  );
};

export default Whistlist;
