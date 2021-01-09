import getTip from './tips.js';

/* At some point in the future, I'd love to add a modular plugin-based theme
system. For now, I'm 
*/
function splash(){
    const lines = [];
    lines[0] = "SSHT> Start typing to begin searching hosts";
    lines[1] = '1. ';
    lines[2] = '2. ';
    lines[3] = '3.       Tip:';
    lines[4] = '4.       '+ getTip();
    lines[5] = '5. ';
    lines[6] = '6. ';
    lines[7] = "initializing | 0/0";
    return lines;
}

function resultLine(index, host, uiFields){
    let string = '';

    string += `${index + 1}. `;


    if (typeof host.user == 'string') {
        string += `${host.user}@`;
    }

    string += host.fqdn;

    if (host.username) {
        string += `:${host.port}`;
    }

    return string;
}

/* Available params for status/search lines:
    resultSize      Total number of search results for current query
    poolSize        Total number of known hosts
    visualBell      Boolean true while visual bell is active
    search          Search string
*/
function searchLine(uiFields){
    let string = '';

    string += 'SSHT> ';

    string += uiFields.search;

    return string;
}
function statusLine(uiFields){
    let string = '';

	string += (`ready | ${uiFields.resultSize}/${uiFields.poolSize}`);

    return string;
}

export const theme = {
    splash: splash,
    resultLine: resultLine,
    searchLine: searchLine,
    statusLine: statusLine
};