if (apds9960.start(2)) {
    basic.showIcon(IconNames.Heart)
} else {
    basic.showIcon(IconNames.Confused)
}
serial.redirectToUSB()
basic.forever(function() {
    let als =apds9960.getAls();
    serial.writeNumbers(als);
    basic.pause(1000)
})