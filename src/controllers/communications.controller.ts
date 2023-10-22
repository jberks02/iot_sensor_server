import spi from 'pi-spi';
import { sleep } from "../utilities/common";
let transferOccuring: boolean = false;

let conn: spi.SPI;

function byteTransfer(tx: Buffer): Promise<Buffer> {
    return new Promise((res, rej) => {
        conn.transfer(tx, (err, data) => {
            if (err) rej(err);
            res(data);
        })
    })
}

export async function sendByteString(message: string): Promise<string> {
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
