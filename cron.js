let cron = require('node-cron');
cron.schedule('1 0 0 * * *', () => {
  console.log("hello nodejs");
});
