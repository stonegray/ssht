import Screen from './screen.js'

const screen = new Screen();

screen.writeLine(1, 'foo');
let count = 0;
setInterval(()=>{
    screen.writeLine(3, String(count++));
},10)



const frame = 32;
export default frame;