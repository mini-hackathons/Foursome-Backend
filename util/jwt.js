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
    expiresIn: '7d',
    algorithm: 'RS256'
}

module.exports = {
    createAndSendToken: (payload, res) => {
	console.log('In createAndSendJwt');
        const token = jwt.sign(payload, privateKey, signOptions);
        console.log(token);
console.log('token');
        res.send(token)
    },
    verifyToken: async (token) => {
console.log('Verifying');
	const payload = await jwt.verify(token, publicKey, signOptions);
	return payload;
    },
    a: () => {
	console.log('In a');
    }
}
