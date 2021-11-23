export interface DateProvider {
	getDateNMinutesAgo(isoDate: string, minutesToSubtract: number): string;
	parseIsoDate(isoDate: string): string;
}
