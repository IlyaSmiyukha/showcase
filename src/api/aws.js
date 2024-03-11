import AWS from 'aws-sdk';

class AwsUploader {
  s3 = null;
  file = {};
  config = {}
  AWS = window.AWS

  constructor(file, data) {
    const {
      aws,
    } = data;

    this.file = file;
    this.config = data;
    this.AWS.config.update({
      region: aws.region,
    });

    this.AWS.config.credentials = new this.AWS.Credentials({
      accessKeyId: aws.key,
      secretAccessKey: aws.secret,
      sessionToken: aws.session_token,
    });

    this.s3 = new this.AWS.S3({
      params: {
        apiVersion: 'latest',
        useAccelerateEndpoint: aws.transfer_acceleration,
        Bucket: config.bucket,
      },
    });
  }

  uploadFile = () => {
    const uploadOptions = {
      queueSize: 1,
      service: this.s3,
      params: {
        Key: `${this.config.prefix}/${this.config.upload_id}`,
        Body: this.file,
        Bucket: this.config.bucket,
        ContentType: this.file.type,
      },
    };

    return new this.AWS.S3.ManagedUpload(uploadOptions);
  }

}

export default AwsUploader;
