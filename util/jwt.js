const jwt = require('jsonwebtoken');
const publicKey = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n');
const privateKey = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n');

const i = 'Foursome';
const s = 'User';
const a = 'FoursomeApp'
const signOptions = {
    issuer: i,
    subject: s,
    audience: a,
    expiresIn: '30d',
    algorithm: 'RS256'
}

module.exports = {
    createAndSendToken: async (payload, res) => {
        try {
            console.log('In createAndSendJwt');
            const token = await jwt.sign(payload, privateKey, signOptions);
            console.log(token);
            
            console.log('token');
            res.send(token)
        }catch(err) {
            console.log(err);
            res.status(500).send('Could not create token');
        }
    },
    createToken: async (payload) => {
        try {
            console.log('In createJwt');
            console.time('jwt');
            const token = await jwt.sign(payload, privateKey, signOptions);
            console.timeEnd('jwt');

            console.time('log');
            console.log(token);
            console.timeEnd('log');
            
            console.log('token');
            return token;
        }catch(err) {
            console.log(err);
        }
    },
    verifyToken: async (token) => {
        try{
            console.log('Verifying');
            const payload = await jwt.verify(token, publicKey, signOptions);

            return payload;
        }catch(err) {
            console.log(err);
            res.status(500).send('Could not verify JWT');
        }
    },
    a: () => {
        console.log('In a');
    }
}
