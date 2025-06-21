import axios from "axios";
import { NextRequest , NextResponse} from 'next/server';
import { transformDate } from "@/utils/transformutils";
import { PostInterface } from "@/types/types";
import { SupabasePostsInterface } from "@/types/db";

export async function GET(request: NextRequest) {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL as string;
  const base = `${supabaseUrl}/rest/v1/posts` 
  const select = `?select=id,title,created_at,view_count,is_public,...category(category:category_text)` 
  const p_params = request.nextUrl.searchParams.get("is_public") ? `&is_public=eq.${request.nextUrl.searchParams.get("is_public")}` : '';
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
    }).then( (res)=> res.json());
    return NextResponse.json(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.log("님 에러남")
    return []
  }
}
export async function POST(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

  const {title, content} = JSON.parse(await request.text())
  const token = request.cookies.get("jwt_token")?.value
  console.log(token)
  console.log(title,content)
  const response = await fetch(`${supabaseUrl}/rest/v1/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        //"Authorization": `Bearer ${localStorage.getItem("pwt")}`,
        "Prefer": "return=minimal" // 성공 시 응답을 최소화
      },
      body: JSON.stringify({

      })
  })
  return new Response
}
