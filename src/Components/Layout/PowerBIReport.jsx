// src/components/PowerBIReport.jsx

import React, { useEffect, useState } from "react";
import { PowerBIEmbed } from "powerbi-client-react";
import { models } from "powerbi-client";

function PowerBIReport({ embedUrl, accessToken, reportId, embedConfigOverrides }) {

  const [config, setConfig] = useState(null);

  useEffect(() => {
    if (embedUrl && accessToken && reportId) {
      const cfg = {
        type: "report",
        id: reportId,
        embedUrl: embedUrl,
        accessToken: accessToken,
        tokenType: models.TokenType.Embed,
        settings: {
          panes: {
            filters: {
              visible: false
            }
          },
          background: models.BackgroundType.Transparent
        },
        ...embedConfigOverrides,
      };
      setConfig(cfg);
    }
  }, [embedUrl, accessToken, reportId, embedConfigOverrides]);

  if (!config) {
    return <div>Carregando relatório...</div>;
  }

  return (
    <PowerBIEmbed
      embedConfig={config}
      cssClassName="report-style-class"
      getEmbeddedComponent={(embeddedReport) => {
        console.log("Report embedded", embeddedReport);
      }}
    />
  );
}

export default PowerBIReport;
