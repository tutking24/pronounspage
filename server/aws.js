export default {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
    },
    params: {
        Bucket: process.env.AWS_S3_BUCKET,
    },
};
