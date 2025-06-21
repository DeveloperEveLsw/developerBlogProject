import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest){
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    
    try {
    const token = request.cookies.get("jwt_token")?.value
        if (token) {
            const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
                method: "GET",
                headers: {
                "Authorization": `Bearer ${token}`,
                "apikey": supabaseKey,
                "Content-Type": "application/json"
                }
            });
            console.log(response)
            return response
        }
        return NextResponse.json({error: "토큰이 없습니다"}, {status: 401})
    } catch(error) { return NextResponse.json({error: error}, {status: 500}) }
}