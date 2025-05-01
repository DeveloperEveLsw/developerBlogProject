import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) { 
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

    
    const _params = await request.nextUrl.searchParams.get("id")
    const params = await _params ? `?category_id=eq.${_params}` : ''
    const response = await fetch(`${supabaseUrl}/rest/v1/category${params}`, {
        method: 'GET',
        headers: {
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        }
      }).then((res)=> res.json())
    
    return NextResponse.json(response, {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
}