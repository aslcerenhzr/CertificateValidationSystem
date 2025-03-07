// src/services/pinataService.ts
import axios from "axios";
import FormData from "form-data";
import fs, { ReadStream } from "fs";
import dotenv from "dotenv";
dotenv.config();

const PINATA_JWT = process.env.PINATA_JWT || "";

// Pinata endpoints
const PIN_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PIN_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";

export class PinataService {
  /**
   * Pin a file (Buffer) to Pinata using a JWT for auth
   */
  static async pinFileBuffer(fileBuffer: Buffer, fileName = "upload.bin") {
    try {
      const data = new FormData();
      data.append("file", fileBuffer, { filename: fileName });

      const res = await axios.post(PIN_FILE_URL, data, {
        maxBodyLength: Infinity,
        headers: {
          ...data.getHeaders(),
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZDg4YzljZC1kOWExLTQyNGMtYmZiMC1mYTgwZGM0OGIxN2YiLCJlbWFpbCI6Im1ham92ZWgxOTJAY2N0b29sei5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOWMxYTBmNTBiNjhiMTdhNTBiYmUiLCJzY29wZWRLZXlTZWNyZXQiOiIzZDAwZTU3ZjE5YzgzYWE3NDc1Yzk3OTliYTMxYzZlZDVkZGE3MWExZTc0ODhkMDhjZjQ5MTliNzFkYjNhMjg0IiwiZXhwIjoxNzY2NjAwMjg5fQ.-3EOe7Ts2QaM8Kvz73nk-YcgqLNcdtFvfeBF3vhZxaI'
        },
      });

      // Typically returns { IpfsHash, PinSize, Timestamp, etc. }
      console.log(res.data);
      return res.data.IpfsHash;
    } catch (error: any) {
      console.error("Error pinning file to Pinata:", error?.message);
      throw error;
    }
  }

  /**
   * Pin a local file path to Pinata using a JWT
   */
  static async pinFilePath(filePath: string) {
    try {
      const data = new FormData();
      data.append("file", fs.createReadStream(filePath) as ReadStream);

      const res = await axios.post(PIN_FILE_URL, data, {
        maxBodyLength: Infinity,
        headers: {
          ...data.getHeaders(),
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      });

      return res.data;
    } catch (error: any) {
      console.error("Error pinning file to Pinata:", error?.message);
      throw error;
    }
  }

  /**
   * Pin a JSON object to Pinata using a JWT
   */
  static async pinJSON(jsonData: object, name = "myJSON") {
    try {
      const res = await axios.post(
        PIN_JSON_URL,
        {
          pinataMetadata: { name },
          pinataContent: jsonData,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${PINATA_JWT}`,
          },
        }
      );
      return res.data; // { IpfsHash, PinSize, Timestamp, etc. }
    } catch (error: any) {
      console.error("Error pinning JSON to Pinata:", error?.message);
      throw error;
    }
  }
}
