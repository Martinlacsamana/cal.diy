import prisma from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

export async function getConfirmedBookingCountsByEventTypeIds(
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
      id: true,
    },
  });

  const result = Object.fromEntries(eventTypeIds.map((id) => [id, 0])) as Record<number, number>;

  for (const count of counts) {
    if (count.eventTypeId !== null) {
      result[count.eventTypeId] = count._count.id;
    }
  }

  return result;
}
