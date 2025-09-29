/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { announcements as Query_announcements } from './announcement/resolvers/Query/announcements';
import    { node as Query_node } from './base/resolvers/resolvers/Query/node';
import    { orders as Query_orders } from './order/resolvers/Query/orders';
import    { product as Query_product } from './product/resolvers/Query/product';
import    { products as Query_products } from './product/resolvers/Query/products';
import    { user as Query_user } from './user/resolvers/Query/user';
import    { users as Query_users } from './user/resolvers/Query/users';
import    { vendor as Query_vendor } from './vendor/resolvers/Query/vendor';
import    { vendors as Query_vendors } from './vendor/resolvers/Query/vendors';
import    { createProduct as Mutation_createProduct } from './product/resolvers/Mutation/createProduct';
import    { deleteProduct as Mutation_deleteProduct } from './product/resolvers/Mutation/deleteProduct';
import    { updateOrderStatus as Mutation_updateOrderStatus } from './order/resolvers/Mutation/updateOrderStatus';
import    { updateProduct as Mutation_updateProduct } from './product/resolvers/Mutation/updateProduct';
import    { updateUserDetails as Mutation_updateUserDetails } from './user/resolvers/Mutation/updateUserDetails';
import    { orderStatusChanged as Subscription_orderStatusChanged } from './order/resolvers/Subscription/orderStatusChanged';
import    { productUpdated as Subscription_productUpdated } from './product/resolvers/Subscription/productUpdated';
import    { Address } from './user/resolvers/Address';
import    { Announcement } from './announcement/resolvers/Announcement';
import    { AnnouncementConnection } from './announcement/resolvers/AnnouncementConnection';
import    { AnnouncementEdge } from './announcement/resolvers/AnnouncementEdge';
import    { CreateProductPayload } from './product/resolvers/CreateProductPayload';
import    { DeleteProductPayload } from './product/resolvers/DeleteProductPayload';
import    { OffsetPageInfo } from './base/resolvers/resolvers/OffsetPageInfo';
import    { Order } from './order/resolvers/Order';
import    { OrderLine } from './order/resolvers/OrderLine';
import    { OrdersPage } from './order/resolvers/OrdersPage';
import    { PageInfo } from './base/resolvers/resolvers/PageInfo';
import    { Product } from './product/resolvers/Product';
import    { ProductConnection } from './product/resolvers/ProductConnection';
import    { ProductEdge } from './product/resolvers/ProductEdge';
import    { Profile } from './user/resolvers/Profile';
import    { UpdateOrderStatusPayload } from './order/resolvers/UpdateOrderStatusPayload';
import    { UpdateProductPayload } from './product/resolvers/UpdateProductPayload';
import    { UpdateUserDetailsPayload } from './user/resolvers/UpdateUserDetailsPayload';
import    { User } from './user/resolvers/User';
import    { Vendor } from './vendor/resolvers/Vendor';
import    { VendorsPage } from './vendor/resolvers/VendorsPage';
    export const resolvers: Resolvers = {
      Query: { announcements: Query_announcements,node: Query_node,orders: Query_orders,product: Query_product,products: Query_products,user: Query_user,users: Query_users,vendor: Query_vendor,vendors: Query_vendors },
      Mutation: { createProduct: Mutation_createProduct,deleteProduct: Mutation_deleteProduct,updateOrderStatus: Mutation_updateOrderStatus,updateProduct: Mutation_updateProduct,updateUserDetails: Mutation_updateUserDetails },
      Subscription: { orderStatusChanged: Subscription_orderStatusChanged,productUpdated: Subscription_productUpdated },
      Address: Address,
Announcement: Announcement,
AnnouncementConnection: AnnouncementConnection,
AnnouncementEdge: AnnouncementEdge,
CreateProductPayload: CreateProductPayload,
DeleteProductPayload: DeleteProductPayload,
OffsetPageInfo: OffsetPageInfo,
Order: Order,
OrderLine: OrderLine,
OrdersPage: OrdersPage,
PageInfo: PageInfo,
Product: Product,
ProductConnection: ProductConnection,
ProductEdge: ProductEdge,
Profile: Profile,
UpdateOrderStatusPayload: UpdateOrderStatusPayload,
UpdateProductPayload: UpdateProductPayload,
UpdateUserDetailsPayload: UpdateUserDetailsPayload,
User: User,
Vendor: Vendor,
VendorsPage: VendorsPage
    }