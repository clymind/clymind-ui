import React from "react";

export const PageShell = ({ children, logoSrc }: { children: React.ReactNode; logoSrc?: string }) => (
  <div className="bg-dark text-light min-vh-100">
    <header className="sticky-top">
      <nav className="navbar navbar-dark bg-dark border-bottom border-secondary py-2">
        <div className="container-fluid d-flex justify-content-center position-relative">
          <div className="d-flex align-items-center gap-2">
            {logoSrc ? (
              <img src={logoSrc} alt="ClyMind logo" style={{ width: 36, height: 36, borderRadius: 8 }} />
            ) : (
              <div className="bg-success rounded-3 d-inline-block" style={{ width: 36, height: 36 }} />
            )}
            <span className="navbar-brand mb-0 fs-5 fw-bold">ClyMind</span>
          </div>
        </div>
      </nav>
    </header>
    {children}
  </div>
);

