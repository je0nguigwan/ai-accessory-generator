"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type GenerationState = "idle" | "loading" | "error" | "success";

interface GenerateResponse {
  imageUrl?: string;
  error?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<GenerationState>("idle");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [usedPrompt, setUsedPrompt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;

    setStatus("loading");
    setErrorMessage(null);
    setImageUrl(null);
    setUsedPrompt(null);

    try {
      const response = await fetch("/api/generate-accessory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmed }),
      });

      const payload = (await response.json()) as GenerateResponse;
      if (!response.ok || !payload.imageUrl) {
        const message =
          payload.error ??
          (response.ok ? "이미지를 생성하지 못했어요." : "생성에 실패했어요.");
        throw new Error(message);
      }

      setImageUrl(payload.imageUrl);
      setUsedPrompt(trimmed);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "알 수 없는 오류가 발생했어요."
      );
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-16 text-slate-100">
      <div className="w-full max-w-2xl rounded-3xl bg-white/5 p-8 shadow-2xl shadow-slate-900/40 backdrop-blur">
        <div className="space-y-3 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-cyan-200">
            accessory studio
          </p>
          <h1 className="text-4xl font-semibold text-white">
            AI Accessory Generator
          </h1>
          <p className="text-base text-slate-300">
            Describe the accessory you have in mind and let the model visualize
            it for you. Perfect for moodboards, product ideation, or playful
            experimentation.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-4 sm:flex-row"
        >
          <label htmlFor="prompt" className="sr-only">
            Accessory description
          </label>
          <input
            id="prompt"
            type="text"
            placeholder='예: "silver minimalist ring"'
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
          />
          <button
            type="submit"
            disabled={status === "loading" || !prompt.trim()}
            className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? "Generating..." : "Generate Accessory"}
          </button>
        </form>

        <section className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-6">
          {status === "loading" && (
            <div className="flex items-center gap-3 text-cyan-200">
              <span className="h-3 w-3 animate-ping rounded-full bg-cyan-300" />
              Generating your accessory preview...
            </div>
          )}

          {status === "error" && errorMessage && (
            <p className="text-sm text-rose-300">{errorMessage}</p>
          )}

          {status === "success" && imageUrl && (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-950/40">
                <Image
                  src={imageUrl}
                  alt={usedPrompt ?? "Generated accessory"}
                  width={1024}
                  height={1024}
                  unoptimized
                  className="h-auto w-full transition-opacity duration-300"
                />
              </div>
              {usedPrompt ? (
                <p className="text-sm text-slate-400">
                  Prompt: <span className="text-white">{usedPrompt}</span>
                </p>
              ) : null}
            </div>
          )}

          {status === "idle" && (
            <p className="text-sm text-slate-400">
              Describe an accessory above and tap{" "}
              <span className="font-semibold text-white">
                Generate Accessory
              </span>{" "}
              to see the result.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
