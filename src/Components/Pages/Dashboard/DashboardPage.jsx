import React from "react";
import "./DashboardPage.scss";

function DashboardPage() {
  const powerBILink =
  "https://app.powerbi.com/view?r=eyJrIjoiYmQ3OTNjNzAtNDI5MS00YzBlLWI4ZGItMTIwYTY5M2FlMDg5IiwidCI6ImIxNDhmMTRjLTIzOTctNDAyYy1hYjZhLTFiNDcxMTE3N2FjMCJ9";

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">📊 Dashboard Power BI - Essentia</h1>

      <div className="dashboard-frame-container">
      <iframe title="SaveIt-forms" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiYmE0ZjE3YjEtMzNjZC00Y2M5LWIyYjUtN2IxMTFjY2M1YTUyIiwidCI6ImIxNDhmMTRjLTIzOTctNDAyYy1hYjZhLTFiNDcxMTE3N2FjMCJ9" frameborder="0" allowFullScreen="true"></iframe>
      </div>
    </div>
  );
}

export default DashboardPage;
