"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyContactButton({ contact }: { contact: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
  await navigator.clipboard.writeText(contact);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
  };

  return (
  <button
  onClick={handleCopy}
  className="inline-flex items-center gap-2 px-4 py-2.5 bg-background border border-surface-border rounded-input text-sm text-muted hover:text-primary transition-colors"
  >
  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
  {copied ? "Copied" : "Copy Contact"}
  </button>
  );
}
