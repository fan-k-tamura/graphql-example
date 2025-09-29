import type { GraphQLResolveInfo } from 'graphql';
import type { VendorRow } from '../../data/db/vendors';
import type { UserWithRelations } from '../../data/db/users';
import type { ProductRow } from '../../data/db/products';
import type { OrderWithRelations, OrderLineWithSubtotal } from '../../data/db/orders';
import type { AnnouncementRow } from '../../data/db/announcements';
import type { Context } from '../context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

/** 配送先情報 */
export type Address = {
  __typename?: 'Address';
  address: Scalars['String']['output'];
  code: Scalars['String']['output'];
  tel: Scalars['String']['output'];
};

export type AddressInput = {
  address: Scalars['String']['input'];
  code: Scalars['String']['input'];
  tel: Scalars['String']['input'];
};

export type Announcement = Node & {
  __typename?: 'Announcement';
  content: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  publishedAt: Scalars['String']['output'];
  title: Scalars['String']['output'];
};

export type AnnouncementConnection = {
  __typename?: 'AnnouncementConnection';
  edges: Array<AnnouncementEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

export type AnnouncementEdge = {
  __typename?: 'AnnouncementEdge';
  cursor: Scalars['String']['output'];
  node: Announcement;
};

/** 商品を追加する際の入力 */
export type CreateProductInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
};

/** createProduct のレスポンス */
export type CreateProductPayload = {
  __typename?: 'CreateProductPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  product: Product;
};

export type DeleteProductInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
};

/** deleteProduct のレスポンス */
export type DeleteProductPayload = {
  __typename?: 'DeleteProductPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  deletedProductId: Scalars['ID']['output'];
  product: Maybe<Product>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /** 新しい商品を仮保存する。レスポンスには Global ID を含める。 */
  createProduct: CreateProductPayload;
  /** 商品を論理削除する例。ID は Global ID。 */
  deleteProduct: DeleteProductPayload;
  /** 注文のステータスを変更し、最新状態を返す */
  updateOrderStatus: UpdateOrderStatusPayload;
  /** 既存商品を部分更新する。ID は Global ID を渡す。 */
  updateProduct: UpdateProductPayload;
  updateUserDetails: UpdateUserDetailsPayload;
};


export type MutationcreateProductArgs = {
  input: CreateProductInput;
};


export type MutationdeleteProductArgs = {
  input: DeleteProductInput;
};


export type MutationupdateOrderStatusArgs = {
  input: UpdateOrderStatusInput;
};


export type MutationupdateProductArgs = {
  input: UpdateProductInput;
};


export type MutationupdateUserDetailsArgs = {
  input: UpdateUserDetailsInput;
};

/** Relay で node(id: …) に対応する共通インターフェース */
export type Node = {
  /** Relay 互換の Global ID */
  id: Scalars['ID']['output'];
};

/** offset / limit ページング用のページ情報 */
export type OffsetPageInfo = {
  __typename?: 'OffsetPageInfo';
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  limit: Scalars['Int']['output'];
  offset: Scalars['Int']['output'];
};

/** ユーザー・明細付き注文 */
export type Order = {
  __typename?: 'Order';
  id: Scalars['ID']['output'];
  items: Array<OrderLine>;
  status: OrderStatus;
  total: Scalars['Int']['output'];
  user: User;
};

/** 注文明細（サンプルでは明細ごとの小計を持つ） */
export type OrderLine = {
  __typename?: 'OrderLine';
  id: Scalars['ID']['output'];
  product: Product;
  productId: Scalars['ID']['output'];
  productName: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  subtotal: Scalars['Int']['output'];
  unitPrice: Scalars['Int']['output'];
};

/** 注文ステータス */
export type OrderStatus =
  | 'DELIVERED'
  | 'PENDING'
  | 'SHIPPED';

/** 注文一覧のページングレスポンス */
export type OrdersPage = {
  __typename?: 'OrdersPage';
  items: Array<Order>;
  pageInfo: OffsetPageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Relay Connection のページ情報 */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** このページの最後のカーソル */
  endCursor: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  /** このページの最初のカーソル */
  startCursor: Maybe<Scalars['String']['output']>;
};

/** Relay Node 対応の Product */
export type Product = Node & {
  __typename?: 'Product';
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['Int']['output'];
};

/** Relay Connection で返す構造 */
export type ProductConnection = {
  __typename?: 'ProductConnection';
  edges: Array<ProductEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars['Int']['output'];
};

/** Product を包む Edge、Cursor は data 層で生成 */
export type ProductEdge = {
  __typename?: 'ProductEdge';
  cursor: Scalars['String']['output'];
  node: Product;
};

export type ProductFilterInput = {
  category?: InputMaybe<Scalars['String']['input']>;
};

export type ProductOrderByInput = {
  direction: SortDirection;
  field: ProductOrderField;
};

export type ProductOrderField =
  | 'NAME'
  | 'PRICE';

/** 1:1 のプロフィール情報 */
export type Profile = {
  __typename?: 'Profile';
  address: Scalars['String']['output'];
  tel: Scalars['String']['output'];
};

export type ProfilePatchInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  clear?: InputMaybe<Scalars['Boolean']['input']>;
  tel?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  announcements: AnnouncementConnection;
  node: Maybe<Node>;
  orders: OrdersPage;
  /** 単一商品を Global ID なしで取得 */
  product: Maybe<Product>;
  /** Relay Connection で商品一覧をページング */
  products: ProductConnection;
  /** 単一ユーザーの取得 */
  user: Maybe<User>;
  /** 複数ユーザーをまとめて読み込む例 */
  users: Array<User>;
  /** 単一仕入先 */
  vendor: Maybe<Vendor>;
  /** offset/limit ページングの例 */
  vendors: VendorsPage;
};


export type QueryannouncementsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first: Scalars['Int']['input'];
};


export type QuerynodeArgs = {
  id: Scalars['ID']['input'];
};


export type QueryordersArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};


export type QueryproductArgs = {
  id: Scalars['ID']['input'];
};


export type QueryproductsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<ProductFilterInput>;
  first: Scalars['Int']['input'];
  orderBy?: InputMaybe<ProductOrderByInput>;
};


export type QueryuserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryusersArgs = {
  ids: Array<Scalars['ID']['input']>;
};


export type QueryvendorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryvendorsArgs = {
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
};

/** 昇順 / 降順 */
export type SortDirection =
  | 'ASC'
  | 'DESC';

export type Subscription = {
  __typename?: 'Subscription';
  /** 指定した注文のステータス変更をリアルタイムで受け取る */
  orderStatusChanged: Order;
  productUpdated: Product;
};


export type SubscriptionorderStatusChangedArgs = {
  orderId: Scalars['ID']['input'];
};


export type SubscriptionproductUpdatedArgs = {
  productId: Scalars['ID']['input'];
};

/** 注文ステータス更新の入力 */
export type UpdateOrderStatusInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  status: OrderStatus;
};

/** 注文ステータス更新のレスポンス */
export type UpdateOrderStatusPayload = {
  __typename?: 'UpdateOrderStatusPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  order: Order;
};

/** 商品更新時の入力。patch は差分のみ渡す想定 */
export type UpdateProductInput = {
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  patch: UpdateProductPatch;
};

export type UpdateProductPatch = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
};

/** updateProduct のレスポンス */
export type UpdateProductPayload = {
  __typename?: 'UpdateProductPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  product: Product;
};

export type UpdateUserDetailsInput = {
  addresses?: InputMaybe<Array<AddressInput>>;
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  profilePatch?: InputMaybe<ProfilePatchInput>;
  userId: Scalars['ID']['input'];
  userPatch?: InputMaybe<UserPatchInput>;
};

export type UpdateUserDetailsPayload = {
  __typename?: 'UpdateUserDetailsPayload';
  clientMutationId: Maybe<Scalars['String']['output']>;
  user: User;
};

/** 配送先・プロフィール付きのユーザー */
export type User = {
  __typename?: 'User';
  addresses: Array<Address>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  profile: Maybe<Profile>;
};

export type UserPatchInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

/** 仕入先の基本情報 */
export type Vendor = {
  __typename?: 'Vendor';
  category: Scalars['String']['output'];
  contactEmail: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  phone: Scalars['String']['output'];
};

/** 仕入先一覧のページングレスポンス */
export type VendorsPage = {
  __typename?: 'VendorsPage';
  items: Array<Vendor>;
  pageInfo: OffsetPageInfo;
  totalCount: Scalars['Int']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = {
  Node: ( AnnouncementRow & { __typename: 'Announcement' } ) | ( ProductRow & { __typename: 'Product' } );
};

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Partial<Address>>;
  String: ResolverTypeWrapper<Partial<Scalars['String']['output']>>;
  AddressInput: ResolverTypeWrapper<Partial<AddressInput>>;
  Announcement: ResolverTypeWrapper<AnnouncementRow>;
  ID: ResolverTypeWrapper<Partial<Scalars['ID']['output']>>;
  AnnouncementConnection: ResolverTypeWrapper<Partial<Omit<AnnouncementConnection, 'edges'> & { edges: Array<ResolversTypes['AnnouncementEdge']> }>>;
  Int: ResolverTypeWrapper<Partial<Scalars['Int']['output']>>;
  AnnouncementEdge: ResolverTypeWrapper<Partial<Omit<AnnouncementEdge, 'node'> & { node: ResolversTypes['Announcement'] }>>;
  CreateProductInput: ResolverTypeWrapper<Partial<CreateProductInput>>;
  CreateProductPayload: ResolverTypeWrapper<Partial<Omit<CreateProductPayload, 'product'> & { product: ResolversTypes['Product'] }>>;
  DeleteProductInput: ResolverTypeWrapper<Partial<DeleteProductInput>>;
  DeleteProductPayload: ResolverTypeWrapper<Partial<Omit<DeleteProductPayload, 'product'> & { product?: Maybe<ResolversTypes['Product']> }>>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  OffsetPageInfo: ResolverTypeWrapper<Partial<OffsetPageInfo>>;
  Boolean: ResolverTypeWrapper<Partial<Scalars['Boolean']['output']>>;
  Order: ResolverTypeWrapper<OrderWithRelations>;
  OrderLine: ResolverTypeWrapper<OrderLineWithSubtotal>;
  OrderStatus: ResolverTypeWrapper<'PENDING' | 'SHIPPED' | 'DELIVERED'>;
  OrdersPage: ResolverTypeWrapper<Partial<Omit<OrdersPage, 'items'> & { items: Array<ResolversTypes['Order']> }>>;
  PageInfo: ResolverTypeWrapper<Partial<PageInfo>>;
  Product: ResolverTypeWrapper<ProductRow>;
  ProductConnection: ResolverTypeWrapper<Partial<Omit<ProductConnection, 'edges'> & { edges: Array<ResolversTypes['ProductEdge']> }>>;
  ProductEdge: ResolverTypeWrapper<Partial<Omit<ProductEdge, 'node'> & { node: ResolversTypes['Product'] }>>;
  ProductFilterInput: ResolverTypeWrapper<Partial<ProductFilterInput>>;
  ProductOrderByInput: ResolverTypeWrapper<Partial<ProductOrderByInput>>;
  ProductOrderField: ResolverTypeWrapper<'NAME' | 'PRICE'>;
  Profile: ResolverTypeWrapper<Partial<Profile>>;
  ProfilePatchInput: ResolverTypeWrapper<Partial<ProfilePatchInput>>;
  Query: ResolverTypeWrapper<{}>;
  SortDirection: ResolverTypeWrapper<'ASC' | 'DESC'>;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateOrderStatusInput: ResolverTypeWrapper<Partial<UpdateOrderStatusInput>>;
  UpdateOrderStatusPayload: ResolverTypeWrapper<Partial<Omit<UpdateOrderStatusPayload, 'order'> & { order: ResolversTypes['Order'] }>>;
  UpdateProductInput: ResolverTypeWrapper<Partial<UpdateProductInput>>;
  UpdateProductPatch: ResolverTypeWrapper<Partial<UpdateProductPatch>>;
  UpdateProductPayload: ResolverTypeWrapper<Partial<Omit<UpdateProductPayload, 'product'> & { product: ResolversTypes['Product'] }>>;
  UpdateUserDetailsInput: ResolverTypeWrapper<Partial<UpdateUserDetailsInput>>;
  UpdateUserDetailsPayload: ResolverTypeWrapper<Partial<Omit<UpdateUserDetailsPayload, 'user'> & { user: ResolversTypes['User'] }>>;
  User: ResolverTypeWrapper<UserWithRelations>;
  UserPatchInput: ResolverTypeWrapper<Partial<UserPatchInput>>;
  Vendor: ResolverTypeWrapper<VendorRow>;
  VendorsPage: ResolverTypeWrapper<Partial<Omit<VendorsPage, 'items'> & { items: Array<ResolversTypes['Vendor']> }>>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Partial<Address>;
  String: Partial<Scalars['String']['output']>;
  AddressInput: Partial<AddressInput>;
  Announcement: AnnouncementRow;
  ID: Partial<Scalars['ID']['output']>;
  AnnouncementConnection: Partial<Omit<AnnouncementConnection, 'edges'> & { edges: Array<ResolversParentTypes['AnnouncementEdge']> }>;
  Int: Partial<Scalars['Int']['output']>;
  AnnouncementEdge: Partial<Omit<AnnouncementEdge, 'node'> & { node: ResolversParentTypes['Announcement'] }>;
  CreateProductInput: Partial<CreateProductInput>;
  CreateProductPayload: Partial<Omit<CreateProductPayload, 'product'> & { product: ResolversParentTypes['Product'] }>;
  DeleteProductInput: Partial<DeleteProductInput>;
  DeleteProductPayload: Partial<Omit<DeleteProductPayload, 'product'> & { product?: Maybe<ResolversParentTypes['Product']> }>;
  Mutation: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  OffsetPageInfo: Partial<OffsetPageInfo>;
  Boolean: Partial<Scalars['Boolean']['output']>;
  Order: OrderWithRelations;
  OrderLine: OrderLineWithSubtotal;
  OrdersPage: Partial<Omit<OrdersPage, 'items'> & { items: Array<ResolversParentTypes['Order']> }>;
  PageInfo: Partial<PageInfo>;
  Product: ProductRow;
  ProductConnection: Partial<Omit<ProductConnection, 'edges'> & { edges: Array<ResolversParentTypes['ProductEdge']> }>;
  ProductEdge: Partial<Omit<ProductEdge, 'node'> & { node: ResolversParentTypes['Product'] }>;
  ProductFilterInput: Partial<ProductFilterInput>;
  ProductOrderByInput: Partial<ProductOrderByInput>;
  Profile: Partial<Profile>;
  ProfilePatchInput: Partial<ProfilePatchInput>;
  Query: {};
  Subscription: {};
  UpdateOrderStatusInput: Partial<UpdateOrderStatusInput>;
  UpdateOrderStatusPayload: Partial<Omit<UpdateOrderStatusPayload, 'order'> & { order: ResolversParentTypes['Order'] }>;
  UpdateProductInput: Partial<UpdateProductInput>;
  UpdateProductPatch: Partial<UpdateProductPatch>;
  UpdateProductPayload: Partial<Omit<UpdateProductPayload, 'product'> & { product: ResolversParentTypes['Product'] }>;
  UpdateUserDetailsInput: Partial<UpdateUserDetailsInput>;
  UpdateUserDetailsPayload: Partial<Omit<UpdateUserDetailsPayload, 'user'> & { user: ResolversParentTypes['User'] }>;
  User: UserWithRelations;
  UserPatchInput: Partial<UserPatchInput>;
  Vendor: VendorRow;
  VendorsPage: Partial<Omit<VendorsPage, 'items'> & { items: Array<ResolversParentTypes['Vendor']> }>;
};

export type AddressResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AnnouncementResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Announcement'] = ResolversParentTypes['Announcement']> = {
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  publishedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AnnouncementConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AnnouncementConnection'] = ResolversParentTypes['AnnouncementConnection']> = {
  edges?: Resolver<Array<ResolversTypes['AnnouncementEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AnnouncementEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AnnouncementEdge'] = ResolversParentTypes['AnnouncementEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Announcement'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CreateProductPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CreateProductPayload'] = ResolversParentTypes['CreateProductPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteProductPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['DeleteProductPayload'] = ResolversParentTypes['DeleteProductPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deletedProductId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createProduct?: Resolver<ResolversTypes['CreateProductPayload'], ParentType, ContextType, RequireFields<MutationcreateProductArgs, 'input'>>;
  deleteProduct?: Resolver<ResolversTypes['DeleteProductPayload'], ParentType, ContextType, RequireFields<MutationdeleteProductArgs, 'input'>>;
  updateOrderStatus?: Resolver<ResolversTypes['UpdateOrderStatusPayload'], ParentType, ContextType, RequireFields<MutationupdateOrderStatusArgs, 'input'>>;
  updateProduct?: Resolver<ResolversTypes['UpdateProductPayload'], ParentType, ContextType, RequireFields<MutationupdateProductArgs, 'input'>>;
  updateUserDetails?: Resolver<ResolversTypes['UpdateUserDetailsPayload'], ParentType, ContextType, RequireFields<MutationupdateUserDetailsArgs, 'input'>>;
};

export type NodeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = {
  __resolveType?: TypeResolveFn<'Announcement' | 'Product', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type OffsetPageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OffsetPageInfo'] = ResolversParentTypes['OffsetPageInfo']> = {
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  limit?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  offset?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['OrderLine']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderLineResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrderLine'] = ResolversParentTypes['OrderLine']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderStatusResolvers = EnumResolverSignature<{ DELIVERED?: any, PENDING?: any, SHIPPED?: any }, ResolversTypes['OrderStatus']>;

export type OrdersPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['OrdersPage'] = ResolversParentTypes['OrdersPage']> = {
  items?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['OffsetPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = {
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductConnectionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProductConnection'] = ResolversParentTypes['ProductConnection']> = {
  edges?: Resolver<Array<ResolversTypes['ProductEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductEdgeResolvers<ContextType = Context, ParentType extends ResolversParentTypes['ProductEdge'] = ResolversParentTypes['ProductEdge']> = {
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOrderFieldResolvers = EnumResolverSignature<{ NAME?: any, PRICE?: any }, ResolversTypes['ProductOrderField']>;

export type ProfileResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Profile'] = ResolversParentTypes['Profile']> = {
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tel?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  announcements?: Resolver<ResolversTypes['AnnouncementConnection'], ParentType, ContextType, RequireFields<QueryannouncementsArgs, 'first'>>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QuerynodeArgs, 'id'>>;
  orders?: Resolver<ResolversTypes['OrdersPage'], ParentType, ContextType, RequireFields<QueryordersArgs, 'limit' | 'offset'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryproductArgs, 'id'>>;
  products?: Resolver<ResolversTypes['ProductConnection'], ParentType, ContextType, RequireFields<QueryproductsArgs, 'first'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryusersArgs, 'ids'>>;
  vendor?: Resolver<Maybe<ResolversTypes['Vendor']>, ParentType, ContextType, RequireFields<QueryvendorArgs, 'id'>>;
  vendors?: Resolver<ResolversTypes['VendorsPage'], ParentType, ContextType, RequireFields<QueryvendorsArgs, 'limit' | 'offset'>>;
};

export type SortDirectionResolvers = EnumResolverSignature<{ ASC?: any, DESC?: any }, ResolversTypes['SortDirection']>;

export type SubscriptionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  orderStatusChanged?: SubscriptionResolver<ResolversTypes['Order'], "orderStatusChanged", ParentType, ContextType, RequireFields<SubscriptionorderStatusChangedArgs, 'orderId'>>;
  productUpdated?: SubscriptionResolver<ResolversTypes['Product'], "productUpdated", ParentType, ContextType, RequireFields<SubscriptionproductUpdatedArgs, 'productId'>>;
};

export type UpdateOrderStatusPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateOrderStatusPayload'] = ResolversParentTypes['UpdateOrderStatusPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  order?: Resolver<ResolversTypes['Order'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateProductPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateProductPayload'] = ResolversParentTypes['UpdateProductPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UpdateUserDetailsPayloadResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UpdateUserDetailsPayload'] = ResolversParentTypes['UpdateUserDetailsPayload']> = {
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  addresses?: Resolver<Array<ResolversTypes['Address']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profile?: Resolver<Maybe<ResolversTypes['Profile']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VendorResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Vendor'] = ResolversParentTypes['Vendor']> = {
  category?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  contactEmail?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  location?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type VendorsPageResolvers<ContextType = Context, ParentType extends ResolversParentTypes['VendorsPage'] = ResolversParentTypes['VendorsPage']> = {
  items?: Resolver<Array<ResolversTypes['Vendor']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['OffsetPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  Address?: AddressResolvers<ContextType>;
  Announcement?: AnnouncementResolvers<ContextType>;
  AnnouncementConnection?: AnnouncementConnectionResolvers<ContextType>;
  AnnouncementEdge?: AnnouncementEdgeResolvers<ContextType>;
  CreateProductPayload?: CreateProductPayloadResolvers<ContextType>;
  DeleteProductPayload?: DeleteProductPayloadResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  OffsetPageInfo?: OffsetPageInfoResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderLine?: OrderLineResolvers<ContextType>;
  OrderStatus?: OrderStatusResolvers;
  OrdersPage?: OrdersPageResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductConnection?: ProductConnectionResolvers<ContextType>;
  ProductEdge?: ProductEdgeResolvers<ContextType>;
  ProductOrderField?: ProductOrderFieldResolvers;
  Profile?: ProfileResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SortDirection?: SortDirectionResolvers;
  Subscription?: SubscriptionResolvers<ContextType>;
  UpdateOrderStatusPayload?: UpdateOrderStatusPayloadResolvers<ContextType>;
  UpdateProductPayload?: UpdateProductPayloadResolvers<ContextType>;
  UpdateUserDetailsPayload?: UpdateUserDetailsPayloadResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Vendor?: VendorResolvers<ContextType>;
  VendorsPage?: VendorsPageResolvers<ContextType>;
};

