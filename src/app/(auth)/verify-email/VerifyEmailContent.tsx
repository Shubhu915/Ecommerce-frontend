"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import AuthLayout from "@/components/features/auth/AuthLayout";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await authService.verifyEmail(token);
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (err) {
        setStatus("error");
        toast.error("Verification failed. Link may be expired.");
      }
    };

    verify();
  }, [token]);

  return (
    <AuthLayout title="VERIFY EMAIL" subtitle="Completing your AI shopping profile.">
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <p className="text-slate-500 font-medium">Securing your account, please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Email Verified!</h2>
            <p className="text-slate-500 max-w-xs mx-auto">
              Your account is now ready for the future of AI commerce.
            </p>
            <Button
              className="w-full h-14 rounded-2xl font-black tracking-widest bg-blue-600"
              onClick={() => router.push("/login")}
            >
              CONTINUE TO LOGIN
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">
              Verification Failed
            </h2>
            <p className="text-slate-500 max-w-xs mx-auto">
              The link is invalid or has expired. Please try registering again.
            </p>
            <Button
              variant="outline"
              className="w-full h-14 rounded-2xl font-black tracking-widest"
              onClick={() => router.push("/register")}
            >
              BACK TO REGISTER
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
