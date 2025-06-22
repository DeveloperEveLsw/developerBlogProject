import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    
    try {
        const token = request.cookies.get("jwt_token")?.value
        if (!token) {
            return NextResponse.json({error: "토큰이 없습니다"}, {status: 401})
        }

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "apikey": supabaseKey,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const userData = await response.json()
            return NextResponse.json({ user: userData }, { status: 200 })
        } else if (response.status === 401) {
            // 토큰이 만료되었거나 유효하지 않은 경우
            return NextResponse.json({error: "토큰이 만료되었습니다"}, {status: 401})
        } else {
            // 기타 서버 오류
            return NextResponse.json({error: "토큰 검증에 실패했습니다"}, {status: response.status})
        }
    } catch(error) { 
        return NextResponse.json({error: "서버 오류가 발생했습니다"}, {status: 500}) 
    }
}