import { db } from "@/server/db";

await db.user.create({
  data: {
    email: "kocak@gmail.com",
    first_name: "nama depn",
    last_name: "nama belakang",
  },
});
