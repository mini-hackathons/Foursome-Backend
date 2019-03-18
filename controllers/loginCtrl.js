const connection = require('../database');

const User = require('../models/User');

const bcrypt = require('bcrypt');
const saltRounds = 11;

module.exports = {
    test: async(req, res) => {
        try{
            console.log(req);

        //     const { email, username } = req.body;

        //     const user = await User.findOne({$or: [
        //         { email },
        //         { username }
        //     ]});

        res.status(200).send({
            data: 'a'
        });

        }catch(err) {
            console.log(err);

            res.status(404).send({
                err
            });
        }
    },
    getLogin: async (req, res) => {
        res.status(201).send({
            data: 'Login Page'
        })
    },
    login: async (req, res) => {
        // console.log(req);
        // console.log(res.req.session.cookie);
        // console.log(res.req.session.passport);

        // console.log({
        //     ...res,
        //     req: []
        // });
        res.status(200).send('Successully signed in!');
    },
    reset: async (req, res) => {
        try{

            res.status(201).send({
                calendarData
            });
        }catch(err){
            res.status(404).send({
                err
            });
        }
    }
}

// try{
//     const { userId } = req.body;

//     const sql = `SELECT lastAttempt FROM password WHERE userid = ${userId})`;
//     const queryResult = await connection.query(sql, (err, result) => {
//         if(err) throw err;

//         console.log(result);
//     });

//     res.status(201).send({
//         queryResult
//     });
// }catch(err) {
//     res.status(404).send({
//         err
//     });
// }

