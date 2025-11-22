import { PowerBIEmbed } from 'powerbi-client-react';
import { models } from 'powerbi-client';

// TODO: Replace these with your actual values
const EMBED_URL = '<EMBED_URL_HERE>';
const REPORT_ID = '<REPORT_ID_HERE>';
const ACCESS_TOKEN = '<ACCESS_TOKEN_HERE>';

export default function PowerBIReport() {
  return (
    <div className="w-full h-[600px] my-8">
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: REPORT_ID,
          embedUrl: EMBED_URL,
          accessToken: ACCESS_TOKEN,
          tokenType: models.TokenType.Embed,
          settings: {
            panes: { filters: { visible: false }, pageNavigation: { visible: false } }
          }
        }}
        eventHandlers={
          new Map([
            ['loaded', function () {console.log('Report loaded');}],
            ['rendered', function () {console.log('Report rendered');}],
            ['error', function (event) {console.error(event.detail);}]
          ])
        }
        cssClassName="w-full h-full"
      />
    </div>
  );
}
