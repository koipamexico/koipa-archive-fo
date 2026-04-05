export const countries = [
  { code: 'mx', name: '멕시코', description: 'KOIPA Mexico 관련 자료를 모아볼 수 있습니다.' },
  { code: 'kr', name: '대한민국', description: '한국 본부 및 연계 자료를 확인할 수 있습니다.' },
  { code: 'us', name: '미국', description: '북미 연계 협력 및 참고 자료를 제공합니다.' },
]

export const contentTypes = [
  { id: 'report', label: '보고서' },
  { id: 'newsletter', label: '뉴스레터' },
  { id: 'notice', label: '공지자료' },
  { id: 'archive', label: '아카이브 문서' },
]

export const archiveContents = [
  {
    id: 'mx-report-2026-01',
    slug: 'mx-report-2026-01',
    title: '2026년 1월 멕시코 산업 동향 보고',
    country: 'mx',
    type: 'report',
    summary: '멕시코 주요 산업 이슈와 협력 동향을 정리한 월간 보고서입니다.',
    publishMonth: '2026-01',
    postedDate: '2026-01-31',
    body: `이 문서는 2026년 1월 기준 멕시코 산업 동향을 정리한 자료입니다.

주요 내용
- 멕시코 내 주요 산업별 이슈 정리
- KOIPA Mexico 협력 활동 개요
- 향후 검토가 필요한 정책 및 시장 변화 요약

본 서비스는 현재 Firebase 연동 전 단계이며, mock data 기반으로 운영되고 있습니다.`,
  },
  {
    id: 'mx-newsletter-2025-12',
    slug: 'mx-newsletter-2025-12',
    title: 'KOIPA Mexico 2025년 12월 뉴스레터',
    country: 'mx',
    type: 'newsletter',
    summary: '연말 주요 행사, 협력 소식, 아카이브 업데이트를 담은 뉴스레터입니다.',
    publishMonth: '2025-12',
    postedDate: '2025-12-20',
    body: `2025년 12월 뉴스레터입니다.

포함 내용
- 주요 행사 요약
- 기관 협력 소식
- 아카이브 신규 등록 문서 안내
- 다음 분기 운영 계획

향후 Firestore 연결 시 동일한 필드 구조를 그대로 활용할 수 있도록 설계되었습니다.`,
  },
  {
    id: 'kr-notice-2025-11',
    slug: 'kr-notice-2025-11',
    title: '대한민국 연계 공지자료',
    country: 'kr',
    type: 'notice',
    summary: '국내 협력기관 연계 공지 및 운영 참고사항을 정리한 문서입니다.',
    publishMonth: '2025-11',
    postedDate: '2025-11-12',
    body: `대한민국 연계 공지자료입니다.

주요 항목
- 운영 참고사항
- 자료 정비 일정
- 문서 분류 기준
- 공개/비공개 운영 방향 안내`,
  },
  {
    id: 'us-archive-2025-10',
    slug: 'us-archive-2025-10',
    title: '북미 협력 문서 아카이브 요약',
    country: 'us',
    type: 'archive',
    summary: '북미 지역 참고 문서를 주제별로 정리한 아카이브 요약입니다.',
    publishMonth: '2025-10',
    postedDate: '2025-10-08',
    body: `북미 협력 문서 아카이브 요약본입니다.

정리 범위
- 지역별 협력 기록
- 참고 정책 문서
- 프로젝트 메모
- 후속 검토가 필요한 주제 목록`,
  },
  {
    id: 'mx-archive-2025-09',
    slug: 'mx-archive-2025-09',
    title: '멕시코 지역 문서 아카이브 정리본',
    country: 'mx',
    type: 'archive',
    summary: '멕시코 지역 내 문서 자산을 유형별로 재정리한 아카이브 문서입니다.',
    publishMonth: '2025-09',
    postedDate: '2025-09-24',
    body: `멕시코 지역 문서 아카이브 정리본입니다.

정리 기준
- 국가
- 문서 유형
- 발행월
- 공개 가능 여부
- 운영 메모

추후 BO와 Firestore가 연결되면 이 문서 목록은 관리자 입력 기반으로 자동 반영될 예정입니다.`,
  },
  {
    id: 'kr-report-2025-08',
    slug: 'kr-report-2025-08',
    title: '국내 협력 현황 브리프',
    country: 'kr',
    type: 'report',
    summary: '국내 협력 현황과 해외 연계 가능성을 간단히 요약한 브리프입니다.',
    publishMonth: '2025-08',
    postedDate: '2025-08-18',
    body: `국내 협력 현황 브리프입니다.

핵심 내용
- 기관별 협력 상태
- 해외 연계 검토 포인트
- 문서 정합성 개선 필요 항목
- 차기 아카이브 운영 제안`,
  },
]

export const countryMap = Object.fromEntries(
  countries.map((country) => [country.code, country.name]),
)

export const typeMap = Object.fromEntries(
  contentTypes.map((type) => [type.id, type.label]),
)
