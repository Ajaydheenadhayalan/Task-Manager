const db = require('./config/db');
const id = parseInt(process.argv[2] || '1', 10);
db.run("UPDATE users SET role='admin' WHERE id = ?", [id], function(err){
  if(err) console.error('Error promoting:', err);
  else console.log('Promoted user id', id);
  process.exit();
});
