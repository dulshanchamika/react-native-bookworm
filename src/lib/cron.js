import cron from 'cron';
import https from 'https';

const job = new cron.CronJob('*/14 * * * *', function () {
  https
  .get(process.env.API_URL, (res) => {
    if (res.statusCode === 200) console.log("GET request sent successfully!");
    else console.log("GET request failed with status code:", res.statusCode);
  })
  .on('error', (e) => 
    console.error("error while sending request:", e));
});

export default job;

// CRON JOB EXPLANATION
//cron jobs are schedules tasks that run periodically at specified intervals.
// we want to send 1 GET request every 14 minutes

// how to define a "Schedule"?
// define a schedule using cron expression, which consists og 5 field representing 
// minute, hour, day of month, month, and day of week.

//?example 
// 0 0 * * * - At 00:00 every day
// 0 0 * * 0 - At 00:00 every Sunday
// 0 0 * * 1-5 - At 00:00 every weekday (Monday to Friday)
// 30 3 15 * * - At 03:30 on the 15th of every month
// 0 0 1 1 * - At 00:00 on the 1st of January every year
// 0 * * * * - At the start of every hour