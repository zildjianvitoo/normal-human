//api/clerk/webhook

import { db } from "@/server/db";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();

    const id = data.id;
    const email = data.email_addresses[0].email_address;
    const firstName = data.first_name;
    const lastName = data.last_name;
    const imageUrl = data.image_url;

    await db.user.create({
      data: {
        id,
        emailAddress: email,
        firstName: firstName,
        lastName: lastName,
        imageUrl: imageUrl,
      },
    });

    return new Response("Webhook diterima", { status: 200 });
  } catch (error) {
    console.log(error);
  }
}
