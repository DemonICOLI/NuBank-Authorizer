import { DateProvider } from "../DateProvider";
import { injectable } from "inversify";
import "reflect-metadata";
import { DateTime } from "luxon";

@injectable()
export class LuxonDateProvider implements DateProvider {
	getDateNMinutesAgo(isoDate: string, minutesToSubtract: number): string {
		return DateTime.fromISO(isoDate).minus({ minutes: minutesToSubtract }).toISO();
	}

	parseIsoDate(isoDate: string): string {
		return DateTime.fromISO(isoDate).toISO();
	}
}
