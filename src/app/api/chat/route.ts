// /api/chat
import { Configuration, OpenAIApi } from "openai-edge";
import {
  GoogleGenerativeAIStream,
  Message,
  StreamingTextResponse,
  streamText,
} from "ai";

import { NextResponse } from "next/server";
import { OramaClient } from "@/lib/orama";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
// import { getSubscriptionStatus } from "@/lib/stripe-actions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { google } from "@ai-sdk/google";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

const FREE_CREDITS_PER_DAY = 10;
// export const runtime = "edge";

const buildGoogleGenAIPrompt = (messages: Message[]) => ({
  contents: messages
    .filter((message) => message.role === "user" || message.role === "system")
    .map((message) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    })),
});

export async function POST(req: Request) {
  try {
    const { messages, accountId } = await req.json();
    const oramaManager = new OramaClient(accountId);
    await oramaManager.initialize();

    const lastMessage = messages[messages.length - 1];

    // Mendapatkan konteks dari pencarian vektor
    const context = await oramaManager.vectorSearch({
      prompt: lastMessage.content,
    });

    // Menyiapkan prompt untuk model AI
    const prompt = {
      role: "system",
      content: `You are an AI email assistant embedded in an email client app. Your purpose is to help the user compose emails by answering questions, providing suggestions, and offering relevant information based on the context of their previous emails.
      THE TIME NOW IS ${new Date().toLocaleString()}

START CONTEXT BLOCK
${context.hits.map((hit) => JSON.stringify(hit.document)).join("\n")}
END OF CONTEXT BLOCK

When responding, please keep in mind:
- Be helpful, clever, and articulate.
- Rely on the provided email context to inform your responses.
- If the context does not contain enough information to answer a question, politely say you don't have enough information.
- Avoid apologizing for previous responses. Instead, indicate that you have updated your knowledge based on new information.
- Do not invent or speculate about anything that is not directly supported by the email context.
- Keep your responses concise and relevant to the user's questions or the email being composed.`,
    };

    const geminiStream = await genAI
      .getGenerativeModel({ model: "gemini-1.5-pro" })
      .generateContentStream(
        buildGoogleGenAIPrompt([
          prompt,
          ...messages.filter((message: Message) => message.role === "user"),
        ]),
      );

    // Membuat stream dari response AI
    // const stream = await streamText({
    //   model: google("gemini-1.5-pro"),
    //   messages: [
    //     prompt,
    //     ...messages.filter((message: Message) => message.role === "user"),
    //   ],
    // });

    const stream = GoogleGenerativeAIStream(geminiStream);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
