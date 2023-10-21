import { readDaysRecords, readLatestRecord } from "../dao/sqlite.dao";
import { DbResults } from "../types/dbresults";

export async function getCurrentData() {
    const data = await readLatestRecord()
    return data[0];
}

export async function getDailyAverageByHour() {
    const data = await readDaysRecords();
    const hourlyAverages: DbResults.sensorInputRow[] = [];
    let previousHour: number = data[0].insert_datetime.getHours();
    for (const read of data) {
        let readingsForHour: DbResults.sensorInputRow[] = [];
        if (read.insert_datetime.getHours() !== previousHour) {
            //TODO:finish up average, push, and clear logic;
        }
        readingsForHour.push(read);
    }
    return hourlyAverages;
}