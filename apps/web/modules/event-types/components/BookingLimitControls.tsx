"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { DropdownMenuItem } from "@calcom/ui/components/dropdown";

type BookingLimitMenuItemProps = {
  limit: number | null | undefined;
  onLimitChange: (limit: number | null) => void;
  disabled?: boolean;
};

export function BookingLimitMenuItem({ limit, onLimitChange, disabled }: BookingLimitMenuItemProps) {
  const { t } = useLocale();
  const currentLimit = limit ?? null;

  const increment = () => {
    onLimitChange(currentLimit === null ? 1 : currentLimit + 1);
  };

  const decrement = () => {
    if (currentLimit === null) return;
    onLimitChange(currentLimit <= 1 ? null : currentLimit - 1);
  };

  return (
    <DropdownMenuItem className="outline-none" onSelect={(e) => e.preventDefault()}>
      <div className="flex w-full flex-col gap-1 px-1 py-0.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">{t("booking_limit")}</span>
          <div className="flex items-center gap-0.5">
            <Button
              type="button"
              variant="icon"
              color="secondary"
              StartIcon="chevron-down"
              disabled={disabled || currentLimit === null}
              onClick={decrement}
              className="h-7 w-7"
              data-testid="booking-limit-decrement"
            />
            <span className="min-w-[2ch] text-center text-sm" data-testid="booking-limit-value">
              {currentLimit ?? "—"}
            </span>
            <Button
              type="button"
              variant="icon"
              color="secondary"
              StartIcon="chevron-up"
              disabled={disabled}
              onClick={increment}
              className="h-7 w-7"
              data-testid="booking-limit-increment"
            />
          </div>
        </div>
        <p className="text-subtle text-xs leading-snug">{t("booking_limit_auto_hide_helper")}</p>
      </div>
    </DropdownMenuItem>
  );
}

type BookingLimitBadgeProps = {
  limit: number | null | undefined;
  confirmedCount: number;
};

export function BookingLimitBadge({ limit, confirmedCount }: BookingLimitBadgeProps) {
  const { t } = useLocale();

  if (!limit) return null;

  const remaining = limit - confirmedCount;

  if (remaining <= 0) {
    return (
      <Badge variant="gray" className="text-xs" data-testid="booking-limit-reached-badge">
        {t("booking_limit_reached_badge")}
      </Badge>
    );
  }

  return (
    <Badge variant="gray" className="text-xs" data-testid="booking-limit-remaining-badge">
      {t("bookings_remaining_badge", { count: remaining })}
    </Badge>
  );
}
