import { ModbusReadAnswer } from './terminal.service';

export class MockFactory {
    static modbusReadAnswer(): ModbusReadAnswer {
        const dataObjectType = Math.floor(Math.random() * 5);
        const mockedAdress = Math.floor(Math.random() * 0x10000); // 16bits address
        const mockedFormat = (dataObjectType === 1 || dataObjectType === 2) ?
                            0 : Math.floor(Math.random() * 3) + 1; // 8/16/32 bits random format

        const mockedDataSize = mockedFormat ? 10 * 2 ** (mockedFormat - 1) : 10;
        const randomRange = mockedFormat ? 0x100 : 0x2;
        const mockedData = new Uint8Array(mockedDataSize);

        for (let i = 0; i < mockedData.length; i++) {
            mockedData[i] = Math.floor(Math.random() * randomRange);
        }
        return {
            firstAddress: mockedAdress,
            format: mockedFormat,
            dataArray: mockedData,
            objectType: dataObjectType
        };
    }
}