import React from 'react';

function Landing({ onNavigate }) {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section text-white py-5">
        <div className="container">
          <div className="row align-items-center min-vh-100">
            <div className="col-lg-6">
              <h1 className="display-3 fw-bold mb-3 text-dark-navy">
                FlowVeda
              </h1>
              <h2 className="h2 mb-4 text-dark-teal fw-bold">
                Flow With Confidence
              </h2>
              <p className="lead mb-4 text-muted">
                A next-generation water utility product that goes beyond consumption metering to include intelligent water quality monitoring.
              </p>
              <div className="d-flex gap-3">
                <button 
                  className="btn btn-primary btn-lg px-4"
                  onClick={() => onNavigate('register')}
                >
                  Get Started
                </button>
                <button 
                  className="btn btn-outline-secondary btn-lg px-4"
                  onClick={() => onNavigate('login')}
                >
                  Sign In
                </button>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="hero-image">
                <div className="water-quality-visual mb-4">
                  <i className="fas fa-tint display-1 text-primary mb-3"></i>
                  <div className="water-drop-animation"></div>
                </div>
                <div className="quality-indicators">
                  <div className="indicator safe">
                    <span className="dot"></span>
                    <span>Safe to Use</span>
                  </div>
                  <div className="indicator warning">
                    <span className="dot"></span>
                    <span>Monitor</span>
                  </div>
                  <div className="indicator danger">
                    <span className="dot"></span>
                    <span>Attention Needed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3 text-dark-navy">Why Choose FlowVeda?</h2>
              <p className="lead text-muted">
                Advanced water quality monitoring made simple and accessible
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card h-100 p-4 border rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="fas fa-shield-alt fa-3x text-primary"></i>
                </div>
                <h4 className="fw-bold text-dark-teal">Instant Water Safety</h4>
                <p className="text-muted">
                  Know your water quality in real time with continuous monitoring of all critical parameters.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card h-100 p-4 border rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="fas fa-exclamation-triangle fa-3x text-warning"></i>
                </div>
                <h4 className="fw-bold text-dark-teal">Urgency Alerts</h4>
                <p className="text-muted">
                  Detect unusual water flow or water consumption patterns and get instant notifications.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card h-100 p-4 border rounded-3 shadow-sm">
                <div className="feature-icon mb-3">
                  <i className="fas fa-tools fa-3x text-success"></i>
                </div>
                <h4 className="fw-bold text-dark-teal">Proactive Maintenance</h4>
                <p className="text-muted">
                  Fix problems before they become major issues with predictive analytics and intelligent recommendations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Parameters Section */}
      <section className="parameters-section py-5 bg-gradient-water">
        <div className="container">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h2 className="display-5 fw-bold mb-3 text-white">What We Monitor</h2>
              <p className="lead text-white-50">
                Comprehensive water quality parameters for complete peace of mind
              </p>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-md-4 col-lg-2 col-sm-6">
              <div className="parameter-card text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="parameter-icon mb-3">
                  <i className="fas fa-balance-scale fa-2x text-primary"></i>
                </div>
                <h6 className="fw-bold">pH Level</h6>
                <p className="text-muted small mb-0">
                  Optimal: 6.5-8.5
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-2 col-sm-6">
              <div className="parameter-card text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="parameter-icon mb-3">
                  <i className="fas fa-microscope fa-2x text-info"></i>
                </div>
                <h6 className="fw-bold">TDS</h6>
                <p className="text-muted small mb-0">
                  Total Dissolved Solids
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-2 col-sm-6">
              <div className="parameter-card text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="parameter-icon mb-3">
                  <i className="fas fa-eye fa-2x text-warning"></i>
                </div>
                <h6 className="fw-bold">Turbidity</h6>
                <p className="text-muted small mb-0">
                  Water Clarity
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-2 col-sm-6">
              <div className="parameter-card text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="parameter-icon mb-3">
                  <i className="fas fa-shield-alt fa-2x text-success"></i>
                </div>
                <h6 className="fw-bold">Chlorine</h6>
                <p className="text-muted small mb-0">
                  Disinfection Level
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-2 col-sm-6">
              <div className="parameter-card text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="parameter-icon mb-3">
                  <i className="fas fa-gem fa-2x text-secondary"></i>
                </div>
                <h6 className="fw-bold">Hardness</h6>
                <p className="text-muted small mb-0">
                  Mineral Content
                </p>
              </div>
            </div>
            <div className="col-md-4 col-lg-2 col-sm-6">
              <div className="parameter-card text-center p-4 bg-white rounded-3 shadow-sm">
                <div className="parameter-icon mb-3">
                  <i className="fas fa-bug fa-2x text-danger"></i>
                </div>
                <h6 className="fw-bold">Microbial Proxy</h6>
                <p className="text-muted small mb-0">
                  Contamination Risk
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-gradient-primary text-white">
        <div className="container">
          <div className="row text-center">
            <div className="col-lg-8 mx-auto">
              <h2 className="display-5 fw-bold mb-4">
                Ready to Flow With Confidence?
              </h2>
              <p className="lead mb-4">
                Join thousands of families who trust FlowVeda for intelligent water quality monitoring.
                Get started today with our easy setup and comprehensive dashboard.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <button 
                  className="btn btn-light btn-lg px-5"
                  onClick={() => onNavigate('register')}
                >
                  Start Monitoring Now
                </button>
                <button 
                  className="btn btn-outline-light btn-lg px-4"
                  onClick={() => onNavigate('login')}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-section py-4 bg-dark-navy text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="fw-bold text-white">FlowVeda</h5>
              <p className="text-white-50 mb-2">
                Flow With Confidence
              </p>
              <p className="text-white-50">
                intelligent water quality monitoring for a healthier tomorrow.
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="social-links mb-3">
                <a href="#" className="text-white-50 me-3">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-white-50 me-3">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-white-50 me-3">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-white-50">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <p className="text-white-50 mb-0">
                © 2024 FlowVeda. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
