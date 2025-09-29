import DataLoader from 'dataloader';
import {
  findUsersWithRelations,
  type UserWithRelations,
} from '../../../data/db/users';

// User の Loader は JOIN 済みデータをまとめて返す。GraphQL 側では二度手間なく
// addresses/profile を参照できるので、resolver を薄く保てる。
export type UserLoaders = {
  userWithRelations: DataLoader<string, UserWithRelations | null>;
};

export function createUserLoaders(): UserLoaders {
  return {
    userWithRelations: new DataLoader(async (ids) => {
      console.log('[loader] userWithRelations.loadMany', ids);
      const rows = await findUsersWithRelations(ids);
      console.log('[fetch] userWithRelations.findUsersWithRelations', ids);
      // 同じユーザー ID を複数回読み込むケースでも、ここで結果をキャッシュすれば
      // JOIN 済みデータを 1 度の疑似 DB 呼び出しで共有できる。
      const map = new Map(rows.map((row) => [row.id, row]));
      return ids.map((id) => map.get(id) ?? null);
    }),
  };
}
