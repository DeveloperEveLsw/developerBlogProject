import { NextRequest , NextResponse} from 'next/server';
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const hostUrl = process.env.NEXT_PUBLIC_HOST_URL as string;

  const include_private = request.nextUrl.searchParams.get("is_public") ? request.nextUrl.searchParams.get("is_public") : null;
  const category = request.nextUrl.searchParams.get("category") ? request.nextUrl.searchParams.get("category") : null;
  const tags = request.nextUrl.searchParams.get("tag") ? request.nextUrl.searchParams.get("tag")! : null;

  
  console.log(include_private)
  console.log(category)
  console.log(tags)

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/get_filtered_posts_with_relations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': `${supabaseKey}`
      },
      body: JSON.stringify({
        input_category_id: category,                   // 선택적으로 넘김
        input_tag_ids: tags,
        include_private: include_private                // 공개 게시글만 볼 거면 false
      })
    });
    console.log(response)
    if (response.ok) { 
      const data = await response.json();
      return NextResponse.json(data, {
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
          content: content,
          user_email: `${email}`
          })
      })
      //console.log(response)
      return response
    }
    return NextResponse.json({error: "토큰이 없습니다"}, {status: 401})
  } catch (error) {return NextResponse.json({error: `${error}`}, {status: 500})}
}
