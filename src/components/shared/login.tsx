"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth.client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import LoadingScreen from "./loading/loading-screen";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Link } from "./progress-bar";
import { useTranslations } from "next-intl";
import { useSearchParams, redirect } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "convex/_generated/api";
import { useAuthActions } from "@convex-dev/auth/react";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useQuery(api.auth.isAuthenticated);
  const t = useTranslations("Auth");
  const tCommon = useTranslations("Common");

  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackUrl");

  if (isAuthenticated === undefined) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    return redirect(callbackURL || "/dashboard");
  }

  return (
    <>
      <h1 className="text-3xl font-semibold">{t("welcomeMessage")}</h1>
      <h2 className="mb-10 text-muted-foreground mt-4 text-center">
        {t("welcomeMessageDescription")}
      </h2>

      <div className="max-w-sm w-full">
        <div className="flex flex-wrap items-center gap-2 w-full mb-8 pb-8 border-b border-dashed">
          <GoogleLogin />
        </div>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            const res = await authClient.emailOtp.sendVerificationOtp({
              email,
              type: "sign-in",
            });
            setLoading(false);

            if (!res.data?.success) {
              toast.error(res.error?.message || tCommon("genericError"));
              return;
            }

            setOtp("");
            toast.success(t("otpSentToEmail"));
          }}
          className="grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="email">{tCommon("emailLabel")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              t("continueWithEmail")
            )}
          </Button>
        </form>
      </div>
      <Dialog open={otp !== null}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("verifyEmailTitle")}</DialogTitle>
            <DialogDescription>{t("verifyEmailDescription")}</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={async (e) => {
              if (!otp) return;
              e.preventDefault();

              setLoading(true);
              const res = await authClient.signIn.emailOtp({
                email,
                otp,
              });

              if (res.error) {
                setLoading(false);
                toast.error(res.error?.message || tCommon("genericError"));
                setOtp("");
                return;
              }

              if (res.data?.user) {
                window.location.href = callbackURL || "/dashboard";
              }
            }}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="otp">{t("verifyEmailLabel")}</Label>
              <InputOTP
                maxLength={6}
                onChange={(e) => {
                  setOtp(e);
                }}
                value={otp || ""}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                t("loginButton")
              )}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t("didNotReceiveOTP")}{" "}
              <button
                type="button"
                className="text-sm w-max cursor-pointer text-blue-500"
                onClick={() => setOtp(null)}
              >
                {t("resendOTPButton")}
              </button>
            </span>
          </form>
        </DialogContent>
      </Dialog>
      <span className="container text-xs text-muted-foreground mt-4 max-w-md text-center fixed bottom-4">
        {t("termsOfUseDescription")}{" "}
        <Link href={"/terms-of-use"} className="underline">
          {t("termsOfUse")}
        </Link>{" "}
        {t("and")}{" "}
        <Link className="underline" href={"/privacy-policy"}>
          {t("privacyPolicy")}
        </Link>
      </span>
    </>
  );
};
export default LogIn;

const GoogleIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className="w-5 h-5"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
};

const GoogleLogin = () => {
  const t = useTranslations("Auth");
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackURL = searchParams.get("callbackURL");

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn("google", {
      redirectTo: callbackURL || `${window.location.origin}/dashboard`,
    });
    setIsLoading(false);
  };

  return (
    <Button
      variant="outline"
      type="button"
      className="gap-2 flex-1 w-full py-4"
      onClick={handleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <>
          <GoogleIcon />
          {t("signInWithGoogle")}
        </>
      )}
    </Button>
  );
};
