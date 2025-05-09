import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    const ss = await request.text()
    const {email, password} = JSON.parse(ss)

    //const {email, password} = {email:"lws19121@gmail.com", password:"way0120@"}
    
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': supabaseKey,
            'Content-Type': 'application/json',
            "Accept-Encoding": "identity"
          },
        body: JSON.stringify({email, password})
        }
    )
    //console.log(response)
    const res = NextResponse.json(
        {},
        {status: response.status,
        statusText: response.statusText
        }
    )

    const {access_token} = await response.json()
    if (access_token) {
    res.cookies.set("jwt_token", access_token, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 3600,
      });
    } 
    //console.log(res)
    return res
}