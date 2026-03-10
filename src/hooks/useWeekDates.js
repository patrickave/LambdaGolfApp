import { useMemo } from "react";
import { nextSaturday, nextSunday, isSaturday, isSunday, format, startOfDay } from "date-fns";

// Returns the upcoming Saturday and Sunday dates for the current week's planning
export function useWeekDates() {
  return useMemo(() => {
    const today = startOfDay(new Date());
    let saturday, sunday;

    if (isSaturday(today)) {
      saturday = today;
      sunday = new Date(today);
      sunday.setDate(sunday.getDate() + 1);
    } else if (isSunday(today)) {
      saturday = nextSaturday(today);
      sunday = new Date(saturday);
      sunday.setDate(sunday.getDate() + 1);
    } else {
      saturday = nextSaturday(today);
      sunday = nextSunday(today);
    }

    return {
      saturday,
      sunday,
      saturdayStr: format(saturday, "EEEE, MMM d"),
      sundayStr: format(sunday, "EEEE, MMM d"),
      weekKey: format(saturday, "yyyy-MM-dd"),
    };
  }, []);
}
