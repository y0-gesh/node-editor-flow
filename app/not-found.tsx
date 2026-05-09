"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  CircleChevronLeft,
  House,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.05, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute text-[40vw] md:text-[30vw] lg:text-[25vw] font-bold text-foreground select-none pointer-events-none"
      >
        404
      </motion.h1>

      <div className="relative z-10 space-y-6 px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
          eigenstudio
        </h2>
        <p className="text-muted-foreground max-w-xl text-sm sm:text-base mx-auto">
          We&apos;re building something thoughtful here. This page will be live
          soon.
        </p>

        {/* <Separator className="mx-auto my-4 w-20" /> */}

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="rounded-[8px]"
          >
            <CircleChevronLeft className="size-4" />
            Go back
          </Button>
          <Button size="lg" onClick={() => router.push("/")} className="rounded-[8px]">
            <House className="size-4" />
            Go home
          </Button>
        </div>
      </div>
    </section>
  );
}