export const countries = [
  { code: 'mx', name: '멕시코' },
  { code: 'br', name: '브라질' },
  { code: 'cl', name: '칠레' },
  { code: 'pe', name: '페루' },
  { code: 'co', name: '콜롬비아' },
  { code: 'ar', name: '아르헨티나' },
  { code: 'ec', name: '에콰도르' },
]

export const contentTypes = [
  { id: 'reference', label: '기초 참고자료' },
  { id: 'news', label: '글로벌 IP 현장뉴스' },
]

export const archiveContentsFallback = [
  {
    id: 'mx-reference-2026-01',
    title: '멕시코 지식재산권 제도 개요',
    country: 'mx',
    type: 'reference',
    summary: '멕시코의 지식재산권 제도와 일반 정보를 정리한 기초 참고자료입니다.',
    publishMonth: '2026-01',
    postedDate: '2026-01-31',
    body: `멕시코의 지식재산권 제도 전반을 정리한 자료입니다.

주요 내용
- 제도 개요
- 출원 및 등록 관련 기본 정보
- 실무 참고사항`,
    isPublished: true,
    slug: 'mx-reference-2026-01',
  },
  {
    id: 'br-news-2026-02',
    title: '브라질 특허 정책 최신 동향',
    country: 'br',
    type: 'news',
    summary: '브라질의 최근 특허 정책 및 운영 동향을 정리한 현장뉴스입니다.',
    publishMonth: '2026-02',
    postedDate: '2026-02-15',
    body: `브라질 특허 관련 최근 정책 변화를 정리한 자료입니다.

주요 내용
- 정책 개정 사항
- 실무 영향 포인트
- 참고할 만한 최근 동향`,
    isPublished: true,
    slug: 'br-news-2026-02',
  },
]

export const countryMap = Object.fromEntries(
  countries.map((country) => [country.code, country.name]),
)

export const typeMap = Object.fromEntries(
  contentTypes.map((type) => [type.id, type.label]),
)
