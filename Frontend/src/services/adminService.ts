// src/services/adminService.ts
import { api } from "./api";

/**
 * Grants the issuer role to a specified account.
 * @param account - The account address to grant the issuer role.
 */
export async function grantIssuerRole(account: string) {
  const response = await api.post("/admin/grant-issuer", { account });
  return response.data;
}

/**
 * Revokes the issuer role from a specified account.
 * @param account - The account address to revoke the issuer role.
 */
export async function revokeIssuerRole(account: string) {
  const response = await api.post("/admin/revoke-issuer", { account });
  return response.data;
}

/**
 * Checks if a specified account has the issuer role.
 * @param account - The account address to check.
 * @returns A boolean indicating if the account is an issuer.
 */
export async function isIssuer(account: string): Promise<boolean> {
  const response = await api.get(`/admin/is-issuer/${account}`);
  return response.data.issuer; // Assumes response has { issuer: boolean }
}
