import { Handler } from "@netlify/functions";
import fetch from "node-fetch";

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
  const r = await fetch("https://snaptik.biz/api/ajaxSearch", {
    // @ts-ignore
    "credentials": "include",
    "headers": {
      "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
      "Accept": "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Requested-With": "XMLHttpRequest",
      "Alt-Used": "snaptik.biz",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin"
    },
    "referrer": "https://snaptik.biz/en",
    "body": `q=${encodeURIComponent(url)}`,
    "method": "POST",
    "mode": "cors"
  });

  if (!r.ok) {
    console.error(`[ERROR] Request failed: ${r.status}`);
    return null;
  }

  const html = await r.text();

  console.log(html)

  const matches = [...html.matchAll(/<a href=\\"(.+?)"/g)];

  return matches[1]?.[1] ?? null;
}

const handler: Handler = async (event, _context) => {
  const defaultHeaders = {
    "Access-Control-Allow-Origin": "*",
  };

  const originalUrl = event.queryStringParameters?.["url"];
  if (!originalUrl) {
    return {
      statusCode: 400,
      headers: { ...defaultHeaders },
      body: "Bad request",
    };
  }

  try {
    const directCdnUrl = await getVidLink(originalUrl);
    if (directCdnUrl === null) {
      console.log(
        `Failed to fetch direct link for video with url=${originalUrl}`
      );
      return {
        statusCode: 500,
        headers: { ...defaultHeaders },
      };
    }
    console.log("Got direct link:", directCdnUrl);

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
