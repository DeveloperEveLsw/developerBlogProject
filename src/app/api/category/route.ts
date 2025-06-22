import { NextRequest, NextResponse } from "next/server";

// 환경 변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 환경 변수 검증
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables for category API');
}

// GET: 카테고리 목록 조회
export async function GET(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get("id");
    
    // 특정 카테고리 조회
    const params = categoryId ? `?id=eq.${categoryId}` : '';
    
    const response = await fetch(`${supabaseUrl}/rest/v1/category${params}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Supabase category fetch failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: '카테고리 조회 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Category GET error:', error);
    return NextResponse.json(
      { error: '카테고리 조회 중 예상치 못한 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// POST: 새 카테고리 추가
export async function POST(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name } = body;

    // 입력값 검증
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: '카테고리 이름은 필수이며, 빈 문자열일 수 없습니다.' },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: '카테고리 이름은 50자를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 중복 카테고리 확인
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/category?name=eq.${encodeURIComponent(name.trim())}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (checkResponse.ok) {
      const existingCategories = await checkResponse.json();
      if (existingCategories.length > 0) {
        return NextResponse.json(
          { error: '이미 존재하는 카테고리 이름입니다.' },
          { status: 409 }
        );
      }
    }

    // 새 카테고리 추가
    const response = await fetch(`${supabaseUrl}/rest/v1/category`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: name.trim()
      })
    });

    if (!response.ok) {
      console.error('Supabase category creation failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: '카테고리 생성 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const newCategory = await response.json();
    
    return NextResponse.json(newCategory[0], {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Category POST error:', error);
    return NextResponse.json(
      { error: '카테고리 생성 중 예상치 못한 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// PATCH: 카테고리 이름 수정
export async function PATCH(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id, name } = body;

    // 입력값 검증
    if (!id || !name) {
      return NextResponse.json(
        { error: '카테고리 ID와 이름은 모두 필수입니다.' },
        { status: 400 }
      );
    }

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: '카테고리 이름은 필수이며, 빈 문자열일 수 없습니다.' },
        { status: 400 }
      );
    }

    if (name.trim().length > 50) {
      return NextResponse.json(
        { error: '카테고리 이름은 50자를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 카테고리 존재 확인
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/category?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!checkResponse.ok) {
      return NextResponse.json(
        { error: '카테고리 확인 중 오류가 발생했습니다.' },
        { status: checkResponse.status }
      );
    }

    const existingCategory = await checkResponse.json();
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: '존재하지 않는 카테고리입니다.' },
        { status: 404 }
      );
    }

    // 중복 이름 확인 (자기 자신 제외)
    const duplicateResponse = await fetch(`${supabaseUrl}/rest/v1/category?name=eq.${encodeURIComponent(name.trim())}&id=neq.${id}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (duplicateResponse.ok) {
      const duplicateCategories = await duplicateResponse.json();
      if (duplicateCategories.length > 0) {
        return NextResponse.json(
          { error: '이미 존재하는 카테고리 이름입니다.' },
          { status: 409 }
        );
      }
    }

    // 카테고리 이름 업데이트
    const response = await fetch(`${supabaseUrl}/rest/v1/category?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: name.trim()
      })
    });

    if (!response.ok) {
      console.error('Supabase category update failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: '카테고리 수정 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const updatedCategory = await response.json();
    
    return NextResponse.json(updatedCategory[0], {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Category PATCH error:', error);
    return NextResponse.json(
      { error: '카테고리 수정 중 예상치 못한 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// DELETE: 카테고리 삭제
export async function DELETE(request: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: '서버 설정 오류' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id } = body;

    // 입력값 검증
    if (!id) {
      return NextResponse.json(
        { error: '카테고리 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    // 카테고리 존재 확인
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/category?id=eq.${id}`, {
      method: 'GET',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!checkResponse.ok) {
      return NextResponse.json(
        { error: '카테고리 확인 중 오류가 발생했습니다.' },
        { status: checkResponse.status }
      );
    }

    const existingCategory = await checkResponse.json();
    if (existingCategory.length === 0) {
      return NextResponse.json(
        { error: '존재하지 않는 카테고리입니다.' },
        { status: 404 }
      );
    }

    // 해당 카테고리를 사용하는 포스트가 있는지 확인
    const postsResponse = await fetch(`${supabaseUrl}/rest/v1/posts?category=eq.${existingCategory[0].name}`, {
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
          { error: '이 카테고리를 사용하는 포스트가 있어 삭제할 수 없습니다.' },
          { status: 409 }
        );
      }
    }

    // 카테고리 삭제
    const response = await fetch(`${supabaseUrl}/rest/v1/category?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Supabase category deletion failed:', response.status, response.statusText);
      return NextResponse.json(
        { error: '카테고리 삭제 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: '카테고리가 성공적으로 삭제되었습니다.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Category DELETE error:', error);
    return NextResponse.json(
      { error: '카테고리 삭제 중 예상치 못한 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}