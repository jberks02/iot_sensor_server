import spi from 'pi-spi';
import { sleep } from "../utilities/common";
import { DbResults } from '../types/dbresults';
import { writeNewSensorResults } from '../dao/sqlite.dao';
const sensorReadWait = 5;
let transferOccuring: boolean = false;

let conn: spi.SPI;

let readTimeout: NodeJS.Timeout;

export function setUpSensorRead(minutes: number) {
    readTimeout = setTimeout(() => {
        readSensorsAndWrite();
    }, 1000 * 60 * minutes);
};

export function killSensorReads() {
    clearTimeout(readTimeout);
}

function byteTransfer(tx: Buffer): Promise<Buffer> {
    return new Promise((res, rej) => {
        conn.transfer(tx, (err, data) => {
            if (err) rej(err);
            res(data);
        })
    })
}

async function sendByteString(message: string): Promise<string> {
    while (transferOccuring);
    conn = spi.initialize('/dev/spidev0.0');
    conn.clockSpeed(125000);
    transferOccuring = true;
    if (message.length > 99999) {
        transferOccuring = false;
        throw new Error('MESSAGE TOO LONG');
    }
    let sendingLength = message.length.toString();
    while (sendingLength.length < 5) sendingLength += '\x00';
    const picoMessageLength = (await byteTransfer(Buffer.from(sendingLength))).toString('utf-8');
    const transferLength = message.length > parseInt(picoMessageLength) ? message.length : parseInt(picoMessageLength);
    while (message.length < transferLength) message += '\x00';
    const newMessage = (await byteTransfer(Buffer.from(message))).toString();
    transferOccuring = false;
    conn.close((err) => {
        if (err) console.error('Could Not Close SPI instance: ', err);
    });
    await sleep(1000);
    return newMessage;
};

async function readSensorsAndWrite(): Promise<void> {
    try {
        const data = await sendByteString('');
        const parsed = JSON.parse(data) as DbResults.adc;
        await writeNewSensorResults(parsed.temperature, parsed.input_00);
        setUpSensorRead(sensorReadWait)
    } catch (err) {
        console.error('Failure to read data from sensors and then write it: ', err);
        setUpSensorRead(sensorReadWait);
    }
}