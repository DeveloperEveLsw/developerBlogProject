import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    const ss = await request.text()
    const {email, password} = JSON.parse(ss)

    //const {email, password} = {email:"lws19121@gmail.com", password:"way0120@"}

    const resopne = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
            "Accept-Encoding": "identity"
          },
        body: JSON.stringify({email, password})
        }
    )
    //console.log(resopne)

    return resopne
}