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
  { id: 'countries', label: '국가별 보기' },
  { id: 'about', label: 'About' },
]

function App() {
  const [page, setPage] = useState('home')
  const [selectedCountry, setSelectedCountry] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCountryPage, setSelectedCountryPage] = useState('mx')

  const [archiveContents, setArchiveContents] = useState([])
  const [selectedContentId, setSelectedContentId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const fetchArchiveContents = async () => {
      setIsLoading(true)
      setLoadError('')

      try {
        const snapshot = await getDocs(collection(db, 'archiveContents'))
        const items = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((item) => item.isPublished)

        if (items.length > 0) {
          setArchiveContents(items)
          setSelectedContentId(items[0].id)
        } else {
          setArchiveContents(archiveContentsFallback)
          setSelectedContentId(archiveContentsFallback[0]?.id ?? null)
        }
      } catch (error) {
        console.error('Firestore 조회 실패:', error)
        setLoadError('일시적으로 자료를 불러오지 못해 기본 자료를 표시합니다.')
        setArchiveContents(archiveContentsFallback)
        setSelectedContentId(archiveContentsFallback[0]?.id ?? null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchArchiveContents()
  }, [])

  const selectedContent = Array.isArray(archiveContents)
    ? archiveContents.find((item) => item.id === selectedContentId)
    : null

  const filteredArchive = useMemo(() => {
    return archiveContents.filter((item) => {
      const countryMatched = selectedCountry === 'all' || item.country === selectedCountry
      const typeMatched = selectedType === 'all' || item.type === selectedType
      return countryMatched && typeMatched
    })
  }, [archiveContents, selectedCountry, selectedType])

  const latestContents = useMemo(() => {
    return [...archiveContents]
      .sort((a, b) => (a.postedDate < b.postedDate ? 1 : -1))
      .slice(0, 6)
  }, [archiveContents])

  const countryGroupedContents = useMemo(() => {
    return archiveContents.filter((item) => item.country === selectedCountryPage)
  }, [archiveContents, selectedCountryPage])

  const relatedContents = useMemo(() => {
    if (!selectedContent) return []

    const sameCountry = archiveContents.filter(
      (item) => item.id !== selectedContent.id && item.country === selectedContent.country,
    )

    const sameType = archiveContents.filter(
      (item) =>
        item.id !== selectedContent.id &&
        item.country !== selectedContent.country &&
        item.type === selectedContent.type,
    )

    return [...sameCountry, ...sameType].slice(0, 6)
  }, [archiveContents, selectedContent])

  const goToDetail = (contentId) => {
    setSelectedContentId(contentId)
    setPage('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToCountryPage = (countryCode) => {
    setSelectedCountryPage(countryCode)
    setPage('countries')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToArchiveWithFilter = (type = 'all', country = 'all') => {
    setSelectedType(type)
    setSelectedCountry(country)
    setPage('archive')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBackToArchive = () => {
    setPage('archive')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <button className="brand" onClick={() => setPage('home')}>
          <span className="brand-badge">KOIPA</span>
          <div className="brand-copy">
            <strong>KOIPA 중남미 IP 아카이브</strong>
            <p>중남미 7개국 지식재산권 정보와 최신 현장뉴스 아카이브</p>
          </div>
        </button>

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
        </nav>
      </header>

      <main className="page-container">
        {loadError && (
          <div className="page-content">
            <div className="notice-box">
              <strong>{loadError}</strong>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="page-content">
            <div className="empty-box">
              <strong>자료를 불러오는 중입니다.</strong>
              <p>잠시만 기다려 주세요.</p>
            </div>
          </div>
        ) : (
          <>
            {page === 'home' && (
              <HomePage
                latestContents={latestContents}
                onViewDetail={goToDetail}
                onMoveArchive={goToArchiveWithFilter}
                onMoveCountryPage={goToCountryPage}
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

            {page === 'countries' && (
              <CountriesPage
                selectedCountryPage={selectedCountryPage}
                setSelectedCountryPage={setSelectedCountryPage}
                contents={countryGroupedContents}
                onMoveArchive={goToArchiveWithFilter}
                onViewDetail={goToDetail}
              />
            )}

            {page === 'detail' && selectedContent && (
              <DetailPage
                content={selectedContent}
                relatedContents={relatedContents}
                onBack={goBackToArchive}
                onViewDetail={goToDetail}
              />
            )}

            {page === 'about' && <AboutPage />}
          </>
        )}
      </main>

      <footer className="site-footer">
        <p>© KOIPA 중남미 IP 아카이브</p>
      </footer>
    </div>
  )
}

function HomePage({ latestContents, onViewDetail, onMoveArchive, onMoveCountryPage }) {
  return (
    <div className="page-content">
      <section className="hero-section">
        <div className="hero-copy full-width">
          <span className="section-eyebrow">중남미 IP 정보 아카이브</span>
          <h1>중남미 7개국의 지식재산권 정보를 한 곳에서 확인하세요.</h1>
          <p>
            멕시코, 브라질, 칠레, 페루, 콜롬비아, 아르헨티나, 에콰도르의
            지식재산권 제도 및 일반 정보와 최신 정책·동향·판례 기반 현장뉴스를
            국가별로 직관적으로 열람할 수 있습니다.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onMoveArchive('all', 'all')}>
              전체 자료 보기
            </button>
            <button className="secondary-button" onClick={() => onMoveArchive('news', 'all')}>
              최신 현장뉴스 보기
            </button>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-head">
          <h2>국가별 바로가기</h2>
          <p>관심 있는 국가를 선택하여 관련 자료를 빠르게 확인할 수 있습니다.</p>
        </div>

        <div className="country-grid">
          {countries.map((country) => (
            <button
              key={country.code}
              className="country-card"
              onClick={() => onMoveCountryPage(country.code)}
            >
              <strong>{country.name}</strong>
              <span>자료 보기</span>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head inline">
          <div>
            <h2>최신 업데이트</h2>
            <p>최근 등록된 자료를 확인해 보세요.</p>
          </div>
          <button className="text-button" onClick={() => onMoveArchive('all', 'all')}>
            전체 아카이브 보기
          </button>
        </div>

        <div className="archive-grid">
          {latestContents.map((item) => (
            <ArchiveCard key={item.id} item={item} onViewDetail={onViewDetail} />
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
      <section className="page-intro-block">
        <span className="section-eyebrow">Archive</span>
        <h1 className="page-title">아카이브</h1>
        <p>
          국가별 지식재산권 기초 참고자료와 글로벌 IP 현장뉴스를
          자료 유형과 국가 기준으로 손쉽게 탐색할 수 있습니다.
        </p>
      </section>

      <section className="section-block">
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
            <span>자료 유형</span>
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
            <strong>조건에 맞는 자료가 없습니다.</strong>
            <p>국가 또는 자료 유형을 다시 선택해 주세요.</p>
          </div>
        )}
      </section>
    </div>
  )
}

function CountriesPage({
  selectedCountryPage,
  setSelectedCountryPage,
  contents,
  onMoveArchive,
  onViewDetail,
}) {
  const selectedCountryName = countryMap[selectedCountryPage]
  const referenceContents = contents.filter((item) => item.type === 'reference')
  const newsContents = contents.filter((item) => item.type === 'news')

  return (
    <div className="page-content">
      <section className="page-intro-block">
        <span className="section-eyebrow">Countries</span>
        <h1 className="page-title">국가별 보기</h1>
        <p>국가별로 기초 참고자료와 글로벌 IP 현장뉴스를 구분하여 확인할 수 있습니다.</p>
      </section>

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

      <section className="section-block">
        <div className="section-head inline">
          <div>
            <h2>{selectedCountryName} 기초 참고자료</h2>
            <p>{selectedCountryName}의 지식재산권 제도 및 일반 정보 자료입니다.</p>
          </div>
          <button
            className="text-button"
            onClick={() => onMoveArchive('reference', selectedCountryPage)}
          >
            전체 보기
          </button>
        </div>

        <div className="archive-grid">
          {referenceContents.slice(0, 6).map((item) => (
            <ArchiveCard key={item.id} item={item} onViewDetail={onViewDetail} />
          ))}
        </div>

        {referenceContents.length === 0 && (
          <div className="empty-box">
            <strong>등록된 기초 참고자료가 없습니다.</strong>
          </div>
        )}
      </section>

      <section className="section-block">
        <div className="section-head inline">
          <div>
            <h2>{selectedCountryName} 글로벌 IP 현장뉴스</h2>
            <p>{selectedCountryName} 관련 최신 정책·동향·판례 자료입니다.</p>
          </div>
          <button
            className="text-button"
            onClick={() => onMoveArchive('news', selectedCountryPage)}
          >
            전체 보기
          </button>
        </div>

        <div className="archive-grid">
          {newsContents.slice(0, 6).map((item) => (
            <ArchiveCard key={item.id} item={item} onViewDetail={onViewDetail} />
          ))}
        </div>

        {newsContents.length === 0 && (
          <div className="empty-box">
            <strong>등록된 글로벌 IP 현장뉴스가 없습니다.</strong>
          </div>
        )}
      </section>
    </div>
  )
}

function DetailPage({ content, relatedContents, onBack, onViewDetail }) {
  return (
    <div className="page-content">
      <div className="detail-toolbar">
        <button className="back-button" onClick={onBack}>
          ← 목록으로 돌아가기
        </button>
      </div>

      <section className="detail-layout">
        <article className="detail-main">
          <span className="section-eyebrow">자료 상세</span>
          <h1 className="detail-title">{content.title}</h1>

          <div className="meta-inline">
            <span>{countryMap[content.country] || content.country}</span>
            <span>{typeMap[content.type] || content.type}</span>
            <span>{content.publishMonth}</span>
            <span>{content.postedDate}</span>
          </div>

          {content.summary && <p className="detail-summary">{content.summary}</p>}

          <div className="detail-body">
            {(content.body || '').split('\n').map((paragraph, index) => (
              <p key={`${content.id}-${index}`}>{paragraph}</p>
            ))}
          </div>
        </article>

        <aside className="detail-side-stack">
          <div className="info-box">
            <h3>자료 정보</h3>
            <dl>
              <div>
                <dt>국가</dt>
                <dd>{countryMap[content.country] || content.country}</dd>
              </div>
              <div>
                <dt>자료 유형</dt>
                <dd>{typeMap[content.type] || content.type}</dd>
              </div>
              <div>
                <dt>발행월</dt>
                <dd>{content.publishMonth}</dd>
              </div>
              <div>
                <dt>게시일</dt>
                <dd>{content.postedDate}</dd>
              </div>
            </dl>
          </div>

          <div className="info-box">
            <h3>다음에 볼 자료</h3>
            <div className="related-list">
              {relatedContents.length > 0 ? (
                relatedContents.map((item) => (
                  <button
                    key={item.id}
                    className="related-item"
                    onClick={() => onViewDetail(item.id)}
                  >
                    <span className="related-meta">
                      {countryMap[item.country] || item.country} · {typeMap[item.type] || item.type}
                    </span>
                    <strong>{item.title}</strong>
                  </button>
                ))
              ) : (
                <p className="related-empty">연결된 다른 자료가 아직 없습니다.</p>
              )}
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}

function AboutPage() {
  return (
    <div className="page-content">
      <section className="page-intro-block">
        <span className="section-eyebrow">About</span>
        <h1 className="page-title">서비스 소개</h1>
        <p>
          KOIPA 중남미 IP 아카이브는 중남미 7개국의 지식재산권 제도 및 일반 정보,
          그리고 최신 정책·동향·판례 기반 현장뉴스를 제공하는 정보 아카이브 서비스입니다.
        </p>
      </section>

      <section className="section-block">
        <div className="about-grid">
          <article className="info-card">
            <h2>제공 정보</h2>
            <p>
              중남미 7개국에 대한 지식재산권 제도·일반 정보 등 기초 참고자료와
              글로벌 IP 현장뉴스를 제공합니다.
            </p>
          </article>

          <article className="info-card">
            <h2>이용 방식</h2>
            <p>
              자료는 국가별 카테고리와 자료 유형 구분을 통해 직관적으로 탐색할 수 있도록
              구성되어 있습니다.
            </p>
          </article>

          <article className="info-card">
            <h2>업데이트</h2>
            <p>
              글로벌 IP 현장뉴스는 월별 업데이트를 통해 최신 정책·동향·판례 정보를
              지속적으로 제공합니다.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}

function ArchiveCard({ item, onViewDetail }) {
  return (
    <article className="archive-card">
      <div className="archive-meta">
        <span className="badge">{countryMap[item.country] || item.country}</span>
        <span className="badge subtle">{typeMap[item.type] || item.type}</span>
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
        자세히 보기
      </button>
    </article>
  )
}

export default App
