import { NextResponse } from "next/server";
import axios from 'axios';

const backendUrl = process.env.BACKEND_URL;

export async function POST(request : Request){

    try {
        const body = await request.json();
        const { question, history, top_k } = body;

        // 1. Format the conversation history into a readable context string
        let historyContext = "";
        if (history && Array.isArray(history) && history.length > 0) {
            historyContext = history
                .map((msg: { role: string; content: string }) => {
                    const speaker = msg.role === 'user' ? 'User' : 'Athena';
                    return `${speaker}: ${msg.content}`;
                })
                .join("\n");
        }

        // 2. Build a single conversational prompt for your RAG system
        // This ensures one-shot logic can handle "yes", "1", or context-reliant followups.
        const conversationalPrompt = historyContext 
            ? `Recent chat history for context:\n${historyContext}\n\nCurrent User Input: ${question}`
            : question;

        // 3. Construct the exact payload your core backend expects
        const payload = {
            question: conversationalPrompt, 
            top_k: top_k || 5
            // If your core backend *wants* the raw history array instead, just pass: ...body
        };

        const res = await axios.post(
            `${backendUrl}/api/v1/rag/questions/athena`, 
            payload, 
            {
                headers : {
                    'x-motionu-key' : process.env.MOTIONU_KEY,
                    'Content-Type': 'application/json'
                }
            }
        );

        return NextResponse.json({ answer: res.data.answer }, { status: 201 });

    } catch(err : any) {
        console.error("API Error:", err.response?.data || err.message);

        return NextResponse.json(
            { error: "Failed to fetch response from Athena" }, 
            { status: err.response?.status || 500 }
        );
    }
}