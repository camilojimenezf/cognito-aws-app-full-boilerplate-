import type { IUser } from "../interfaces/user.interface";

export type EnsureUser = () => Promise<IUser>;
