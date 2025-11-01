import React from "react";
import "./DashboardPage.scss";

function DashboardPage() {
  const powerBILink = import.meta.env.VITE_POWER_BI_LINK;

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">📊 Dashboard Power BI - Essentia</h1>

      <div className="dashboard-frame-container">
        <iframe
          title="SaveIt-forms"
          width="600"
          height="373.5"
          src={powerBILink}
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default DashboardPage;
