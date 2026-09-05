import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import robotGuideData from '../../data/robot_guide.json';
import { sortBySearchQuery } from '../../utils/sortUtils';
import { SearchInput } from '../common/SearchInput';
import { BuildDetailModal } from './BuildDetailModal';

// Precompute static data at module level to optimize render loop
const precomputedBuilds = (robotGuideData?.builds || []).map(build => {
  const is_ultimate = Boolean(
    build.is_ultimate ||
    build.build_name?.toLowerCase() === 'ultimate' ||
    build.robot?.toLowerCase().startsWith('ue ')
  );
  return {
    ...build,
    is_ultimate,
    _searchString: `${build.build_name} ${build.robot} ${build.best_weapons} ${build.drone_options || ''} ${build.explanation}`.toLowerCase(),
    parsed_build_name: build.build_name.replace(/\n/g, ' '),
    parsed_pilot: build.pilot.replace(/\n/g, ' '),
    parsed_specialization: build.specialization.split('\n')
  };
});

function renderDroneOptions(options, fontSize = '12.5px') {
  if (!options || options === 'N/A') return 'N/A';
  const lines = options.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return 'N/A';
  return (
    <div style={{ fontSize, lineHeight: 1.4 }}>
      {lines.map((line, idx) => (
        <span
          key={idx}
          style={{
            display: 'block',
            fontWeight: idx === 0 ? 700 : 'normal',
            color: idx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)'
          }}
        >
          {line}
        </span>
      ))}
    </div>
  );
}

export function BuildGuidesTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuild, setSelectedBuild] = useState(null);

  // Lazy loading state
  const [visibleCount, setVisibleCount] = useState(12);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setVisibleCount(12);
  }

  const filteredBuilds = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      return precomputedBuilds;
    }

    let filtered = precomputedBuilds.filter(build => build._searchString.includes(query));

    // Prioritize robot name matches:
    // 1. Exact match on robot name
    // 2. Starts with robot name
    // 3. Substring match on robot name
    // 4. Other matches (non-robot)
    return sortBySearchQuery(filtered, query, (build) => build.robot);
  }, [searchQuery]);

  // Paginated visible items list
  const visibleBuilds = useMemo(() => {
    return filteredBuilds.slice(0, visibleCount);
  }, [filteredBuilds, visibleCount]);

  // IntersectionObserver callback ref for infinite scrolling
  const observerRef = useRef(null);
  const sentinelRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => prev + 12);
      }
    }, { rootMargin: '200px' });

    if (node) observerRef.current.observe(node);
  }, []);

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="animate-fade-in text-left">
      <div className="hero-banner" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Robot build guides</h2>
        <p style={{ margin: '0 auto' }}>
          Learn the best weapon, specialization, pilot, and drone configurations for your robots.
          <span style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)', opacity: 0.85 }}>
            <em>Build guides are only provided for recommended robots.</em>
          </span>
        </p>
      </div>

      {/* Search builds */}
      <div className="search-container">
        <SearchInput
          placeholder="Search builds by bot name, weapon, description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Builds Grid */}
      <div className="dashboard-grid">
        {visibleBuilds.map((build, index) => (
          <div 
            className={`glass-panel glass-panel-hover build-card ${build.is_ultimate ? 'ultimate-build-card' : ''}`}
            style={build.is_ultimate ? { borderColor: 'rgba(234, 179, 8, 0.25)' } : {}}
            key={`${build.robot}-${build.build_name}-${index}`}
            onClick={() => setSelectedBuild(build)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedBuild(build); } }}
            tabIndex={0}
            role="button"
            aria-label={`View details for build ${build.parsed_build_name} on ${build.robot}`}
          >
            <div className="build-title-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span className="spec-class-tag" style={{ background: 'rgba(6, 182, 212, 0.1)', color: 'var(--cyan)', borderColor: 'rgba(6, 182, 212, 0.2)', display: 'inline-block' }}>
                    {build.robot}
                  </span>
                  {build.is_ultimate && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      letterSpacing: '0.06em',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(234, 179, 8, 0.15)',
                      color: '#fbbf24',
                      border: '1px solid rgba(234, 179, 8, 0.35)',
                      textTransform: 'uppercase'
                    }}>
                      Ultimate
                    </span>
                  )}
                </div>
                <h3 className="build-name">{build.parsed_build_name}</h3>
              </div>
            </div>

            <div className="build-meta-grid">
              <div className="build-meta-item">
                <span className="build-meta-label">Pilot options</span>
                <span className="build-meta-value">{build.parsed_pilot}</span>
              </div>
              <div className="build-meta-item">
                <span className="build-meta-label">specializations & modules</span>
                <div className="build-meta-value" style={{ fontSize: '11.5px', lineHeight: 1.4 }}>
                  {build.parsed_specialization.map((line, lidx) => (
                    <div key={lidx}>{line}</div>
                  ))}
                </div>
              </div>
              <div className="build-meta-item" style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                <span className="build-meta-label">Weapon Options</span>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '3px' }}>F2P SETUPS</span>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{build.f2p_weapons || 'N/A'}</div>
                  </div>
                  <div style={{ flex: 1, borderLeft: '1px solid var(--border-light)', paddingLeft: '10px' }}>
                    <span style={{ fontSize: '10px', color: '#fbbf24', fontWeight: 600, display: 'block', marginBottom: '3px' }}>META SETUPS</span>
                    <div style={{ fontSize: '12px', color: '#fbbf24', whiteSpace: 'pre-line', lineHeight: 1.4 }}>{build.best_weapons || 'N/A'}</div>
                  </div>
                </div>
              </div>
              <div className="build-meta-item" style={{ gridColumn: 'span 2', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                <span className="build-meta-label">Drone Options</span>
                <div style={{ marginTop: '4px' }}>
                  {renderDroneOptions(build.drone_options, '12.5px')}
                </div>
              </div>
            </div>

            <div className="build-explanation">
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>EXPLANATION</span>
              {build.explanation}
            </div>
          </div>
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      {visibleCount < filteredBuilds.length && (
        <div 
          ref={sentinelRef} 
          style={{ height: '20px', margin: '20px 0' }} 
        />
      )}

      {/* UE Weapon Index Reference Legend */}
      {robotGuideData?.ue_weapon_index && Object.keys(robotGuideData.ue_weapon_index).length > 0 && (
        <div className="glass-panel" style={{ marginTop: '28px', padding: '18px 22px' }}>
          <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600, letterSpacing: '0.05em' }}>
            UE (Ultimate Edition) Weapon Index
          </h4>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 14px 0', lineHeight: 1.4 }}>
            When build guides specify <em>&quot;UE Setups&quot;</em>, <em>&quot;Midrange UE setups&quot;</em>, or <em>&quot;Close range UE setups&quot;</em>, refer to these weapon categories:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
            {Object.entries(robotGuideData.ue_weapon_index).map(([category, weapons]) => (
              <div key={category} style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <strong style={{ color: '#fbbf24', fontSize: '12.5px', display: 'block', marginBottom: '3px' }}>
                  {category} Setups
                </strong>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {weapons}
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '12px' }}>
            * F2P weapons are obtainable through workshop or black market. ARM-M and ARM-L are collab items.
          </div>
        </div>
      )}

      {selectedBuild && (
        <BuildDetailModal build={selectedBuild} onClose={() => setSelectedBuild(null)} />
      )}
    </div>
  );
}
