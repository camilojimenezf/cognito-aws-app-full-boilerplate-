import { ApiClientFactory } from "../../../../api/api.client";
import type { EnsureUser } from "../../domain/actions/ensure-user.action";
import type { IUser } from "../../domain/interfaces/user.interface";

const apiClient = ApiClientFactory.createAuthClient();

export const ensureUser: EnsureUser = async (): Promise<IUser> => {
  const response = await apiClient.post("/api/auth/ensure-user");
  return response.data;
};
