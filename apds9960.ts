/**
 * makecode APDS9960 Gesture Sensor Package.
 */

/**
 * APDS9960 block
 */
//% weight=10 color=#800080 icon="\u261d" block="apds9960"
namespace apds9960 {
    let I2C_ADDR = 0x39
    let APDS9960_ID = 0xab
    let REG_ID = 0x92

    let cMax=4600,rMax=1250,gMax=1700,bMax=2050;
    /**
     * set reg
     */
    function setReg(reg: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = dat;
        pins.i2cWriteBuffer(I2C_ADDR, buf);
    }
    /**
     * get reg
     */
    function getReg(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt8BE);
    }
    /**
     * get reg
     */
    function getRegW(reg: number): number {
        pins.i2cWriteNumber(I2C_ADDR, reg, NumberFormat.UInt8BE);
        return pins.i2cReadNumber(I2C_ADDR, NumberFormat.UInt16LE);
    }

    /**
     * start
     * @param mode number,eg:0
     */
    //% blockId="start" block="start %mode"
    //% weight=90 blockGap=8
    export function start(mode:number): boolean {
        let id = getReg(REG_ID)
        if (id != APDS9960_ID) return false;
        switch(mode){
            case 0: // GESTURE
                setReg(0x80, 0b01000101); //POWER ON<0>, GESTURE<6> ENABLE, PROXIMITY<2> ENALBE,ALS<1> DISABLE
                setReg(0x90, 0b00110000); //Gesture LED Drive Strength 300%(max)
                setReg(0xA3, 0b01100100); //Reserve0, Gain x8(11), LED Drive 100mA(00), Wait Time see under number
                //111=39.2mS 110=30.8mS 101=22.4mS 100=14.0mS 011=8.4mS 010=5.6mS 001=2.8ms 000=0mS
                setReg(0xA4, 70);        //U MINUS OFFSET
                setReg(0xA5, 0);         //D MINUS OFFSET
                setReg(0xA7, 10);        //L MINUS OFFSET
                setReg(0xA9, 34);        //R MINUS OFFSET
                setReg(0xAB, 0b00000001); //GIEN off<1>(INTERRUPT DISABLE), GMODE ON<0>
                break;
            case 1: // PROXIMITY
                setReg(0x80, 0b00000101); //POWER ON<0>, GESTURE<6> DISABLE, PROXIMITY<2> ENABLE,ALS<1> DISABLE
                setReg(0x90, 0b00110000); //Gesture LED Drive Strength 300%(max)
                setReg(0xA3, 0b01100100); //Reserve0, Gain x8(11), LED Drive 100mA(00), Wait Time see under number
                //111=39.2mS 110=30.8mS 101=22.4mS 100=14.0mS 011=8.4mS 010=5.6mS 001=2.8ms 000=0mS
                setReg(0xA4, 70);        //U MINUS OFFSET
                setReg(0xA5, 0);         //D MINUS OFFSET
                setReg(0xA7, 10);        //L MINUS OFFSET
                setReg(0xA9, 34);        //R MINUS OFFSET
                setReg(0xAB, 0b00000000); //GIEN off<1>(INTERRUPT DISABLE), GMODE OFF<0>
                break;
            case 2: // ALS(COLOR)
                setReg(0x80, 0b00000011); //POWER ON<0>, ALS<1>,WEN<3> DISABLE
                setReg(0x81,0x80);
                break;
            default:
                return false;
        }
        return true
    }
    /**
     * getAls
     */
    //% blockId="getAls" block="getAls"
    export function getAls(): number[] {
        let retAls =[0,0,0,0];
        retAls[0] = Math.constrain(getRegW(0x94) * 255 / cMax, 0, 255) << 0;
        retAls[1] = Math.constrain(getRegW(0x96) * 255 / rMax, 0, 255) << 0;
        retAls[2] = Math.constrain(getRegW(0x98) * 255 / gMax, 0, 255) << 0;
        retAls[3] = Math.constrain(getRegW(0x9a) * 255 / bMax, 0, 255) << 0;
        return retAls;
    }
    /**
     * set max value
     * @param c number,eg:4600
     * @param r number,eg:1250
     * @param g number,eg:1700
     * @param b number,eg:2050
     */
    //% blockId="set max value" block="set max value %c %r %g %b"
    export function setMaxValue(c:number,r:number,g:number,b:number): void {
        cMax = c;
        rMax = r;
        gMax = g;
        bMax = b;
    }
}
