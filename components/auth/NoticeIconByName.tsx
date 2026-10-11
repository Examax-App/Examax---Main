"use client";

import { AtSign, KeyRound, Link2Off, LogIn, MailCheck, UserX } from "lucide-react";
import { NoticeIcon } from "@/components/auth/pieces";

/*
 * NoticeIcon for Server Components. An icon is a function, and functions
 * cannot cross from server to client, so a server page names the icon and
 * this picks it.
 */

const ICONS = { mail: MailCheck, key: KeyRound, "link-off": Link2Off, login: LogIn, at: AtSign, "user-x": UserX };

export type NoticeIconName = keyof typeof ICONS;

export function NoticeIconByName({ name }: { name: NoticeIconName }) {
  return <NoticeIcon icon={ICONS[name]} />;
}
