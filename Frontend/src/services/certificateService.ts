// src/services/certificateService.ts
import { api } from "./api";

/**
 * Issues a new certificate.
 */
export async function uploadCertificate(
  studentAddress: string,
  issuerAddress: string,
  file: File
) {
  const formData = new FormData();
  formData.append("certificateFile", file);
  formData.append("studentAddress", studentAddress);
  formData.append("issuerAddress", issuerAddress);

  const response = await api.post("/certificates/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // the certificate record
}

/**
 * Retrieves a certificate by its ID.
 */
export async function getCertificate(certId: number) {
  const response = await api.get(`/certificates/${certId}`);
  return response.data; // { id, studentAddress, ipfsHash, ... }
}

/**
 * Verifies the signature of a certificate.
 */
export async function verifyCertificate(certId: number) {
  const response = await api.get(`/certificates/${certId}/verify`);
  return response.data; // { verified: boolean }
}

/**
 * Retrieves all certificates issued to a specific student.
 * @param studentAddress - The student's account address.
 */
export async function getCertificatesByStudent(studentAddress: string) {
  const response = await api.get(`/certificates/student/${studentAddress}`);
  return response.data; // Assumes an array of certificates
}
