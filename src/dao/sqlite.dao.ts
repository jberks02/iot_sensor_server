import { AsyncDatabase } from 'promised-sqlite3';
import { getDateFromNDaysInPast, processNewData } from '../utilities/common';
import { DbResults } from '../types/dbresults';
const dbPath = './sensorData';

const sensoreDataDateSelect = `
            SELECT 
            insert_datetime
            ,temperature
            ,damp
            FROM sensor_input
            WHERE insert_datetime > $midnight
        `

export async function initSqliteDb(): Promise<void> {
    const db = await AsyncDatabase.open(dbPath)
    try {
        const data = await db.all('SELECT * FROM sensor_input LIMIT 10') as DbResults.sensorInputRow[];
        processNewData(data)
        console.log(data);
    } catch (err) {
        console.log(err);
        await db.run(`CREATE TABLE sensor_input(insert_datetime DATETIME, temperature DECIMAL(8,4), damp DECIMAL(8,4), PRIMARY KEY(insert_datetime ASC))`)
    }
}

export async function writeNewSensorResults(temp: number, damp: number): Promise<void> {
    const db = await AsyncDatabase.open(dbPath);
    try {
        const now = new Date();
        const query = `INSERT INTO sensor_input (insert_datetime, temperature, damp)
                        VALUES($now, $temp, $damp)`
        await db.all(query, {
            $now: now.toISOString(),
            $temp: temp,
            $damp: damp
        })
    } catch (err) {
        console.error('Insert of new sensor data failed: ', err);
        throw new Error('DATABASE ERROR');
    }
}

export async function readLatestRecord(): Promise<DbResults.sensorInputRow[]> {
    const db = await AsyncDatabase.open(dbPath);
    try {
        const query = `
            SELECT 
            insert_datetime
            ,temperature
            ,damp
            FROM sensor_input
            WHERE insert_datetime = (SELECT MAX(insert_datetime) from sensor_input)`
        const result = await db.all(query) as DbResults.sensorInputRow[];
        processNewData(result);
        return result;
    } catch (err) {
        console.error('Reading most recent date failed: ', err);
        throw new Error('DATABASE ERROR')
    }
}

export async function readDaysRecords(): Promise<DbResults.sensorInputRow[]> {
    const db = await AsyncDatabase.open(dbPath);
    try {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const result = await db.all(sensoreDataDateSelect, {
            $midnight: now.toISOString()
        }) as DbResults.sensorInputRow[];
        processNewData(result);
        return result;
    } catch (err) {
        console.error('Read for days records failed: ', err);
        throw new Error('DATABASE ERROR');
    }
}

export async function readLastSevenDaysRecords(): Promise<DbResults.sensorInputRow[]> {
    const db = await AsyncDatabase.open(dbPath);
    try {
        const sevenDaysAgo = getDateFromNDaysInPast(7);
        const result = await db.all(sensoreDataDateSelect, {
            $midnight: sevenDaysAgo.toISOString()
        }) as DbResults.sensorInputRow[];
        processNewData(result);
        return result;
    } catch (err) {
        console.error('Failure to read Last seven days: ', err);
        throw new Error('DATABASE ERROR');
    }
}

export async function readLastThirtyDaysRecords(): Promise<DbResults.sensorInputRow[]> {
    const db = await AsyncDatabase.open(dbPath);
    try {
        const monthAgo = getDateFromNDaysInPast(30);
        const result = await db.all(sensoreDataDateSelect, {
            $midnight: monthAgo.toISOString()
        }) as DbResults.sensorInputRow[];
        processNewData(result);
        return result;
    } catch (err) {
        console.error('Failure to read Last seven days: ', err);
        throw new Error('DATABASE ERROR');
    }
}
