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
        total.plus(num);
    };
    return total.div(division).toNumber();
}

export function calculateHourlyAverage(data: DbResults.sensorInputRow[], dayOrHour: 'day' | 'hour'): DbResults.sensorInputRow[] {
    const hourlyAverages: DbResults.sensorInputRow[] = [];
    let previousHour: number = dayOrHour === 'hour' ? data[0].insert_datetime.getHours() : data[0].insert_datetime.getDate();
    let readingsForHour: DbResults.sensorInputRow[] = [];
    for (const read of data) {
        if (
            (dayOrHour === 'hour' && read.insert_datetime.getHours() !== previousHour && readingsForHour.length > 0) ||
            (dayOrHour === 'day' && read.insert_datetime.getDate() !== previousHour && readingsForHour.length > 0)
        ) {
            const averageTemp = calculateAverage(readingsForHour.map((x) => x.temperature));
            const averageDamp = calculateAverage(readingsForHour.map((x) => x.damp));
            hourlyAverages.push({
                temperature: averageTemp,
                damp: averageDamp,
                insert_datetime: readingsForHour[0].insert_datetime
            });
            readingsForHour = [read];
        }
        readingsForHour.push(read);
    }
    return hourlyAverages;
}