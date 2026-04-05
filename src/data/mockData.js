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

export const archiveContentsFallback = [
  {
    id: 'mx-report-2026-01',
    title: '2026년 1월 멕시코 산업 동향',
    country: 'mx',
    type: 'report',
    summary: '멕시코 산업 동향 요약',
    publishMonth: '2026-01',
    postedDate: '2026-01-31',
    body: '테스트용 fallback 데이터입니다.',
    isPublished: true,
    slug: 'mx-report-2026-01',
  },
]

export const countryMap = Object.fromEntries(
  countries.map((country) => [country.code, country.name]),
)

export const typeMap = Object.fromEntries(
  contentTypes.map((type) => [type.id, type.label]),
)
