import { useEffect, useMemo, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import {
  archiveContentsFallback,
  contentTypes,
  countries,
  countryMap,
  typeMap,
} from './data/mockData'

const NAV_ITEMS = [
  { id: 'home', label: '홈' },
  { id: 'archive', label: '아카이브' },
  { id: 'country', label: '국가별 보기' },
  { id: 'about', label: 'About' },
]

function App() {
  const [page, setPage] = useState('home')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedContentId, setSelectedContentId] = useState(archiveContents[0].id)
  const [selectedCountryPage, setSelectedCountryPage] = useState('mx')

  const selectedContent = archiveContents.find((item) => item.id === selectedContentId)

  const filteredArchive = useMemo(() => {
    return archiveContents.filter((item) => {
      const countryMatched = selectedCountry === 'all' || item.country === selectedCountry
      const typeMatched = selectedType === 'all' || item.type === selectedType
      return countryMatched && typeMatched
    })
  }, [selectedCountry, selectedType])

  const countryOnlyContents = useMemo(() => {
    return archiveContents.filter((item) => item.country === selectedCountryPage)
  }, [selectedCountryPage])

  const goToDetail = (contentId) => {
    setSelectedContentId(contentId)
    setPage('detail')
  }

  const goToCountry = (countryCode) => {
    setSelectedCountryPage(countryCode)
    setPage('country')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="brand" onClick={() => setPage('home')}>
          <span className="brand-badge">KOIPA</span>
          <div>
            <strong>KOIPA Mexico Archive</strong>
            <p>텍스트 기반 콘텐츠 아카이브 서비스</p>
          </div>
        </div>

        <nav className="top-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-button ${page === item.id ? 'active' : ''}`}
              onClick={() => setPage(item.id)}
            >
              {item.label}
            </button>
          ))}
          {page === 'detail' && (
            <button className="nav-button active" onClick={() => setPage('detail')}>
              상세보기
            </button>
          )}
        </nav>
      </header>

      <main className="page-container">
        {page === 'home' && (
          <HomePage
            onMoveArchive={() => setPage('archive')}
            onMoveCountry={goToCountry}
            onMoveAbout={() => setPage('about')}
          />
        )}

        {page === 'archive' && (
          <ArchivePage
            selectedCountry={selectedCountry}
            selectedType={selectedType}
            setSelectedCountry={setSelectedCountry}
            setSelectedType={setSelectedType}
            filteredArchive={filteredArchive}
            onViewDetail={goToDetail}
          />
        )}

        {page === 'country' && (
          <CountryPage
            selectedCountryPage={selectedCountryPage}
            setSelectedCountryPage={setSelectedCountryPage}
            countryOnlyContents={countryOnlyContents}
            onViewDetail={goToDetail}
          />
        )}

        {page === 'detail' && selectedContent && (
          <DetailPage content={selectedContent} />
        )}

        {page === 'about' && <AboutPage />}
      </main>

      <footer className="site-footer">
        <p>© KOIPA Mexico Archive FO</p>
        <p>향후 Firebase Firestore 연동을 고려한 mock data 기반 구조</p>
      </footer>
    </div>
  )
}

function HomePage({ onMoveArchive, onMoveCountry, onMoveAbout }) {
  return (
    <div className="page-content">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="section-eyebrow">공개 아카이브 서비스</span>
          <h1>KOIPA Mexico Archive</h1>
          <p>
            KOIPA Mexico와 연계된 문서를 국가와 유형 기준으로 탐색할 수 있는
            외부 공개용 아카이브 서비스입니다.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={onMoveArchive}>
              아카이브 보러가기
            </button>
            <button className="secondary-button" onClick={onMoveAbout}>
              서비스 소개
            </button>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-card">
            <strong>운영 방향</strong>
            <p>현재는 mock data 기반으로 동작하며, 추후 Firebase Firestore 연동 예정입니다.</p>
          </div>
          <div className="hero-panel-card">
            <strong>서비스 특성</strong>
            <p>텍스트 중심 콘텐츠를 안정적으로 탐색하고 열람할 수 있는 아카이브 구조입니다.</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>국가별 탐색</h2>
          <p>국가 단위로 관련 콘텐츠를 빠르게 모아볼 수 있습니다.</p>
        </div>
        <div className="grid-cards three">
          {countries.map((country) => (
            <article className="info-card" key={country.code}>
              <h3>{country.name}</h3>
              <p>{country.description}</p>
              <button className="text-button" onClick={() => onMoveCountry(country.code)}>
                해당 국가 콘텐츠 보기
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>콘텐츠 유형 소개</h2>
          <p>문서 성격에 따라 유형별로 정리된 아카이브를 제공합니다.</p>
        </div>
        <div className="grid-cards four">
          {contentTypes.map((type) => (
            <article className="info-card compact" key={type.id}>
              <h3>{type.label}</h3>
              <p>향후 Firestore 컬렉션 구조와 연결하기 쉬운 형태로 관리됩니다.</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function ArchivePage({
  selectedCountry,
  selectedType,
  setSelectedCountry,
  setSelectedType,
  filteredArchive,
  onViewDetail,
}) {
  return (
    <div className="page-content">
      <section className="section-block">
        <div className="section-head">
          <h1 className="page-title">아카이브 목록</h1>
          <p>국가와 콘텐츠 유형 기준으로 문서를 필터링할 수 있습니다.</p>
        </div>

        <div className="filter-bar">
          <label className="filter-item">
            <span>국가</span>
            <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)}>
              <option value="all">전체</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </label>

          <label className="filter-item">
            <span>콘텐츠 유형</span>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
              <option value="all">전체</option>
              {contentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="archive-grid">
          {filteredArchive.map((item) => (
            <ArchiveCard key={item.id} item={item} onViewDetail={onViewDetail} />
          ))}
        </div>

        {filteredArchive.length === 0 && (
          <div className="empty-box">
            <strong>조건에 맞는 콘텐츠가 없습니다.</strong>
            <p>다른 국가 또는 유형을 선택해 주세요.</p>
          </div>
        )}
      </section>
    </div>
  )
}

function CountryPage({
  selectedCountryPage,
  setSelectedCountryPage,
  countryOnlyContents,
  onViewDetail,
}) {
  return (
    <div className="page-content">
      <section className="section-block">
        <div className="section-head">
          <h1 className="page-title">국가별 콘텐츠</h1>
          <p>선택한 국가에 해당하는 문서만 모아서 볼 수 있습니다.</p>
        </div>

        <div className="chip-row">
          {countries.map((country) => (
            <button
              key={country.code}
              className={`chip-button ${selectedCountryPage === country.code ? 'active' : ''}`}
              onClick={() => setSelectedCountryPage(country.code)}
            >
              {country.name}
            </button>
          ))}
        </div>

        <div className="archive-grid">
          {countryOnlyContents.map((item) => (
            <ArchiveCard key={item.id} item={item} onViewDetail={onViewDetail} />
          ))}
        </div>
      </section>
    </div>
  )
}

function DetailPage({ content }) {
  return (
    <div className="page-content">
      <section className="detail-layout">
        <article className="detail-main">
          <span className="section-eyebrow">콘텐츠 상세</span>
          <h1 className="detail-title">{content.title}</h1>

          <div className="meta-inline">
            <span>{countryMap[content.country]}</span>
            <span>{typeMap[content.type]}</span>
            <span>{content.publishMonth}</span>
            <span>{content.postedDate}</span>
          </div>

          <div className="detail-body">
            {content.body.split('\n').map((paragraph, index) => (
              <p key={`${content.id}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="detail-side">
          <div className="info-box">
            <h3>문서 정보</h3>
            <dl>
              <div>
                <dt>국가</dt>
                <dd>{countryMap[content.country]}</dd>
              </div>
              <div>
                <dt>유형</dt>
                <dd>{typeMap[content.type]}</dd>
              </div>
              <div>
                <dt>발행월</dt>
                <dd>{content.publishMonth}</dd>
              </div>
              <div>
                <dt>게시일</dt>
                <dd>{content.postedDate}</dd>
              </div>
              <div>
                <dt>문서 ID</dt>
                <dd>{content.id}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </section>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="page-content">
      <section className="section-block prose-block">
        <span className="section-eyebrow">About</span>
        <h1 className="page-title">서비스 소개</h1>
        <p>
          KOIPA Mexico Archive FO는 외부 공개용 문서 아카이브 서비스입니다.
          사용자는 국가, 문서 유형, 발행 시점 기준으로 콘텐츠를 탐색할 수 있습니다.
        </p>

        <h2>운영 구조</h2>
        <p>
          FO는 외부 공개 화면, BO는 관리자 운영 화면, Firebase는 향후 문서 데이터 저장 및
          조회를 담당하는 백엔드로 연결될 예정입니다.
        </p>

        <h2>FO / BO / Firebase 방향</h2>
        <ul>
          <li>FO: 공개 문서 탐색, 목록 조회, 상세 열람 중심</li>
          <li>BO: 문서 등록, 수정, 분류, 공개 여부 관리 중심</li>
          <li>Firebase: Firestore 기반 데이터 저장 및 조회 연동 예정</li>
        </ul>

        <h2>현재 단계</h2>
        <p>
          현재 버전은 mock data 기반으로 구현되어 있어, UI/데이터 구조 검증과 GitHub Pages
          배포에 적합한 형태입니다.
        </p>
      </section>
    </div>
  )
}

function ArchiveCard({ item, onViewDetail }) {
  return (
    <article className="archive-card">
      <div className="archive-meta">
        <span className="badge">{countryMap[item.country]}</span>
        <span className="badge subtle">{typeMap[item.type]}</span>
      </div>
      <h3>{item.title}</h3>
      <p className="archive-summary">{item.summary}</p>
      <dl className="archive-info">
        <div>
          <dt>발행월</dt>
          <dd>{item.publishMonth}</dd>
        </div>
      </dl>
      <button className="primary-button full" onClick={() => onViewDetail(item.id)}>
        상세보기
      </button>
    </article>
  )
}

export default App
