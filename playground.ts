import { Account } from "@/lib/account";

const acc = new Account("sqlyl6RP5PPM-z3WTUucKOcKYsY4iDbQfkzUrDRUEcY");
await acc.syncEmails();
// /auth/authorize/{token}  (exchange code for access token);
// /account {get account detail after exchanged token}
// /email/sync  (initial sync endpoint)
// /email/sync/updated  (actual updated email)
