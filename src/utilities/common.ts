import { SafeFloat } from 'safe-float-math'
import { DbResults } from '../types/dbresults';

export function getDateFromNDaysInPast(days: number) {
    let date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

export function calculateAverage(list: number[]): number {
    const division = new SafeFloat(list.length);
    let total = new SafeFloat(0);
    for (const num of list) {
        total = total.plus(num);
    };
    return total.div(division).toNumber();
}

export function calculateHourlyAverage(data: DbResults.sensorInputRow[], dayOrHour: 'day' | 'hour'): DbResults.sensorInputRow[] {
    const hourlyAverages: DbResults.sensorInputRow[] = [];
    let previousHour: number = dayOrHour === 'hour' ? data[0].insert_datetime.getUTCHours() : data[0].insert_datetime.getUTCDate();
    let readingsForHour: DbResults.sensorInputRow[] = [];
    for (const read of data) {
        if (
            (dayOrHour === 'hour' && read.insert_datetime.getUTCHours() !== previousHour && readingsForHour.length > 0) ||
            (dayOrHour === 'day' && read.insert_datetime.getUTCDate() !== previousHour && readingsForHour.length > 0)
        ) {
            const averageTemp = calculateAverage(readingsForHour.map((x) => x.temperature));
            const averageDamp = calculateAverage(readingsForHour.map((x) => x.damp));
            hourlyAverages.push({
                temperature: averageTemp,
                damp: averageDamp,
                insert_datetime: readingsForHour[0].insert_datetime
            });
            previousHour = dayOrHour === 'hour' ? read.insert_datetime.getUTCHours() : read.insert_datetime.getUTCDate()
            readingsForHour = [read];
        }
        readingsForHour.push(read);
    }
    return hourlyAverages;
}

export function sleep(ms: number): Promise<void> {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, ms);
    })
}

export function processNewData(data: DbResults.sensorInputRow[]) {
    for (let i = 0; i < data.length; i++) {
        data[i].insert_datetime = new Date(data[i].insert_datetime);
    };
};