import { db } from "@/server/db";

await db.user.create({
  data: {
    emailAddress: "kocak@gmail.casasom",
    firstName: "nama de pn perub  ahan  ",
    lastName: "nama asasasbelakang",
  },
});

// /auth/authorize/{token}  (exchange code for access token);
// /account {get account detail after exchanged token}
// /email/sync  (initial sync endpoint)
// /email/sync/updated  (actual updated email)
