import { OramaClient } from "@/lib/orama";
import { turndown } from "@/lib/turndown";
import { db } from "@/server/db";
import { create, insert, search } from "@orama/orama";

// const acc = new Account("sqlyl6RP5PPM-z3WTUucKOcKYsY4iDbQfkzUrDRUEcY");
// await acc.syncEmails();
// /auth/authorize/{token}  (exchange code for access token);
// /account {get account detail after exchanged token}
// /email/sync  (initial sync endpoint)
// /email/sync/updated  (actual updated email)

const orama = new OramaClient("73742");
await orama.initialize();

const emails = await db.email.findMany({
  select: {
    subject: true,
    body: true,
    from: true,
    to: true,
    sentAt: true,
    threadId: true,
    bodySnippet: true,
  },
});

// await Promise.all(
//   emails.map(async (email) => {
//     const body = turndown.turndown(email.body ?? email.bodySnippet ?? "");

//     const embbedings = await getEmbeddings(body);

//     await orama.insert({
//       subject: email.subject,
//       body: body,
//       from: email.from.address,
//       rawBody: email.bodySnippet ?? "",
//       to: email.to.map((t) => t.address),
//       sentAt: email.sentAt.toLocaleString(),
//       threadId: email.threadId,
//       embeddings: embbedings,
//     });
//   }),
// );

// await orama.saveIndex();

// const searchResult = await orama.vectorSearch({
//   prompt: "Mijak",
// });
// console.log(searchResult ?? "kosongg");

// for (const hit of searchResult.hits) {
//   console.log(hit.document.subject);
// }

// for (const email of emails) {
//   console.log(email.subject);
//   const body = turndown.turndown(email.body ?? email.bodySnippet ?? "");
//   // @ts-ignore
//   await orama.insert({
//     subject: email.subject,
//     body: body,
//     from: email.from.address,
//     to: email.to.map((t) => t.address),
//     sentAt: email.sentAt.toLocaleString(),
//     threadId: email.threadId,
//   });
// }

const searchResult = await orama.search({
  term: "Niaga",
});

console.log(searchResult.hits);
