const db = require('../../db/connection')

exports.checkUserExists = (username) => {
    console.log(username);
    const sqlQuery = 'SELECT * FROM users WHERE username = $1'

    return db.query(sqlQuery, [username])
    .then(({rows}) => {
        const article = rows[0]
        console.log(article);
        if(!article) {
            return Promise.reject({status: 404, msg: 'User Not Found'})
        }
    })
}