import { isToday, isYesterday, isThisWeek, format, isThisYear } from "date-fns";

export default function formatDate(date: Date | undefined) {
  if (!date) {
    return "undefined";
  }

  if (isToday(date)) {
    return `${format(date, "h:mm a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "h:mm a")}`;
  } else if (isThisWeek(date)) {
    return `Last ${format(date, "eee 'at' h:mm a")}`;
  } else if (isThisYear(date)) {
    return `${format(date, "eee, do MMMM")}`;
  } else {
    return `${format(date, "eee, do MMM, yyyy")}`;
  }
}
