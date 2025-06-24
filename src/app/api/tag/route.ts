import { NextRequest, NextResponse } from "next/server";

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 환경 변수 검증
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables for tag API');
}

// GET: 태그 목록 조회
export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const tagId = searchParams.get("id");
    
    // 특정 태그 조회
    const params = tagId ? `?tag_id=eq.${tagId}` : '';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/tag${params}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Supabase tag fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: '태그 조회 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Tag GET error:', error);
    return NextResponse.json(
      { error: '태그 조회 중 예상치 못한 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 태그 추가
export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { tag_text } = body;

    // 입력값 검증
    if (!tag_text || typeof tag_text !== 'string' || tag_text.trim().length === 0) {
      return NextResponse.json(
        { error: '태그 이름은 필수이며, 빈 문자열일 수 없습니다.' },
        { status: 400 }
      );
    }

    if (tag_text.trim().length > 50) {
      return NextResponse.json(
        { error: '태그 이름은 50자를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 중복 태그 확인
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/tag?tag_text=eq.${encodeURIComponent(tag_text.trim())}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (checkResponse.ok) {
      const existingTags = await checkResponse.json();
      if (existingTags.length > 0) {
        return NextResponse.json(
          { error: '이미 존재하는 태그 이름입니다.' },
          { status: 409 }
        );
      }
    }

    // 새 태그 추가
    const response = await fetch(`${supabaseUrl}/rest/v1/tag`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        tag_text: tag_text.trim()
      })
    });

    if (!response.ok) {
      console.error('Supabase tag creation failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: '태그 생성 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const newTag = await response.json();
    
    return NextResponse.json(newTag[0], {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Tag POST error:', error);
    return NextResponse.json(
      { error: '태그 생성 중 예상치 못한 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 태그 이름 수정
export async function PATCH(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { tag_id, tag_text } = body;

    // 입력값 검증
    if (!tag_id || !tag_text) {
      return NextResponse.json(
        { error: '태그 ID와 이름은 모두 필수입니다.' },
        { status: 400 }
      );
    }

    if (typeof tag_text !== 'string' || tag_text.trim().length === 0) {
      return NextResponse.json(
        { error: '태그 이름은 필수이며, 빈 문자열일 수 없습니다.' },
        { status: 400 }
      );
    }

    if (tag_text.trim().length > 50) {
      return NextResponse.json(
        { error: '태그 이름은 50자를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 태그 존재 확인
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/tag?tag_id=eq.${tag_id}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!checkResponse.ok) {
      return NextResponse.json(
        { error: '태그 확인 중 오류가 발생했습니다.' },
        { status: checkResponse.status }
      );
    }

    const existingTag = await checkResponse.json();
    if (existingTag.length === 0) {
      return NextResponse.json(
        { error: '존재하지 않는 태그입니다.' },
        { status: 404 }
      );
    }

    // 중복 이름 확인 (자기 자신 제외)
    const duplicateResponse = await fetch(`${supabaseUrl}/rest/v1/tag?tag_text=eq.${encodeURIComponent(tag_text.trim())}&tag_id=neq.${tag_id}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (duplicateResponse.ok) {
      const duplicateTags = await duplicateResponse.json();
      if (duplicateTags.length > 0) {
        return NextResponse.json(
          { error: '이미 존재하는 태그 이름입니다.' },
          { status: 409 }
        );
      }
    }

    // 태그 이름 업데이트
    const response = await fetch(`${supabaseUrl}/rest/v1/tag?tag_id=eq.${tag_id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        tag_text: tag_text.trim()
      })
    });

    if (!response.ok) {
      console.error('Supabase tag update failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: '태그 수정 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const updatedTag = await response.json();
    
    return NextResponse.json(updatedTag[0], {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Tag PATCH error:', error);
    return NextResponse.json(
      { error: '태그 수정 중 예상치 못한 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 태그 삭제
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { tag_id } = body;

    // 입력값 검증
    if (!tag_id) {
      return NextResponse.json(
        { error: '태그 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    // 태그 존재 확인
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/tag?tag_id=eq.${tag_id}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!checkResponse.ok) {
      return NextResponse.json(
        { error: '태그 확인 중 오류가 발생했습니다.' },
        { status: checkResponse.status }
      );
    }

    const existingTag = await checkResponse.json();
    if (existingTag.length === 0) {
      return NextResponse.json(
        { error: '존재하지 않는 태그입니다.' },
        { status: 404 }
      );
    }

    // 해당 태그를 사용하는 포스트가 있는지 확인
    const postsResponse = await fetch(`${supabaseUrl}/rest/v1/posts?tags=cs.{${existingTag[0].tag_text}}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (postsResponse.ok) {
      const posts = await postsResponse.json();
      if (posts.length > 0) {
        return NextResponse.json(
          { error: '이 태그를 사용하는 포스트가 있어 삭제할 수 없습니다.' },
          { status: 409 }
        );
      }
    }

    // 태그 삭제
    const response = await fetch(`${supabaseUrl}/rest/v1/tag?tag_id=eq.${tag_id}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Supabase tag deletion failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: '태그 삭제 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: '태그가 성공적으로 삭제되었습니다.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Tag DELETE error:', error);
    return NextResponse.json(
      { error: '태그 삭제 중 예상치 못한 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
