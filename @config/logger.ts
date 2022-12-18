import Chalk from 'chalk';

class CustomLogger{
    constructor(){}
    success(...args:any[]){
        Chalk.green(args);
    };
    error(...args:any[]){
        Chalk.red(args);
    };
    warning(...args:any[]){
        Chalk.yellow(args);
    };
    info(...args:any[]){
        Chalk.blue(args);
    };
    log(...args:any[]){
        Chalk.bgBlueBright.white(args);
    };
}

const console = new CustomLogger();

export default console;