import { readDaysRecords, readLastSevenDaysRecords, readLastThirtyDaysRecords, readLatestRecord } from "../dao/sqlite.dao";
import { DbResults } from "../types/dbresults";
import { calculateHourlyAverage } from "../utilities/common";

export async function getCurrentData(): Promise<DbResults.sensorInputRow[]> {
    const data = await readLatestRecord()
    return data;
}

export async function getDailyAverageByHour(): Promise<DbResults.sensorInputRow[]> {
    const data = await readDaysRecords();
    const hourlyAverages: DbResults.sensorInputRow[] = calculateHourlyAverage(data, 'hour');
    return hourlyAverages;
}

export async function getWeeksHourlyAverage(): Promise<DbResults.sensorInputRow[]> {
    const data = await readLastSevenDaysRecords();
    const hourlyAverages: DbResults.sensorInputRow[] = calculateHourlyAverage(data, 'hour');
    return hourlyAverages;
}

export async function getMonthsDailyAverage(): Promise<DbResults.sensorInputRow[]> {
    const data = await readLastThirtyDaysRecords();
    const hourlyAverages: DbResults.sensorInputRow[] = calculateHourlyAverage(data, 'day');
    return hourlyAverages;
}
