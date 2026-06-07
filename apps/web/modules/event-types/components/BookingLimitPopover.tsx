"use client";

import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { Label, TextField } from "@calcom/ui/components/form";
import { Popover, PopoverContent } from "@calcom/ui/components/popover";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as RadioGroup from "@radix-ui/react-radio-group";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

type BookingLimitMode = "none" | "limited";

type BookingLimitPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLimit: number | null | undefined;
  onSave: (limit: number | null) => void;
  isSaving?: boolean;
  anchor: ReactNode;
};

export function BookingLimitPopover({
  open,
  onOpenChange,
  currentLimit,
  onSave,
  isSaving = false,
  anchor,
}: BookingLimitPopoverProps) {
  const { t } = useLocale();
  const [mode, setMode] = useState<BookingLimitMode>(currentLimit ? "limited" : "none");
  const [limitValue, setLimitValue] = useState(currentLimit?.toString() ?? "1");
  const ignoreCloseRef = useRef(false);

  useEffect(() => {
    if (open) {
      ignoreCloseRef.current = true;
      const timeoutId = window.setTimeout(() => {
        ignoreCloseRef.current = false;
      }, 100);

      return () => window.clearTimeout(timeoutId);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      setMode(currentLimit ? "limited" : "none");
      setLimitValue(currentLimit?.toString() ?? "1");
    }
  }, [open, currentLimit]);

  const getLimitToSave = (): number | null => {
    if (mode === "none") {
      return null;
    }

    const parsed = Number.parseInt(limitValue, 10);
    if (Number.isNaN(parsed) || parsed < 1) {
      return null;
    }

    return parsed;
  };

  const handleSave = () => {
    onSave(getLimitToSave());
    onOpenChange(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && ignoreCloseRef.current) {
      return;
    }

    if (!nextOpen && open) {
      const nextLimit = getLimitToSave();
      const hasChanged = (currentLimit ?? null) !== nextLimit;

      if (hasChanged) {
        onSave(nextLimit);
      }
    }

    onOpenChange(nextOpen);
  };

  return (
    <Popover modal open={open} onOpenChange={handleOpenChange}>
      <PopoverPrimitive.Anchor asChild>
        <span className="inline-flex">{anchor}</span>
      </PopoverPrimitive.Anchor>
      <PopoverContent className="z-[60] w-80 space-y-4" align="end" side="left">
        <RadioGroup.Root
          value={mode}
          onValueChange={(value) => setMode(value as BookingLimitMode)}
          className="space-y-3">
          <div className="flex items-center gap-2">
            <RadioGroup.Item
              value="none"
              id="booking-limit-none"
              className="border-default bg-default h-4 w-4 rounded-full border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=checked]:border-emphasis"
            />
            <Label htmlFor="booking-limit-none" className="cursor-pointer font-normal">
              {t("booking_limit_no_limit")}
            </Label>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <RadioGroup.Item
                value="limited"
                id="booking-limit-limited"
                className="border-default bg-default h-4 w-4 rounded-full border shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=checked]:border-emphasis"
              />
              <Label htmlFor="booking-limit-limited" className="cursor-pointer font-normal">
                {t("booking_limit_hide_after")}
              </Label>
            </div>
            {mode === "limited" && (
              <div className="ml-6 flex items-center gap-2">
                <TextField
                  type="number"
                  min={1}
                  value={limitValue}
                  onChange={(event) => setLimitValue(event.target.value)}
                  containerClassName="w-20"
                  className="px-2"
                />
                <span className="text-subtle text-sm">{t("booking_limit_bookings")}</span>
              </div>
            )}
          </div>
        </RadioGroup.Root>
        <p className="text-subtle text-sm">{t("booking_limit_helper")}</p>
        <div className="flex justify-end">
          <Button color="primary" loading={isSaving} onClick={handleSave}>
            {t("save")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
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
