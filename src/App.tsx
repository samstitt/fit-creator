import { useState } from 'react'
import './App.css'

import {FitIntervalsArray} from './types/fitTypes'
import * as fs from 'fs';


function App() {
  const [intervals, setIntervals] = useState<FitIntervalsArray>([
    {
      TimeNumber: 10,
      PowerNumber: 20
    },
    {
      TimeNumber: 10,
      PowerNumber: 20
    }
  ])

  return (
    <>
        <h1>Fit Creator</h1>
        {JSON.stringify(intervals)}
        <button onClick={() => handle(intervals)}>Create Fit File</button>
    </>
  )
}

const handle = (intervals) => {
    return generator(intervals);
}
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

function generator (input : FitIntervalsArray) {
    let courseData = createFitFile(input, headersInput.ftp);
    courseData = courseData.replace(/^\s*$(?:\r\n?|\n)/gm, '');

    const blob = new Blob([courseData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${headersInput.fileName}.fit`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

}

export default App
