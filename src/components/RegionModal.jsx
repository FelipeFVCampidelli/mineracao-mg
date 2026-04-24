import React, { useState, useEffect } from 'react'
import RegionShape from './RegionShape.jsx'
import { getRegion } from '../data/index.js'
import { useRegionData, useMineralData } from '../hooks/useData.js'
import { useMunicipalities } from '../hooks/useMunicipalities.js'
import { useLocale } from '../hooks/useLocale.js'

const MINERAL_NAMES = {
  pt: { 'ferro':'Ferro','ouro':'Ouro','diamante':'Diamante','calcario':'Calcário','litio':'Lítio','granito':'Granito','bauxita':'Bauxita','quartzo':'Quartzo','silica':'Sílica','fosfato':'Fosfato','terra-rara':'Terra Rara','niobio':'Nióbio','prata':'Prata','chumbo':'Chumbo','tantalo':'Tântalo','zinco':'Zinco','estanho':'Estanho','caulim':'Caulim','manganes':'Manganês','niquel':'Níquel','agua-mineral':'Água Mineral','cobre':'Cobre' },
  en: { 'ferro':'Iron','ouro':'Gold','diamante':'Diamond','calcario':'Limestone','litio':'Lithium','granito':'Granite','bauxita':'Bauxite','quartzo':'Quartz','silica':'Silica','fosfato':'Phosphate','terra-rara':'Rare Earth','niobio':'Niobium','prata':'Silver','chumbo':'Lead','tantalo':'Tantalum','zinco':'Zinc','estanho':'Tin','caulim':'Kaolin','manganes':'Manganese','niquel':'Nickel','agua-mineral':'Mineral Water','cobre':'Copper' },
  es: { 'ferro':'Hierro','ouro':'Oro','diamante':'Diamante','calcario':'Caliza','litio':'Litio','granito':'Granito','bauxita':'Bauxita','quartzo':'Cuarzo','silica':'Sílice','fosfato':'Fosfato','terra-rara':'Tierras Raras','niobio':'Niobio','prata':'Plata','chumbo':'Plomo','tantalo':'Tántalo','zinco':'Zinc','estanho':'Estaño','caulim':'Caolín','manganes':'Manganeso','niquel':'Níquel','agua-mineral':'Agua Mineral','cobre':'Cobre' },
}

function MineralDetail({ mineralId, onBack }) {
  const { data } = useMineralData(mineralId)
  const { t, locale } = useLocale()
  const title = data ? (data[`title_${locale}`] || data.title) : ''
  const description = data ? (data[`description_${locale}`] || data.description) : ''

  return (
    <div style={styles.innerWrap}>
      <button style={styles.backBtn} onClick={onBack}>{t('nav.back')}</button>
      {data && (
        <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {data.photo && (
            <div style={{ flexShrink: 0 }}>
              <img src={import.meta.env.BASE_URL + data.photo.replace(/^\//, '')} alt={title} style={{ width: '180px', height: '180px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
              {data.source && <p style={{ ...styles.muted, textAlign: 'center', marginTop: 6 }}>{t('mineral.source')}: {data.source}</p>}
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h2 style={styles.h2}>{title}</h2>
            {description
              ? description.split('\n\n').map((p, i) => <p key={i} style={styles.body}>{p}</p>)
              : <p style={styles.muted}>{t('mineral.soon')}</p>
            }
          </div>
        </div>
      )}
    </div>
  )
}

function MineralsList({ stateId, regionId, region, features, onBack, onSelectMineral }) {
  const { data } = useRegionData(stateId, regionId)
  const { t, locale } = useLocale()
  const names = MINERAL_NAMES[locale] ?? MINERAL_NAMES.pt

  return (
    <div style={styles.innerWrap}>
      <button style={styles.backBtn} onClick={onBack}>{t('nav.back')}</button>
      <div style={styles.splitLayout}>
        <div style={styles.shapeCol}>
          <RegionShape features={features} color={region.color} />
          <div style={styles.regionLabel}>
            <div style={{ ...styles.dot, background: region.color }} />
            <span style={styles.regionName}>{region.name}</span>
          </div>
        </div>
        <div style={styles.listCard}>
          <h3 style={styles.h3}>{t('region.minerals')}</h3>
          {data?.minerals?.map(id => (
            <button key={id} style={styles.mineralBtn}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-hover)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}
              onClick={() => onSelectMineral(id)}>
              {names[id] ?? id}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function MunicipalitiesList({ stateId, regionId, region, features, onBack }) {
  const { municipalities, loading } = useMunicipalities(stateId, regionId)
  const { t } = useLocale()
  const [page, setPage] = useState(0)
  const PAGE = 54
  const total = municipalities?.length ?? 0
  const totalPages = Math.ceil(total / PAGE)
  const visible = (municipalities ?? []).slice(page * PAGE, (page + 1) * PAGE)
  const perCol = Math.ceil(visible.length / 3)
  const cols = [visible.slice(0, perCol), visible.slice(perCol, perCol * 2), visible.slice(perCol * 2)]

  return (
    <div style={styles.innerWrap}>
      <button style={styles.backBtn} onClick={onBack}>{t('nav.back')}</button>
      <div style={styles.splitLayout}>
        <div style={styles.shapeCol}>
          <RegionShape features={features} color={region.color} />
          <div style={styles.regionLabel}>
            <div style={{ ...styles.dot, background: region.color }} />
            <span style={styles.regionName}>{region.name}</span>
          </div>
        </div>
        <div style={{ ...styles.listCard, minWidth: '420px' }}>
          <h3 style={styles.h3}>{t('region.municipalities')}</h3>
          {loading && <p style={styles.muted}>{t('mineral.loading')}</p>}
          {!loading && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2px 12px' }}>
                {cols.map((col, ci) => (
                  <div key={ci}>{col.map((name, i) => <p key={i} style={styles.muniItem}>{name}</p>)}</div>
                ))}
              </div>
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <div style={{ minWidth: 90 }}>
                    {page > 0 && <button style={styles.pageBtn} onClick={() => setPage(p => p - 1)}>{t('pagination.previous')}</button>}
                  </div>
                  <span style={styles.muted}>{page + 1}/{totalPages}</span>
                  <div style={{ minWidth: 90, textAlign: 'right' }}>
                    {page < totalPages - 1 && <button style={styles.pageBtn} onClick={() => setPage(p => p + 1)}>{t('pagination.next')}</button>}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RegionModal({ stateId, regionId, features, onClose }) {
  const [view, setView] = useState('overview')
  const [selectedMineral, setSelectedMineral] = useState(null)
  const { t } = useLocale()
  const region = getRegion(stateId, regionId)

  useEffect(() => { setView('overview') }, [regionId])

  if (!region) return null

  const handleBack = () => {
    if (view === 'mineralDetail') setView('minerals')
    else setView('overview')
  }

  return (
    <>
      <div style={styles.backdrop} onClick={onClose} />
      <div style={styles.dialog}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        {view === 'overview' && (
          <div style={styles.innerWrap}>
            <div style={styles.splitLayout}>
              <div style={styles.shapeCol}>
                <RegionShape features={features} color={region.color} />
                <div style={styles.regionLabel}>
                  <div style={{ ...styles.dot, background: region.color }} />
                  <span style={styles.regionName}>{region.name}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 200 }}>
                <button style={styles.actionBtn}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  onClick={() => setView('minerals')}>
                  {t('region.minerals')}
                </button>
                <button style={styles.actionBtn}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.transform = 'translateY(0)' }}
                  onClick={() => setView('municipalities')}>
                  {t('region.municipalities')}
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'minerals' && (
          <MineralsList stateId={stateId} regionId={regionId} region={region} features={features}
            onBack={handleBack} onSelectMineral={id => { setSelectedMineral(id); setView('mineralDetail') }} />
        )}

        {view === 'municipalities' && (
          <MunicipalitiesList stateId={stateId} regionId={regionId} region={region} features={features} onBack={handleBack} />
        )}

        {view === 'mineralDetail' && (
          <MineralDetail mineralId={selectedMineral} onBack={handleBack} />
        )}
      </div>
    </>
  )
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 3000 },
  dialog: {
    position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px', padding: '40px', zIndex: 3001,
    minWidth: '560px', maxWidth: '820px', maxHeight: '85vh', overflowY: 'auto', width: 'max-content',
  },
  closeBtn: { position: 'absolute', top: 14, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 18, cursor: 'pointer', padding: '4px 8px' },
  innerWrap: { display: 'flex', flexDirection: 'column', gap: 16 },
  splitLayout: { display: 'flex', alignItems: 'center', gap: 48 },
  shapeCol: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12, flexShrink: 0 },
  regionLabel: { display: 'flex', alignItems: 'center', gap: 8 },
  dot: { width: 16, height: 16, borderRadius: 3 },
  regionName: { fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text)' },
  actionBtn: { display: 'block', width: '100%', padding: '18px 32px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text)', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, cursor: 'pointer', textAlign: 'center', transition: 'background 0.2s, transform 0.15s' },
  backBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 13, letterSpacing: '0.05em', padding: '0 0 8px 0', transition: 'color 0.2s', alignSelf: 'flex-start' },
  h2: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500, color: 'var(--text)', marginBottom: 12, lineHeight: 1.3 },
  h3: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, color: 'var(--text)', textAlign: 'center', marginBottom: 16 },
  body: { fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 300, color: 'var(--text)', lineHeight: 1.7, marginBottom: 10 },
  muted: { fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--text-muted)' },
  mineralBtn: { display: 'block', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--accent)', padding: '5px 0', textAlign: 'center', transition: 'color 0.2s' },
  listCard: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '24px 28px' },
  muniItem: { fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 300, color: 'var(--text)', padding: '2px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' },
  pageBtn: { background: 'none', border: '1px solid var(--border)', borderRadius: 3, color: 'var(--accent)', fontFamily: 'var(--font-display)', fontSize: 13, padding: '3px 10px', cursor: 'pointer' },
}