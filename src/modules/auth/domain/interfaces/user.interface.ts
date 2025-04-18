import type { IRole } from "./role.interface";

export interface IUser {
  id: string;
  email: string;
  roles: IRole[];
}
