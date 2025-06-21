import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  const { postId } = await params;

  if (!postId) {
    return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
  }

  // 환경 변수에서 Supabase 정보 가져오기
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // 서버 측에서는 반드시 service_role 키를 사용해야 안전합니다.
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  try {
    // DB에 만든 'increment_view' 함수를 fetch로 호출
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/increment_view`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey!, // 서버의 service_role 키 사용
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // 함수에 정의된 파라미터 이름과 값
        post_id_to_increment: Number(postId),
      }),
    });

    // fetch 요청 자체에서 에러가 발생한 경우 (네트워크 등)
    if (!response.ok) {
        const errorBody = await response.text(); // 에러 응답 본문 확인
        console.error('Supabase RPC call failed:', response.status, errorBody);
        throw new Error(`Supabase RPC call failed with status: ${response.status}`);
    }

    // 성공적으로 처리된 경우
    return NextResponse.json({ success: true, postId });

  } catch (error) {
    console.error('Error incrementing view count:', error);
    return NextResponse.json({ error: 'Failed to update view count' }, { status: 500 });
  }
}