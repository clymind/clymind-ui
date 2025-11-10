import React from "react";

export const FloatingRefresh = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={() => {
      try {
        onClick();
      } catch (e) {
        /* ignore */
      }
      window.location.reload();
    }}
    className="btn btn-success position-fixed bottom-0 end-0 m-4 shadow"
    aria-label="Refresh"
    title="Refresh"
  >
    Refresh
  </button>
);

