const sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "./db.sqlite";

let db  = new sqlite3.Database(DBSOURCE, (err) => {
    if(err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to SQLite database');
        db.run(`CREATE TABLE users (
        user_id INTEGER, 
        email TEXT,
        passw TEXT)`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Creating rows
                    let insert = 'INSERT INTO users (user_id, email, passw) VALUES (?,?,?)';
                    db.run(insert, [123098, 'phillCollins@gmail.com','5502013']);
                    db.run(insert, [42424242,'dukenukem3d@mustdie.com','RodriguesShallLiveLong']);
                    db.run(insert, [5,'yourchick@yandex.ru','semolinaAndPain666']);

                }
            })
    }
});

module.exports = db;