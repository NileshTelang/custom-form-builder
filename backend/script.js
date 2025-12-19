const TOTAL_REQUESTS = 2000;
const URL = 'http://localhost:3000/forms/IPOk4aQwhh/submit';
const PAYLOAD = { fistname: "stats", new_email_field: "stats@sg.com", age: 20 };

async function sendRequest() {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-GB,en;q=0.5',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Origin': 'http://localhost:5173',
      'Pragma': 'no-cache',
      'Referer': 'http://localhost:5173/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'Sec-GPC': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36',
      'sec-ch-ua': '"Brave";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
    },
    body: JSON.stringify(PAYLOAD),
  });
  return response;
}

async function main() {
  console.log(`🚀 Starting load test: ${TOTAL_REQUESTS} concurrent requests to ${URL}\n`);

  const start = Date.now();

  // Create all requests at once
  const requests = Array.from({ length: TOTAL_REQUESTS }, () => sendRequest());

  // Wait for all requests to complete
  const results = await Promise.allSettled(requests);

  const duration = Date.now() - start;

  // Count successes and failures
  let success = 0;
  let failed = 0;
  const statusCodes = {};

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const status = result.value.status;
      statusCodes[status] = (statusCodes[status] || 0) + 1;
      if (status >= 200 && status < 300) {
        success++;
      } else {
        failed++;
      }
    } else {
      console.log(result.reason);
      failed++;
      statusCodes['error'] = (statusCodes['error'] || 0) + 1;
    }
  }

  // Print results
  console.log('📊 Results:');
  console.log('─'.repeat(40));
  console.log(`Total requests:     ${TOTAL_REQUESTS}`);
  console.log(`Successful (2xx):   ${success}`);
  console.log(`Failed:             ${failed}`);
  console.log(`Duration:           ${duration}ms`);
  console.log(`Requests/sec:       ${(TOTAL_REQUESTS / (duration / 1000)).toFixed(2)}`);
  console.log('─'.repeat(40));
  console.log('Status code breakdown:', statusCodes);
}

main().catch(console.error);

