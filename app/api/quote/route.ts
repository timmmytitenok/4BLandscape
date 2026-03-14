import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = "4blandscaping123@gmail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      services,
      projectDescription,
      timeline,
      streetAddress,
      city,
      zipCode,
      propertyType,
      fullName,
      phone,
      email,
    } = body;

    const esc = (s: unknown) =>
      String(s ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;") || "—";

    const servicesList = Array.isArray(services) ? services.join(", ") : "";
    const fileCount = Array.isArray(body.files) ? body.files.length : 0;

    const html = `
      <h2>New Quote Request from 4B Landscape</h2>
      <p><strong>Name:</strong> ${esc(fullName)}</p>
      <p><strong>Phone:</strong> ${esc(phone)}</p>
      <p><strong>Email:</strong> ${esc(email)}</p>
      <hr />
      <p><strong>Services needed:</strong> ${esc(servicesList)}</p>
      <p><strong>Project description:</strong></p>
      <p>${esc(projectDescription)}</p>
      <hr />
      <p><strong>Timeline:</strong> ${esc(timeline)}</p>
      <p><strong>Property type:</strong> ${esc(propertyType)}</p>
      <p><strong>Address:</strong> ${esc(streetAddress)}, ${esc(city)} ${esc(zipCode)}</p>
      ${fileCount > 0 ? `<p><em>Customer attached ${fileCount} photo(s)/video(s)</em></p>` : ""}
    `;

    const { error } = await resend.emails.send({
      from: "4B Landscape <onboarding@resend.dev>",
      to: TO_EMAIL,
      subject: "NEW QUOTE!",
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to send" },
      { status: 500 }
    );
  }
}
