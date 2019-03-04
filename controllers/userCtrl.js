const calendarCtrl = require('./calendarCtrl');

const connection = require('../database');

module.exports = {
    connectCalendar: async (req, res) => {
        try{
            const { access_token, refresh_token } = req.body;
            // await User.save(access_token, refresh_token);
    
            const calendarData = await calendarCtrl.getCalendarFromGoogle(access_token, refresh_token);

            res.status(201).send({
                calendarData
            });
        }catch(err) {
            res.status(404).send({
                err
            });
        }
    },
    createUser: async (req, res) => {
        try {
            const { name, password } = req.body;
            console.log(req.body)

            const sql = `INSERT INTO user (name, password) VALUES ('${name}', '${password}')`;
            const newUser = await connection.query(sql, (err, result) => {
                if(err) throw err;
            });

            res.status(201).send({
                data: "Successfully created user"
            });
        }catch(err) {
            console.log(err);
            res.status(404).send({
                err
            });
        }
    },
    addFriend: async (req, res) => {
        try {
            const { userId, friendId } = req.body;

            const sql = `INSERT INTO friend_pairs (friend1, friend2) VALUES ('${userId}', '${friendId}')`;
            const newFriendship = await connection.query(sql, (err, result) => {
                if(err) throw err;
            });

            res.status(201).send({
                data: "Successfully added friend"
            });
        }catch(err) {
            console.log(err);
            res.status(404).send({
                err
            });
        }
    },
    getFriends: async (req, res) => {
        try {
            const userId = req.params.id;

            const sql = `SELECT IF(friend_pairs.friend1 != ${userId}) AS friend1, IF(friend_pairs.friend2 != ${userId}) as friend2 FROM friend_pairs JOIN user ON friend_pairs.friend1 = user.id WHERE friend1 = ${userId} OR friend2 = ${userId}`;
            const friends = await connection.query(sql, (err, result) => {
                if(err) throw err;

                console.log(result);

                res.status(201).send({
                    data: result
                });
            });


        }catch(err) {
            console.log(err);
            res.status(404).send({
                err
            });
        }
    },
    test: (req, res) => {
        console.log(connection);
        const sql = "INSERT INTO user (name, password) VALUES ('Daniel Ring', '123')";
        connection.query(sql, (err, result) => {
          if (err) {
              res.send(err)
              throw err;
          }
          console.log(result);
          console.log("Database created");
          res.send(result);
        });
    }
}