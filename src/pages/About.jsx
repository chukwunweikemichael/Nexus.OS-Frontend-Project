import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiTarget, FiZap, FiShield, FiGlobe, FiCpu, FiBarChart2 } from 'react-icons/fi';
import Navbar from '../components/Navbar';

const About = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="nexus-about-container">
      <Navbar />
      
      {/* Background Blueprint Grid */}
      <div className="bg-grid-overlay"></div>

      <main className="about-content">
        {/* TOP SYSTEM NAV */}
        <section className="about-hero">
          <button onClick={() => navigate("/")} className="back-btn group">
            <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> 
            SYSTEM_BACK_LINK
          </button>
          
          <div className="status-badge">
            <span className="pulse-dot"></span> 
            NETWORK_STATUS: OPERATIONAL [LAGOS_NODE_01]
          </div>

          <h1 className="mission-title">
            ENGINEERING <br />
            <span className="amber-gradient-text">THE FUTURE OF WORK.</span>
          </h1>
          <p className="mission-subtitle">NEXUS.OS // DECENTRALIZED PROFESSIONAL INFRASTRUCTURE</p>
        </section>

        {/* METRICS BAR - This makes it look like a real company */}
        <section className="system-metrics">
          <div className="metric-item">
            <span className="metric-value">99.9%</span>
            <span className="metric-label">UPTIME_SLA</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">24/7</span>
            <span className="metric-label">SECURE_ESCROW</span>
          </div>
          <div className="metric-item">
            <span className="metric-value">500+</span>
            <span className="metric-label">VETTED_OPERATORS</span>
          </div>
        </section>

        {/* CORE VALUES GRID */}
        <section className="values-grid">
          <div className="value-card">
            <FiGlobe className="value-icon" />
            <h3>GLOBAL SYNC</h3>
            <p>
              We eliminate borders. NEXUS.OS allows Lagos-based talent to 
              interface with London, New York, and Tokyo without the friction of 
              legacy banking or geographical bias.
            </p>
          </div>

          <div className="value-card border-amber">
            <div className="top-right-tag">ELITE</div>
            <FiShield className="value-icon amber-text" />
            <h3>SOVEREIGN SECURITY</h3>
            <p>
              Our protocol utilizes multi-signature escrow and rigorous KYC/KYB 
              verification. We protect the builder and the buyer with equal 
              force.
            </p>
          </div>

          <div className="value-card">
            <FiCpu className="value-icon" />
            <h3>TECH STACK AGNOSTIC</h3>
            <p>
              From React architects to Rust systems engineers, we curate a 
              directory of specialists capable of building the most complex 
              digital infrastructures on earth.
            </p>
          </div>
        </section>

        {/* THE MANIFESTO SECTION - Professional & Heavy */}
        <section className="manifesto-section">
          <div className="manifesto-box">
            <div className="manifesto-header">
              <FiBarChart2 className="text-amber-500" />
              <span>SYSTEM_MANIFESTO_v2.0</span>
            </div>
            <h2>WE DON'T HIRE. WE DEPLOY.</h2>
            <p>
              The era of "finding a freelancer" is over. NEXUS.OS is an 
              automated environment for technical acquisition. We believe 
              that the next Silicon Valley is a distributed network, and its 
              heart beats in Nigeria.
            </p>
            <div className="signature">
              <p>BY ORDER OF THE NEXUS COUNCIL</p>
              <p className="timestamp">INITIATED // APRIL 2026</p>
            </div>
          </div>
        </section>

        <footer className="about-footer">
          <div className="footer-links">
            <span>TERMS_OF_SYNC</span>
            <span>PRIVACY_PROTOCOL</span>
            <span>API_DOCS</span>
          </div>
          <p>© 2026 NEXUS.OS // DESIGNED & DEVELOPED IN NIGERIA BY CRYPTO-LORD</p>
        </footer>
      </main>
    </div>
  );
};

export default About;