"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  const goBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Card */}
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 rounded-3xl bg-white p-8 md:p-10 text-center shadow-2xl border border-slate-200">
        
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 mb-6 shadow-sm border border-emerald-100/50">
          <FileQuestion className="h-10 w-10 text-emerald-500" />
        </div>

        {/* 404 */}
        <h1 className="text-6xl font-black text-slate-900 tracking-tight mb-2">
          404
        </h1>

        {/* Text */}
        <p className="text-xl font-bold text-slate-800 mb-2">
          Page Not Found
        </p>

        <p className="text-sm font-medium text-slate-500 mb-10 leading-relaxed">
          The page you are looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          {/* Back */}
          <Button
            variant="outline"
            onClick={goBack}
            className="rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 h-12 px-6 font-semibold transition-all w-full sm:w-auto shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          {/* Home */}
          <Link href="/" className="w-full sm:w-auto">
            <Button
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6 font-semibold transition-all w-full shadow-lg shadow-emerald-500/20 border-0"
            >
              <Home className="mr-2 h-4 w-4" />
              Home Page
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
