export declare namespace DbResults {
    interface sensorInputRow {
        insert_datetime: Date,
        temperature: number,
        damp: number
    }
    interface adc {
        temperature: number;
        input_00: number;
        input_01: number;
        input_02: number;
        input_03: number;
    }
    type picoResponse = [adc];
}