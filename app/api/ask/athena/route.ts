import { NextResponse } from "next/server";
import axios from 'axios';

const backendUrl = process.env.BACKEND_URL;

export async function POST(request : Request){

    const body = await request.json();

    try{

        
        const res = await axios.post(
            `${backendUrl}/api/v1/rag/questions/athena` , 
            body , {
            headers : {
                'x-motionu-key' : process.env.MOTIONU_KEY
            }
        })

        return NextResponse.json({answer  : res.data.answer} , {status : 201})

    }catch(err : any){

        console.error("API Error:", err.response?.data || err.message);

        return NextResponse.json(
            { error: "Failed to fetch response from Athena" }, 
            { status: err.response?.status || 500 }
        );
    }
}