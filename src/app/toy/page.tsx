import React from 'react'


export default async function toyPage() {
  const s = [1, '1', 2, '2', 3, '3']
  return (
    <div>토이 페이지 입니다 장남감 프로젝트 올릴꺼임 기대하셈
      {s.map((it: number | string, index)=>(
        <div>
          <div>{it}</div>
          <div>{index}</div>

        </div>
      ))}
    </div>
  )
}
