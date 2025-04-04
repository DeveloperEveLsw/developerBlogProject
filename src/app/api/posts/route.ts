import axios from "axios";
import { NextRequest , NextResponse} from 'next/server';

 
export async function GET(request: NextRequest) {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/posts`, {
      headers: {
        apikey: supabaseKey,
      }
    });
    return new Response(JSON.stringify(response.data),{
      status: 200,
      headers: { 'Content-Type': 'application/json' }
  })
  } catch (error) {
    console.log("님 에러남")
    return [];
  }
}
