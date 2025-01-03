import dotenv from "dotenv"
dotenv.config()
import {PutObjectCommand } from "@aws-sdk/client-s3";
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.S3_ENDPOINT ?? "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
export const saveToS3 = async (key: string, filePath: string, content: string): Promise<void> => {
    try {
      const params = {
        Bucket: process.env.S3_BUCKET ?? "",
        Key: `${key}${filePath}`,
        Body: content,
      };
  
      const command = new PutObjectCommand(params);
      await s3.send(command);
  
      console.log(`Successfully saved ${key}${filePath} to S3`);
    } catch (error) {
      console.error("Error saving to S3:", error);
      throw error;
    }
  };