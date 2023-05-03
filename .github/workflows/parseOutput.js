let data = '';
const stdin = process.stdin;
const totalPoints = 60;
const otherPoints = 20;
const otherPoints2 = 20;
const numInitialPassing = 7;

stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
  data += chunk;
});

stdin.on('end', function () {
  const result = JSON.parse(data);
  const { numPassedTests, numFailedTests, numTotalTests } = result;
  const pointsReceived = Math.ceil(((numPassedTests - numInitialPassing) / (numTotalTests - numInitialPassing)) * totalPoints);
  const output = `
Component | Passed Tests | Total Tests | Points Available | Points Received
--------- | -------- | -------- | -------- | --------
All tests, as originally given, are passing. | ${numPassedTests} | ${numTotalTests} | ${totalPoints} | ${pointsReceived}
Passwords are stored and managed securely | | | ${otherPoints2} | TBD1 
Clear, organized project structure | | | ${otherPoints} | TBD2 
**Total** | | | **${totalPoints + otherPoints + otherPoints2}** | **${pointsReceived} + TBD1 + TBD2 **
`
  process.stdout.write(output);
});

stdin.on('error', console.error);