import axios from "axios";
import { NextRequest , NextResponse} from 'next/server';
import { transformDate } from "@/utils/transformutils";
import { PostInterface } from "@/types/types";
import { SupabasePostsInterface } from "@/types/db";

export async function GET(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    const id = request.nextUrl.searchParams.get("id")
    const response = await axios.get(`${supabaseUrl}/rest/v1/posts?id=eq.${id}`, {
      headers: {
        apikey: supabaseKey,
      }
    })
    return NextResponse.json(response.data, {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
}
export async function PATCH(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  

  const token = request.cookies.get("jwt_token")?.value
  if (token) {}
  const id = request.nextUrl.searchParams.get("id")
  const data = request.json()

  const response = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.${id}`,{
    method: "PATCH",
    headers: {
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  })
}