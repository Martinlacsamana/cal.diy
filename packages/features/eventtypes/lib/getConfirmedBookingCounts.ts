import prisma from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

export async function getConfirmedBookingCounts(
  eventTypeIds: number[]
): Promise<Record<number, number>> {
  if (eventTypeIds.length === 0) {
    return {};
  }

  const counts = await prisma.booking.groupBy({
    by: ["eventTypeId"],
    where: {
      eventTypeId: { in: eventTypeIds },
      status: BookingStatus.ACCEPTED,
    },
    _count: {
      _all: true,
    },
  });

  return counts.reduce<Record<number, number>>((acc, item) => {
    if (item.eventTypeId === null) return acc;
    acc[item.eventTypeId] = item._count._all;
    return acc;
  }, {});
}
