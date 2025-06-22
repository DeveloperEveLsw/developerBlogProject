import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    
    try {
        const refreshToken = request.cookies.get("refresh_token")?.value
        if (!refreshToken) {
            return NextResponse.json({error: "리프레시 토큰이 없습니다"}, {status: 401})
        }

        const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=refresh_token`, {
            method: "POST",
            headers: {
                "apikey": supabaseKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({refresh_token: refreshToken})
        });
    
        if (response.ok) {
            const {access_token, refresh_token} = await response.json()
            
            const res = NextResponse.json(
                { message: "토큰이 성공적으로 갱신되었습니다" },
                { status: 200 }
            )
            
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
        } else if (response.status === 401) {
            return NextResponse.json({error: "리프레시 토큰이 만료되었습니다"}, {status: 401})
        } else {
            return NextResponse.json({error: "토큰 갱신에 실패했습니다"}, {status: response.status})
        }
    } catch(error) { 
        return NextResponse.json({error: "서버 오류가 발생했습니다"}, {status: 500}) 
    }
}