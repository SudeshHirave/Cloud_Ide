"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyS3fol = copyS3fol;
//import { S3 } from "@aws-sdk/client-s3";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client_s3_1 = require("@aws-sdk/client-s3");
// const s3 = new S3({
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
//   },
//   region: process.env.AWS_REGION || "us-east-2",
//   endpoint: process.env.S3_ENDPOINT || undefined,
// });
const { S3Client } = require('@aws-sdk/client-s3');
const s3 = new S3Client({
    region: "us-east-2",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
function copyS3fol(_a) {
    return __awaiter(this, arguments, void 0, function* ({ fromBucket, fromLocation, toBucket, toLocation }) {
        try {
            let count = 0;
            const recursiveCopy = function (token) {
                return __awaiter(this, void 0, void 0, function* () {
                    const listCommand = new client_s3_1.ListObjectsV2Command({
                        Bucket: fromBucket,
                        Prefix: fromLocation,
                        ContinuationToken: token
                    });
                    let list = yield s3.send(listCommand); // get the list
                    if (list.KeyCount) { // if items to copy
                        const fromObjectKeys = list.Contents.map((content) => { var _a; return (_a = content.Key) !== null && _a !== void 0 ? _a : ""; }); // get the existing object keys
                        for (let fromObjectKey of fromObjectKeys) { // loop through items and copy each one
                            const toObjectKey = fromObjectKey.replace(fromLocation, toLocation); // replace with the destination in the key
                            // copy the file
                            const copyCommand = new client_s3_1.CopyObjectCommand({
                                Bucket: toBucket,
                                CopySource: `${fromBucket}/${fromObjectKey}`,
                                Key: toObjectKey
                            });
                            yield s3.send(copyCommand);
                            count += 1;
                        }
                    }
                    if (list.NextContinuationToken) {
                        yield recursiveCopy(list.NextContinuationToken);
                    }
                });
            };
            yield recursiveCopy();
        }
        catch (error) {
            console.error('Error copying folder:', error);
        }
    });
}
