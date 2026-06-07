"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { Icon } from "@calcom/ui/components/icon";

type BookingLimitMenuControlsProps = {
  currentLimit: number | null | undefined;
  onSave: (limit: number | null) => void;
  isSaving?: boolean;
};

export function BookingLimitMenuControls({
  currentLimit,
  onSave,
  isSaving = false,
}: BookingLimitMenuControlsProps) {
  const { t } = useLocale();
  const limit = currentLimit ?? null;

  const increment = () => {
    onSave((limit ?? 0) + 1);
  };

  const decrement = () => {
    if (limit == null || limit <= 1) {
      onSave(null);
      return;
    }

    onSave(limit - 1);
  };

  return (
    <div className="w-full px-1 py-1">
      <div className="mb-2 flex items-center gap-2">
        <Icon name="calendar" className="text-subtle h-4 w-4" />
        <span className="text-sm font-medium">{t("booking_limit")}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-subtle text-xs">
          {limit == null ? t("booking_limit_no_limit") : t("booking_limit_hide_after")}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="icon"
            color="secondary"
            className="h-7 w-7"
            disabled={isSaving || limit == null}
            aria-label={t("remove")}
            onClick={decrement}>
            <Icon name="chevron-down" className="h-4 w-4" />
          </Button>
          <span
            className="min-w-8 text-center text-sm font-semibold tabular-nums"
            data-testid="booking-limit-value">
            {limit ?? "—"}
          </span>
          <Button
            type="button"
            variant="icon"
            color="secondary"
            className="h-7 w-7"
            disabled={isSaving}
            aria-label={t("add")}
            onClick={increment}>
            <Icon name="chevron-up" className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="text-subtle mt-2 text-xs leading-snug">{t("booking_limit_helper")}</p>
    </div>
  );
}

export function getBookingLimitBadgeText({
  limit,
  confirmedCount,
  t,
}: {
  limit: number | null | undefined;
  confirmedCount: number;
  t: (key: string, options?: Record<string, unknown>) => string;
}) {
  if (limit == null) {
    return null;
  }

  const remaining = limit - confirmedCount;

  if (remaining <= 0) {
    return t("booking_limit_badge_reached");
  }

  return t("booking_limit_badge_remaining", { count: remaining });
}

export function BookingLimitBadge({
  limit,
  confirmedCount,
}: {
  limit: number | null | undefined;
  confirmedCount: number;
}) {
  const { t } = useLocale();
  const badgeText = getBookingLimitBadgeText({ limit, confirmedCount, t });

  if (!badgeText) {
    return null;
  }

  const remaining = limit != null ? limit - confirmedCount : 0;

  return (
    <Badge variant={remaining <= 0 ? "orange" : "gray"} className="text-xs" data-testid="booking-limit-badge">
      {badgeText}
    </Badge>
  );
}
