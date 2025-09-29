import { createUserLoaders, type UserLoaders } from './schema/user/loader';
import {
  createProductLoaders,
  type ProductLoaders,
} from './schema/product/loader';

export type Context = {
  loaders: Loaders;
};

export type Loaders = UserLoaders & ProductLoaders;

export async function createContext(): Promise<Context> {
  // サーバーごとに DataLoader を作り直すことで、1 リクエスト内の N+1 を解消しつつ
  // リクエスト間では状態を共有しない（=キャッシュを汚さない）構成にしている。
  return {
    loaders: {
      ...createUserLoaders(),
      ...createProductLoaders(),
    },
  };
}
