import { db } from "@/server/db";

await db.user.create({
  data: {
    email: "kocak@gmail.casasom",
    first_name: "nama de pn",
    last_name: "nama asasasbelakang",
  },
});
