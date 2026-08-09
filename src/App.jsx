import { useState, useEffect } from 'react';
import './App.css';
import { usePathRouting } from './hooks/usePathRouting';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AdazahiEasterEgg } from './components/common/AdazahiEasterEgg';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { TierListTab } from './components/tiers/TierListTab';
import { RobotsGuideTab } from './components/robots/RobotsGuideTab';
import { BuildGuidesTab } from './components/builds/BuildGuidesTab';
import { SpecializationsTab } from './components/specializations/SpecializationsTab';
import { PilotSkillsTab } from './components/pilots/PilotSkillsTab';
import { WeaponsDpsTab } from './components/weapons/WeaponsDpsTab';
import { HangarAnalyzerTab } from './components/hangar/HangarAnalyzerTab';
import { DetailModal } from './components/common/DetailModal';

const BACKGROUND_IMAGES = {
  dashboard: '/backgrounds/home-bg.webp',
  tiers: '/backgrounds/tierlist-bg.webp',
  robots: '/backgrounds/value-bg.webp',
  builds: '/backgrounds/buildguides-bg.webp',
  specializations: '/backgrounds/specializations-bg.webp',
  pilots: '/backgrounds/pilotskills-bg.webp',
  weapons: '/backgrounds/dps-bg.webp',
  hangar: '/backgrounds/hangaranalyzer-bg.webp',
};

const TAB_METADATA = {
  dashboard: {
    title: 'War Robots Guide Database & Tools',
    description: 'Welcome to the database compiled by the expert community at War Robots Guide. Navigate to the top of the site to browse our extensive collection of helpful resources!'
  },
  tiers: {
    title: 'Robot Tier List & Analysis',
    description: 'Explore our tier list ratings for War Robots. View detailed breakdowns for longevity, lethality, mobility, utility, and overall meta rankings.'
  },
  robots: {
    title: 'Robot Guide Ratings & Scores',
    description: 'In-depth performance evaluation and guide scores for every robot in War Robots, calculated by experts.'
  },
  builds: {
    title: 'Recommended Robot Build Guides',
    description: 'Curated builds, module pairings, drone setups, and weapons for top-tier War Robots.'
  },
  specializations: {
    title: 'Module & Specialization Database',
    description: 'Comprehensive database of passive and active modules, titan specializations, and optimal pairings.'
  },
  pilots: {
    title: 'Legendary Pilot Skills Database',
    description: 'Complete pilot skills list with stat boosts, synergy details, and recommended pilot setups.'
  },
  weapons: {
    title: 'Weapon DPS & Burst Damage Charts',
    description: 'Compare weapon DPS, cycle damage, range, reload speed, and burst capabilities.'
  },
  hangar: {
    title: 'Hangar Analyzer Tool',
    description: 'Analyze your War Robots hangar composition, calculate overall power scores, and receive tailored optimization tips.'
  }
};

function App() {
  const [activeTab, setActiveTab] = usePathRouting('dashboard');
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const meta = TAB_METADATA[activeTab] || TAB_METADATA.dashboard;
    document.title = `${meta.title} | War Robots Guide`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', meta.description);

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      const canonicalUrl = `https://warrobotsguide.com${activeTab === 'dashboard' ? '' : '/' + activeTab}`;
      canonicalLink.setAttribute('href', canonicalUrl);
    }
  }, [activeTab]);
  const [isEasterEggActive, setIsEasterEggActive] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isAdazahiEggActive, setIsAdazahiEggActive] = useState(false);
  const [clickCountAdazahi, setClickCountAdazahi] = useState(0);

  const handleDeveloperClick = () => {
    const nextCount = clickCount + 1;
    setClickCount(nextCount);
    if (nextCount === 4) {
      setIsEasterEggActive(true);
      console.log("Easter egg activated! Welcome to the CrimsonHawk theme.");
    }
  };

  const handleAdazahiClick = () => {
    const nextCount = clickCountAdazahi + 1;
    setClickCountAdazahi(nextCount);
    if (nextCount === 8) {
      setIsAdazahiEggActive(true);
      console.log("Adazahi easter egg activated! Welcome to the Adazahi theme.");
    }
  };

  useEffect(() => {
    if (isEasterEggActive) {
      document.body.style.background = '#07080c'; // Neutral dark background to remove blue tint
    } else {
      document.body.style.background = '';
    }
  }, [isEasterEggActive]);

  const [currentTab, setCurrentTab] = useState(activeTab);

  if (activeTab !== currentTab) {
    setCurrentTab(activeTab);
    setSelectedItem(null);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const openItemDetails = (name, type, data) => {
    setSelectedItem({ name, type, data });
  };

  const tabs = ['dashboard', 'tiers', 'robots', 'builds', 'specializations', 'pilots', 'weapons', 'hangar'];

  return (
    <div className="app-container">
      {/* Background Layers for cross-browser fading transitions */}
      <div className="bg-layers">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;

          let bgUrl;
          if (isEasterEggActive) {
            bgUrl = "url('/backgrounds/easteregg-crimsonhawk-bg.webp')";
          } else {
            bgUrl = `url('${BACKGROUND_IMAGES[tab]}')`;
          }

          const transformStyle = isActive ? 'scale(1.02)' : 'scale(1.12)';
          const filterStyle = isActive ? 'blur(0px)' : 'blur(4px)';

          return (
            <div
              key={tab}
              className={`bg-layer bg-theme-${tab} ${isActive ? 'active' : ''}`}
              style={{
                backgroundImage: bgUrl,
                opacity: isActive ? (isEasterEggActive ? 0.75 : 0.15) : 0,
                transform: transformStyle,
                filter: filterStyle
              }}
            />
          );
        })}
      </div>

      <Header activeTab={activeTab} onTabChange={setActiveTab} isEasterEggActive={isEasterEggActive} />

      <main className={`main-content bg-theme-${activeTab}`}>
        {activeTab === 'dashboard' && <DashboardTab onTabChange={setActiveTab} onItemClick={openItemDetails} />}
        {activeTab === 'tiers' && <TierListTab onItemClick={openItemDetails} />}
        {activeTab === 'robots' && <RobotsGuideTab onItemClick={openItemDetails} />}
        {activeTab === 'builds' && <BuildGuidesTab />}
        {activeTab === 'specializations' && <SpecializationsTab onItemClick={openItemDetails} />}
        {activeTab === 'pilots' && <PilotSkillsTab />}
        {activeTab === 'weapons' && <WeaponsDpsTab />}
        {activeTab === 'hangar' && <HangarAnalyzerTab />}
      </main>

      <Footer onDeveloperClick={handleDeveloperClick} onAdazahiClick={handleAdazahiClick} />

      {isAdazahiEggActive && <AdazahiEasterEgg />}

      {selectedItem && (
        <DetailModal selectedItem={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}

export default App;
