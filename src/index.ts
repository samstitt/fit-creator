import {FitIntervalsArray} from './types/fitTypes'
import * as fs from 'fs';

interface headers  {
    fileName: string;
    description: string;
    ftp: string
}

const input: FitIntervalsArray = [
{
    TimeNumber: 10,
    PowerNumber: 20
},
{
    TimeNumber: 10,
    PowerNumber: 20
},
];

const headersInput: headers = {
    fileName: 'workout',
    description: 'sweatfest',
    ftp: '200'
}

function getInput () {
    return input;
}

function createHeaders (ftp: string): string {
return `
[COURSE HEADERS]
VERSION = 2
UNITS = ENGLISH
DESCRIPTION = ${headersInput.description}
FILE NAME = ${headersInput.fileName}
MINUTES PERCENT
FTP = ${ftp}
[END COURSE HEADERS]
`;
}

function createCourse (input: FitIntervalsArray): string {
    let currentTime = 0;

    return `
[COURSE DATA]
${0} ${input[0].PowerNumber}
${input.reduce((acc: string, interval, index) => {
    
   currentTime = currentTime + interval.TimeNumber;
   return acc + `${currentTime} ${interval.PowerNumber}${index === input.length - 1 ? '' : '\n'}`;
}, '')}
[END COURSE DATA]
    `;
}

function createFitFile (input: FitIntervalsArray, ftp: string): string {
    return `
        ${createHeaders(ftp)}
        ${createCourse(input)}
    `;
}

function main () {
    const input = getInput();
    const ftp = '200';
    let courseData = createFitFile(input, headersInput.ftp);
    courseData = courseData.replace(/^\s*$(?:\r\n?|\n)/gm, '');

    fs.writeFileSync(`${headersInput.fileName}.fit`, courseData);

}

main();