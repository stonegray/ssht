
import { cursor } from './terminalUtils.js';

export default class Screen {
    constructor(options){
        const defaultOptions = {
            height: 8
        };

        this.opts = {...defaultOptions, ...options};

        this.data = Array(this.opts.height).fill('empty');
        this.damage = Array(this.opts.height).fill(true);

        cursor.hide();
    }

    render(){

        for (const line in this.data) {

            if (!this.damage[line]){
                cursor.lineDown(1);
                continue;
            }
    
            cursor.clear();
            process.stdout.write(
                this.data[line] + '\n'
            );
    
            this.damage[line] = false;
        }
    
        cursor.save();
        cursor.lineUp(this.data.length);
    }


    writeLine(position, contents) {


        this.damage[position] = true;
        this.data[position] = contents;


        this.render();

    }

}

