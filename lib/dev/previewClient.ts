import { UI_PREVIEW_ERROR } from "@/lib/dev/preview";

/*
 * The Supabase browser client as the dev panel sees it: the same auth calls
 * the forms make, answered locally after a short pause so loading states
 * show. Sends that would move the visitor on (sign-up, links, resets,
 * updates) "succeed", so the next screen can be seen; sign-ins and OAuth
 * answer with UI_PREVIEW_ERROR, which the forms show as a toast, instead of
 * leaving the page. No request leaves the browser.
 */

const pause = () => new Promise((resolve) => setTimeout(resolve, 700));
const ok = async <T,>(data: T) => {
  await pause();
  return { data, error: null };
};
const refused = async () => {
  await pause();
  return { data: { user: null, session: null, url: null }, error: UI_PREVIEW_ERROR };
};

export function previewClient() {
  return {
    auth: {
      signInWithPassword: refused,
      signInWithOAuth: refused,
      signUp: () => ok({ user: { id: "ui-preview", identities: [{ provider: "email" }] }, session: null }),
      signInWithOtp: () => ok({ user: null, session: null }),
      resetPasswordForEmail: () => ok({}),
      resend: () => ok({ user: null, session: null }),
      updateUser: () => ok({ user: { id: "ui-preview" } }),
      registerPasskey: refused,
      signInWithPasskey: refused,
      passkey: {
        list: () => ok([]),
        update: () => ok(null),
        delete: () => ok(null),
      },
    },
  };
}
