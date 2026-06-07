import prisma from "@calcom/prisma";
import { BookingStatus } from "@calcom/prisma/enums";

export async function getConfirmedBookingCountsByEventTypeIds(
  eventTypeIds: number[]
): Promise<Map<number, number>> {
  if (eventTypeIds.length === 0) {
    return new Map();
  }

  const counts = await prisma.booking.groupBy({
    by: ["eventTypeId"],
    where: {
      eventTypeId: { in: eventTypeIds },
      status: BookingStatus.ACCEPTED,
    },
    _count: { _all: true },
  });

  return new Map(
    counts
      .filter((entry): entry is typeof entry & { eventTypeId: number } => entry.eventTypeId !== null)
      .map((entry) => [entry.eventTypeId, entry._count._all])
  );
}
