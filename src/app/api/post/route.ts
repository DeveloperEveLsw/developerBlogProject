import { NextRequest , NextResponse} from 'next/server';
import { transformDate } from "@/utils/transformutils";
import { PostInterface } from "@/types/types";
import { SupabasePostsInterface } from "@/types/db";

export async function GET(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: "서버 설정 오류" },
                { status: 500 }
            );
        }

        const id = request.nextUrl.searchParams.get("id");
        
        if (!id) {
            return NextResponse.json(
                { error: "포스트 ID가 필요합니다" },
                { status: 400 }
            );
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.${id}`, {
            method: 'GET',
            headers: {
                'apikey': supabaseKey,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: "포스트를 찾을 수 없습니다" },
                    { status: 404 }
                );
            }
            return NextResponse.json(
                { error: "데이터베이스 조회 중 오류가 발생했습니다" },
                { status: response.status }
            );
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "포스트를 찾을 수 없습니다" },
                { status: 404 }
            );
        }

        return NextResponse.json(data, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('GET /api/post error:', error);
        
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: "서버 설정 오류" },
                { status: 500 }
            );
        }

        const token = request.cookies.get("jwt_token")?.value;
        
        if (!token) {
            return NextResponse.json(
                { error: "인증이 필요합니다" },
                { status: 401 }
            );
        }

        const id = request.nextUrl.searchParams.get("id");
        
        if (!id) {
            return NextResponse.json(
                { error: "포스트 ID가 필요합니다" },
                { status: 400 }
            );
        }

        const data = await request.json();
        
        if (!data || Object.keys(data).length === 0) {
            return NextResponse.json(
                { error: "업데이트할 데이터가 필요합니다" },
                { status: 400 }
            );
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.${id}`, {
            method: "PATCH",
            headers: {
                'apikey': supabaseKey,
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: "포스트를 찾을 수 없습니다" },
                    { status: 404 }
                );
            }
            if (response.status === 401) {
                return NextResponse.json(
                    { error: "권한이 없습니다" },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { error: "포스트 업데이트에 실패했습니다" },
                { status: response.status }
            );
        }

        const updatedData = await response.json();
        
        return NextResponse.json(
            { message: "포스트가 성공적으로 업데이트되었습니다", data: updatedData },
            { status: 200 }
        );
    } catch (error) {
        console.error('PATCH /api/post error:', error);
        
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { error: "서버 설정 오류" },
                { status: 500 }
            );
        }

        const token = request.cookies.get("jwt_token")?.value;
        
        if (!token) {
            return NextResponse.json(
                { error: "인증이 필요합니다" },
                { status: 401 }
            );
        }

        const id = request.nextUrl.searchParams.get("id");
        
        if (!id) {
            return NextResponse.json(
                { error: "포스트 ID가 필요합니다" },
                { status: 400 }
            );
        }

        const response = await fetch(`${supabaseUrl}/rest/v1/posts?id=eq.${id}`, {
            method: "DELETE",
            headers: {
                'apikey': supabaseKey,
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return NextResponse.json(
                    { error: "포스트를 찾을 수 없습니다" },
                    { status: 404 }
                );
            }
            if (response.status === 401) {
                return NextResponse.json(
                    { error: "권한이 없습니다" },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { error: "포스트 삭제에 실패했습니다" },
                { status: response.status }
            );
        }

        return NextResponse.json(
            { message: "포스트가 성공적으로 삭제되었습니다" },
            { status: 200 }
        );
    } catch (error) {
        console.error('DELETE /api/post error:', error);
        
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다" },
            { status: 500 }
        );
    }
}
