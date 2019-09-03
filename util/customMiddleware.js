const { verifyToken } = require('./jwt')
const { geolocate } = require('./ip');

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const idConstructor = require('mongoose').Types.ObjectId;

module.exports = {
    // Middleware used for all routes
    // Attempt to login user
    // and call next() regardless of success
	authenticate: async (req, res, next) => {
        const { token } = req.body;

        // No attempt to login
        if(!token) {
            const now = new Date().toLocaleString();
            console.log(`\n---- Login failed | No Token provided ----`);

            try {
                const { country, city, zip, isp } = await geolocate(req.ip);
                console.log(`${now} | ${req.ip} | ${isp}`);
                
                console.log(`>> ${city}, ${country} ${zip}`);
            }catch(err) {
                console.log('Authenticate middleware, no token error:');
                console.log(err);
            }

            return next();
        }

        try{
            const payload = await verifyToken(token);
            console.log('Login Middleware');
            console.log(payload);

            // Logged in
            if(payload && payload.user) {
                console.log('Successfully logged in');
                req.user = payload.user;
            }else {
            // Invalid attempt to login
                console.log('Could not Log in');
            }
        }catch(err) {
            console.log(err);
        }
        
        // Always call next()
        console.log('Calling next from login middleware');
        return next();
	},
    isAuthenticated: (req, res, next) => {
        if (req.user) {
            next();
        }else {
            console.log('Not logged in')
            res.status(401).send('Please login');
        }
    },
    uploadToAws: async(req, res, next) => {
        const bucketName = 'closet-backend';
        const userId = req.user.id;

        console.log(req.body);

        // Get files
        let files;
        if(req.file) {
            files = [{
                buffer: req.file.buffer,
                name: req.file.originalname
            }];
        }
        else {
            files = req.files.map(file => ({
                buffer: file.buffer,
                name: file.originalname
            }));
        }

        // Create id for file
        // Upload and save url
        try {
            let awsUrls = [];
            let ids = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const id = idConstructor();

                const uploadParams = {
                    Bucket: bucketName,
                    Key: `users/${userId}/${id}`,
                    Body: file.buffer,
                    ACL: 'public-read'
                };

                await s3.upload(uploadParams).promise();

                const url = `https://${bucketName}.s3.amazonaws.com/${uploadParams.Key}`;
                awsUrls.push(url);
                ids.push(id);
            }
            console.log('uploaded');

            req.awsUrls = awsUrls;
            req.ids = ids;

            next();
        }catch(err) {
            console.log(err)
        }
    }
}
