import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다.' }, { status: 400 });
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기는 5MB 이하여야 합니다.' }, { status: 400 });
    }

    // Supabase Storage API를 사용하여 업로드
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase 설정이 없습니다.' }, { status: 500 });
    }

    // 파일명 생성 (중복 방지)
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;

    // Supabase Storage API로 업로드
    const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/blog-image/post/${fileName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': file.type,
        'x-upsert': 'false'
      },
      body: file
    });
    console.log(uploadResponse);
    if (!uploadResponse.ok) {
      console.error('Storage 업로드 오류:', await uploadResponse.text());
      return NextResponse.json({ error: '파일 업로드에 실패했습니다.' }, { status: 500 });
    }

    // 공개 URL 생성
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog-image/post/${fileName}`;

    return NextResponse.json({ 
      url: publicUrl,
      fileName: fileName
    });

  } catch (error) {
    console.error('이미지 업로드 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json({ error: '삭제할 파일 경로가 필요합니다.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase 설정이 없습니다.' }, { status: 500 });
    }

    // Supabase Storage REST API로 삭제 요청
    const deleteRes = await fetch(`${supabaseUrl}/storage/v1/object/blog-image/post/${path}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!deleteRes.ok) {
      return NextResponse.json({ error: '삭제 실패' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Supabase 설정이 없습니다.' }, { status: 500 });
    }

    // Supabase Storage REST API로 파일 목록 가져오기
    const listResponse = await fetch(`${supabaseUrl}/storage/v1/object/list/blog-image/post`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!listResponse.ok) {
      console.error('Storage API 응답 오류:', listResponse.status, listResponse.statusText);
      return NextResponse.json({ error: '이미지 목록 가져오기 실패' }, { status: 500 });
    }

    // 응답이 JSON인지 확인
    const contentType = listResponse.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('예상치 못한 응답 타입:', contentType);
      return NextResponse.json({ error: '잘못된 응답 형식' }, { status: 500 });
    }

    const data = await listResponse.json();
    
    // 파일 정보를 포맷팅
    const images = data.map((file: any) => ({
      name: file.name,
      url: `${supabaseUrl}/storage/v1/object/public/blog-image/post/${file.name}`,
      size: file.metadata?.size || 0,
      created_at: file.created_at,
      updated_at: file.updated_at
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error('이미지 목록 가져오기 오류:', error);
    return NextResponse.json({ error: '서버 오류' }, { status: 500 });
  }
} 