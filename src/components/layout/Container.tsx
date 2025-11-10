import React from "react";

export const Container = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`container ${className}`}>{children}</div>
);
