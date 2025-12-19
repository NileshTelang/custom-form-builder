const TOTAL_REQUESTS = 2000;
const URL = 'http://localhost:3000/forms/mFipuEwqsN/submit';
const PAYLOAD = { firstname: "god", new_email_field: "god@gevme.com", age: 20 };

async function sendRequest() {
  const response = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'Origin': 'http://localhost:5173',
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

