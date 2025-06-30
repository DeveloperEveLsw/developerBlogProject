// app/actions/revalidatePath.ts
'use server';

import { revalidatePath } from 'next/cache';

export async function revalidatePage(path: string) {
  if (!path) throw new Error('경로가 필요합니다.');
  revalidatePath(path);
}