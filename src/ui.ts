import chalk from "chalk";
import * as prompts from "prompts";
import { hosts } from "./hosts";

function genRow(h): string {
    const w = process.stdout.columns;

    let host: string = h.fqdn;

    let lengthOffset: number = 0;
    //const chalk = { gray: a => a };

    // If the device has a specified port, append it
    if (typeof h.port !== "undefined") {
        host += chalk.gray(":" + h.port);
        lengthOffset -= 10;
    }

    if (typeof h.username !== "undefined") {
        host = chalk.gray(h.username + "@") + host;
        lengthOffset -= 10;
    }

    const endText = h.kind;
    const instertAt = (str, sub, pos) =>
        `${str.slice(0, pos)}${sub}${str.slice(pos)}`;
    return instertAt(
        `${h.name} (${host})`.padEnd(w + w),
        endText,
        w - endText.length - lengthOffset
    ).substring(0, w - lengthOffset); // logs 'I want an apple'
}

async function getChoices(arr) {
    // Get hosts list:
    const ch = [];

    arr.forEach(h => {
        // rearrange and format hosts

        ch.push({
            title: genRow(h),
            value: "" + arr.indexOf(h)
        });
    });

    return ch;
}

const suggestByTitle = (input, choices) => {
    // Figure out what the multiple searches are:
    const searches = input.split(" ");

    // Return the promose
    return Promise.resolve(
        choices.filter(i => {
            let doesMatch = 0;
            searches.forEach(s => {
                if (i.title.includes(s)) doesMatch++;
            });
            return doesMatch >= searches.length;
        })
    );
};
(async () => {
    const arr = await hosts();
    const availableHosts = await getChoices(arr);

    // Start autocomplete prompt:
    const response = await prompts([
        {
            type: "autocomplete",
            name: "index",
            message: "Select host",
            suggest: suggestByTitle,
            choices: availableHosts
        }
    ]);

    const index = response.index;
    process.stdout.write("".padEnd(process.stdout.columns));
    process.stdout.write("\x1B[2A");
    process.stdout.write("".padEnd(process.stdout.columns));
    console.log("");
    if (index == null) {
        console.log(chalk.red("Unable to locate host"));
        return;
    }
    //console.log(index, response, arr[index.toString()]);

    const target = arr[index.toString()];

    var cp = require("child_process");
    var childProcess = cp.spawn("ssh", [target.ssh], { stdio: "inherit" });
})();
