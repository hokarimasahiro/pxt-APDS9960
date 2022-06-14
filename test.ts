apds9960.start(2);
serial.redirectToUSB()
basic.forever(function() {
    let als =apds9960.getAls();
    serial.writeNumbers(als);
})