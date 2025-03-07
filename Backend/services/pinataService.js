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
exports.PinataService = void 0;
// src/services/pinataService.ts
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PINATA_JWT = process.env.PINATA_JWT || "";
// Pinata endpoints
const PIN_FILE_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
const PIN_JSON_URL = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
class PinataService {
    /**
     * Pin a file (Buffer) to Pinata using a JWT for auth
     */
    static pinFileBuffer(fileBuffer_1) {
        return __awaiter(this, arguments, void 0, function* (fileBuffer, fileName = "upload.bin") {
            try {
                const data = new form_data_1.default();
                data.append("file", fileBuffer, { filename: fileName });
                const res = yield axios_1.default.post(PIN_FILE_URL, data, {
                    maxBodyLength: Infinity,
                    headers: Object.assign(Object.assign({}, data.getHeaders()), { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI2ZDg4YzljZC1kOWExLTQyNGMtYmZiMC1mYTgwZGM0OGIxN2YiLCJlbWFpbCI6Im1ham92ZWgxOTJAY2N0b29sei5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiOWMxYTBmNTBiNjhiMTdhNTBiYmUiLCJzY29wZWRLZXlTZWNyZXQiOiIzZDAwZTU3ZjE5YzgzYWE3NDc1Yzk3OTliYTMxYzZlZDVkZGE3MWExZTc0ODhkMDhjZjQ5MTliNzFkYjNhMjg0IiwiZXhwIjoxNzY2NjAwMjg5fQ.-3EOe7Ts2QaM8Kvz73nk-YcgqLNcdtFvfeBF3vhZxaI' }),
                });
                // Typically returns { IpfsHash, PinSize, Timestamp, etc. }
                console.log(res.data);
                return res.data.IpfsHash;
            }
            catch (error) {
                console.error("Error pinning file to Pinata:", error === null || error === void 0 ? void 0 : error.message);
                throw error;
            }
        });
    }
    /**
     * Pin a local file path to Pinata using a JWT
     */
    static pinFilePath(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = new form_data_1.default();
                data.append("file", fs_1.default.createReadStream(filePath));
                const res = yield axios_1.default.post(PIN_FILE_URL, data, {
                    maxBodyLength: Infinity,
                    headers: Object.assign(Object.assign({}, data.getHeaders()), { Authorization: `Bearer ${PINATA_JWT}` }),
                });
                return res.data;
            }
            catch (error) {
                console.error("Error pinning file to Pinata:", error === null || error === void 0 ? void 0 : error.message);
                throw error;
            }
        });
    }
    /**
     * Pin a JSON object to Pinata using a JWT
     */
    static pinJSON(jsonData_1) {
        return __awaiter(this, arguments, void 0, function* (jsonData, name = "myJSON") {
            try {
                const res = yield axios_1.default.post(PIN_JSON_URL, {
                    pinataMetadata: { name },
                    pinataContent: jsonData,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${PINATA_JWT}`,
                    },
                });
                return res.data; // { IpfsHash, PinSize, Timestamp, etc. }
            }
            catch (error) {
                console.error("Error pinning JSON to Pinata:", error === null || error === void 0 ? void 0 : error.message);
                throw error;
            }
        });
    }
}
exports.PinataService = PinataService;
