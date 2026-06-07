"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { DropdownMenuItem } from "@calcom/ui/components/dropdown";

type BookingLimitControlsProps = {
  maxBookingsBeforeAutoHide: number | null | undefined;
  confirmedBookingCount: number;
  disabled?: boolean;
  onLimitChange: (newLimit: number | null) => void;
};

export function BookingLimitMenuItem({
  maxBookingsBeforeAutoHide,
  disabled,
  onLimitChange,
}: BookingLimitControlsProps): JSX.Element {
  const { t } = useLocale();
  const currentLimit = maxBookingsBeforeAutoHide ?? null;
  const displayValue = currentLimit ?? "—";

  const increment = (): void => {
    let newLimit: number;
    if (currentLimit === null) {
      newLimit = 1;
    } else {
      newLimit = currentLimit + 1;
    }
    onLimitChange(newLimit);
  };

  const decrement = (): void => {
    if (currentLimit === null) {
      return;
    }
    let newLimit: number | null;
    if (currentLimit <= 1) {
      newLimit = null;
    } else {
      newLimit = currentLimit - 1;
    }
    onLimitChange(newLimit);
  };

  return (
    <DropdownMenuItem
      className="outline-none"
      onSelect={(event) => {
        event.preventDefault();
      }}>
      <div className="w-full px-2 py-2" data-testid="booking-limit-menu-item">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm">{t("booking_limit")}</span>
          <div className="flex items-center gap-1">
            <span className="min-w-[1.25rem] text-center text-sm tabular-nums">{displayValue}</span>
            <div className="flex flex-col">
              <Button
                type="button"
                variant="icon"
                color="minimal"
                size="sm"
                className="h-5 w-5"
                disabled={disabled}
                StartIcon="chevron-up"
                aria-label={t("increase_booking_limit")}
                onClick={(event) => {
                  event.stopPropagation();
                  increment();
                }}
              />
              <Button
                type="button"
                variant="icon"
                color="minimal"
                size="sm"
                className="h-5 w-5"
                disabled={disabled}
                StartIcon="chevron-down"
                aria-label={t("decrease_booking_limit")}
                onClick={(event) => {
                  event.stopPropagation();
                  decrement();
                }}
              />
            </div>
          </div>
        </div>
        <p className="mt-1 text-subtle text-xs leading-snug">{t("booking_limit_auto_hide_helper")}</p>
      </div>
    </DropdownMenuItem>
  );
}

export function BookingLimitBadge({
  maxBookingsBeforeAutoHide,
  confirmedBookingCount,
}: Pick<BookingLimitControlsProps, "maxBookingsBeforeAutoHide" | "confirmedBookingCount">): JSX.Element | null {
  const { t } = useLocale();

  if (maxBookingsBeforeAutoHide == null || maxBookingsBeforeAutoHide <= 0) {
    return null;
  }

  const remaining = maxBookingsBeforeAutoHide - confirmedBookingCount;

  if (remaining <= 0) {
    return (
      <Badge variant="orange" data-testid="booking-limit-reached-badge">
        {t("booking_limit_reached_short")}
      </Badge>
    );
  }

  return (
    <Badge variant="gray" data-testid="booking-limit-remaining-badge">
      {t("booking_limit_remaining", { count: remaining })}
    </Badge>
  );
}
