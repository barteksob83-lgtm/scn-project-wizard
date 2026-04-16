import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  // TODO: Podłącz webhook / CRM / Email API (np. HubSpot, Pipedrive, Make, Zapier).
  console.log("SCN wizard submission:", JSON.stringify(payload, null, 2));

  return NextResponse.json({ ok: true });
}
