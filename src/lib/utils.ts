import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTextGradients = (text: any) => {
  if (!text || typeof text !== 'string') text = String(text || "");
  if (!text) return "";
  return text.replace(/<gradient>(.*?)<\/gradient>/g, '<span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 font-bold">$1</span>')
             .replace(/<gradient2>(.*?)<\/gradient2>/g, '<span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold">$1</span>')
             .replace(/<gradient3>(.*?)<\/gradient3>/g, '<span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500 font-bold">$1</span>');
};
