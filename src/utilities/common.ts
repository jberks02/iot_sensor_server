import safeFloat from 'safe-float-math'

export function getDateFromNDaysInPast(days: number) {
    let date = new Date();
    date.setDate(date.getDate() - days);
    return date;
};

export function calculateAverage(list: number[]) {
    const division = list.length;
    //TODO: finish average calculations
}