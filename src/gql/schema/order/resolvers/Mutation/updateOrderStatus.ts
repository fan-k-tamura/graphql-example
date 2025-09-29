import { GraphQLError } from 'graphql';
import type { MutationResolvers } from '../../../types.generated';
import { updateOrderStatus as updateOrderStatusRecord } from '../../../../../data/db/orders';
import { publishOrderStatusChanged } from '../../../../subscriptions/event-bus';

export const updateOrderStatus: NonNullable<
  MutationResolvers['updateOrderStatus']
> = async (_parent, args) => {
  const { clientMutationId, id, status } = args.input;
  const updated = await updateOrderStatusRecord(id, status);

  if (!updated) {
    throw new GraphQLError(`Order ${id} not found.`);
  }

  publishOrderStatusChanged(updated);

  return {
    clientMutationId: clientMutationId ?? null,
    order: updated,
  };
};

export default updateOrderStatus;
