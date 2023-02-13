import { bootstrap } from "global-agent";
import fetch from "node-fetch";

bootstrap();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function getVidLink(url: string) {
  const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:53.0) Gecko/20100101 Firefox/53.0",
    "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.0; Trident/5.0; Trident/5.0)",
    "Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; MDDCJS)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
    "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1)",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393",
    "Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12H321 Safari/600.1.4",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1",
  ];
  const r = await fetch("https://ssstik.io/abc?url=dl", {
    headers: {
      accept: "*/*",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      "accept-language": "en-US,en;q=0.9,de;q=0.8",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "hx-current-url": "https://ssstik.io/en",
      "hx-request": "true",
      "hx-target": "target",
      "hx-trigger": "_gcaptcha_pt",
      "sec-ch-ua":
        '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
    },
    referrer: "https://ssstik.io/en",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: `id=${encodeURIComponent(url)}&locale=en&tt=dllaWFo0`,
    method: "POST",
    // @ts-ignore-next-line
    mode: "cors",
    credentials: "include",
  });

  if (!r.ok) return console.error(`[ERROR] Request failed: ${r.status}`);
  const html = await r.text();

  const match =
    html.match(
      /id="direct_dl_link" style=\"display\:none\"\s+href=\"(.+)\"/
    )?.[1] ?? null;

  console.log(match);

  return match;
}

const handler = async (event, _context) => {
  const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
  };

  const originalUrl = event.queryStringParameters["url"];
  if (!originalUrl) {
    return {
      statusCode: 400,
      headers: { ...defaultHeaders },
      body: "Bad request",
    };
  }

  try {
    const directCdnUrl = await getVidLink(originalUrl);
    return {
      statusCode: 200,
      headers: { ...defaultHeaders },
      body: directCdnUrl,
    };
  } catch (e) {
    console.error(`[ERROR] ${e}`);
    return {
      statusCode: 500,
      headers: { ...defaultHeaders },
      body: `Server Error: ${e}`,
    };
  }
};

export { handler };
