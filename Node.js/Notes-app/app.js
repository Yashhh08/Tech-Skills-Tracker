const fs = require("fs");
const notes = require("./notes.js");
const chalk = require("chalk");
const yargs = require("yargs");
const { removeNote } = require("./notes.js");
const { title } = require("process");

// FS : USED TO READ AND WRITE FILES

fs.writeFileSync("notes.txt","This is created using fs.writeFileSync() method.\n");

fs.appendFileSync("notes.txt","This is appended using fs.appendFileSync() menthod.\n");

// console.log(notes.getNotes());


// CHALK : USED TO HIGHLIGHT CONSOLE.LOG()

const success = chalk.green;
const warning = chalk.yellow;
const error = chalk.red;

// console.log(success.bold.inverse("Success!"));
// console.log(warning.bold.underline("Warning..!!"));
// console.log(error.bold("Error"))


// YARGS : TAKING INPUT FROM COMMAND LINE

yargs.command({
    command: "add",
    describe: "adding a new note",
    builder: {
        title:{
            describe:"Note Title",
            demandOption:true,
            type:"string"
        },
        body:{
            describe:"Note Body",
            demandOption:true,
            type:"string"
        }
    },
    handler: (argv)=>{
        notes.addNote(argv.title,argv.body);
    }   
});

yargs.command({
    command: "remove",
    describe: "removing a note",
    builder:{
        title:{
            describe:"remove title",
            demandOption:true,
            type:"string"
        }
    },
    handler: (argv)=>{
        notes.removeNote(argv.title);
    }
})

yargs.command({
    command: "list",
    describe: "listing all notes",
    handler: ()=>{
        notes.listNotes();
    }
})

yargs.command({
    command: "read",
    describe: "reading a note",
    builder:{
        title:{
            describe:"read title",
            demandOption:true,
            type:"string"
        }
    },
    handler: (argv)=>{
        notes.readNotes(argv.title);
    }
})


// console.log(yargs.argv); // { _: [ 'read' ], '$0': 'app.js' }

yargs.parse(); // required for command line argument parsing

