const idConstructor = require('mongoose').Types.ObjectId;

const AWS = require('aws-sdk');
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

module.exports = {
    loggedIn: (req, res, next) => {
        // console.log('About to run loggedIn----------------');
        // console.log(req.cookies)
        if (req.user) {
            next();
        } else {
            console.log('Failed to log in')
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