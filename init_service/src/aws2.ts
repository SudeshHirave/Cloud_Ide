import dotenv from "dotenv"
dotenv.config()
import { CopyObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: "us-east-2",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export async function copyS3fol({ fromBucket, fromLocation, toBucket, toLocation }:
    { fromBucket:string, fromLocation:string, toBucket:string, toLocation:string }): Promise<void>{
        try {
            let count = 0;
            const recursiveCopy = async function(token?:string) {
              const listCommand = new ListObjectsV2Command({
                Bucket: fromBucket,
                Prefix: fromLocation,
                ContinuationToken: token
              });
              let list = await s3.send(listCommand); 
              if (list.KeyCount) {
                const fromObjectKeys = list.Contents.map((content: { Key: any; }) => content.Key ?? ""); 
                for (let fromObjectKey of fromObjectKeys) { 
                  const toObjectKey = fromObjectKey.replace(fromLocation, toLocation);
                  const copyCommand = new CopyObjectCommand({
                    Bucket: toBucket,
                    CopySource: `${fromBucket}/${fromObjectKey}`,
                    Key: toObjectKey
                  });
                  await s3.send(copyCommand);
                  count += 1;
                }
              }
              if (list.NextContinuationToken) {
                await recursiveCopy(list.NextContinuationToken);
              }
            };
            await recursiveCopy();

        } catch (error) {
            console.error('Error copying folder:', error);
        }
}
