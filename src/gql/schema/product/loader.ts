import DataLoader from 'dataloader';
import { findProductsByIds, type ProductRow } from '../../../data/db/products';

// Apollo Context へ差し込む Loader 群の型定義。
// 今回は Product 単体だが、実サービスではリポジトリの種類ごとに増えていく想定。
export type ProductLoaders = {
  productById: DataLoader<string, ProductRow | null>;
};

export function createProductLoaders(): ProductLoaders {
  return {
    productById: new DataLoader(async (ids) => {
      // DataLoader の key 順で結果を返すために Map 経由で整列し直す。
      // こうしておけば同じ ID を複数回リクエストしても 1 回の DB 呼び出しで済む。
      const rows = await findProductsByIds(ids);
      const map = new Map(rows.map((row) => [row.id, row]));
      return ids.map((id) => map.get(id) ?? null);
    }),
  };
}
