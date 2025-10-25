import { format, toZonedTime } from "date-fns-tz";

export const convertDateStringToTzDate = (stringDate: string, timezone: string) => {
    const dateInTargetTZ = toZonedTime(stringDate, timezone);
    return dateInTargetTZ;
}