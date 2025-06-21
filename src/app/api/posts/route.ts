import axios from "axios";
import { NextRequest , NextResponse} from 'next/server';
import { transformDate } from "@/utils/transformutils";
import { PostInterface } from "@/types/types";
import { SupabasePostsInterface } from "@/types/db";
import jwt from "jsonwebtoken";
import { error } from "console";

export async function GET(request: NextRequest) {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
<<<<<<< HEAD

  const base = `${supabaseUrl}/rest/v1/posts` 
  const select = `?select=id,title,created_at,is_public,...category(category:category_text)&is_public=eq.true` 
=======
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL as string;
  const base = `${supabaseUrl}/rest/v1/posts` 
  const select = `?select=id,title,created_at,view_count,is_public,...category(category:category_text)` 
  const p_params = request.nextUrl.searchParams.get("is_public") ? `&is_public=eq.${request.nextUrl.searchParams.get("is_public")}` : '';
>>>>>>> origin/heads/origin/master
  const c_params = request.nextUrl.searchParams.get("category") ? `&category=eq.${request.nextUrl.searchParams.get("category")}` : '';
  const order = `&order=created_at.desc`

  try {
    const response = await fetch(
      `${base}${select}${c_params}${p_params}${order}`, {
        method: 'GET',
        headers: {
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
    })
    if (response.ok) { 
      return NextResponse.json(await response.json(), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    else return NextResponse.json({error: "db 검색 오류"}, {status:404})
  } catch (error) {return NextResponse.json({error: error}, {status:500})}
}

export async function POST(request: NextRequest) {
  
  interface DecodedToken {
  email: string; // JWT 내부에 포함된 email 값
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  try {

    const {title, content} = JSON.parse(await request.text())
    const token = request.cookies.get("jwt_token")?.value
    if (token) {
      const {email} = jwt.decode(token) as DecodedToken
      
      const response = await fetch(`${supabaseUrl}/rest/v1/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${token}`,
          "Prefer": "return=minimal" // 성공 시 응답을 최소화
        },
        body: JSON.stringify({
          title: title,
          context: content,
          user_email: `${email}`
          })
      })
      console.log(response)
      return response
    }
    return NextResponse.json({error: "토큰이 없습니다"}, {status: 401})
  } catch (error) {return NextResponse.json({error: `${error}`}, {status: 500})}
}
