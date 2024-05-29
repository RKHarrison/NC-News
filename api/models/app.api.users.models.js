const db = require('../../db/connection')

exports.checkUserExists = (username) => {
    const sqlQuery = 'SELECT * FROM users WHERE username = $1'

    return db.query(sqlQuery, [username])
    .then(({rows}) => {
        const article = rows[0]
        if(!article) {
            return Promise.reject({status: 404, msg: 'User Not Found'})
        }
    })
}