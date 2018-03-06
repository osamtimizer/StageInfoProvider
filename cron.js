let cron = require('node-cron');
cron.schedule('* * * * * *', () => {
  console.log("hello nodejs");
});
