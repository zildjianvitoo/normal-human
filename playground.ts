import { db } from "@/server/db";

await db.user.create({
  data: {
    email: "kocak@gmail.casasom",
    first_name: "nama de pn perub  ahan  ",
    last_name: "nama asasasbelakang",
  },
});

// /auth/authorize/{token}  (exchange code for access token);
// /account {get account detail after exchanged token}
// /email/sync  (initial sync endpoint)
// /email/sync/updated  (actual updated email)
