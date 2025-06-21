import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    
    try {
        const refreshToken = request.cookies.get("refresh_token")?.value
        console.log(refreshToken)
        if (refreshToken) {
            const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
                method: "POST",
                headers: {
                "apikey": supabaseKey,
                "Content-Type": "application/json"
                },
                body: JSON.stringify({refresh_token: refreshToken})
            });
        
            const res = NextResponse.json(
                {},
                {status: response.status,
                statusText: response.statusText
                }
            )
            const {access_token, refresh_token} = await response.json()
            
            if (access_token) {
                res.cookies.set("jwt_token", access_token, {
                    httpOnly: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600,
            });
            }
            if (refresh_token) {
                res.cookies.set("refresh_token", refresh_token, {
                    httpOnly: true,
                    sameSite: "strict",
                    path: "/api/auth/refresh",
                    maxAge: 86400,
            });
            } 
            return res
        }
        return NextResponse.json({error: "토큰이 없습니다"}, {status: 401})
    } catch(error) { return NextResponse.json({error: error}, {status: 500}) }
}