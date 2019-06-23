'use strict';

function output(str) {
    document.getElementById("outputText").innerHTML = str;
}

// Array is empty, or consists of only empty strings
function isEmptyRow(array) {
    if (array.length === 0) {
        return true;
    }
    for (let idx in array) {
        if (array[0]) {
            return false;
        }
    }
    return true;
}

function randomButtonClicked() {
    const files = document.getElementById('spreadsheetFile').files;
    if (files.length != 1) {
        output("Please upload exactly one Excel file");
        return;
    }
    const file = files[0];

    let excelReader = new ExcelToArrays(processEntrants);
    excelReader.parseExcel(file);
}

function ExcelToArrays(onloadCallback) {
    this.onloadCallback = onloadCallback;
    this.parseExcel = function(file) {
        let reader = new FileReader();

        reader.onload = function(e) {
            const data = e.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });

            let sheets = [];
            workbook.SheetNames.forEach(function(sheetName) {
                sheets.push(XLSX.utils.sheet_to_csv(
                    workbook.Sheets[sheetName]));
            });

            if (sheets.length < 1) {
                output("Error parsing file: no sheets found");
                return;
            }

            const parseInfo = Papa.parse(sheets[0]);
            if (!parseInfo.errors) {
                output("Error parsing file: invalid file type");
                return;
            }

            if (parseInfo.meta.aborted || parseInfo.meta.truncated) {
                output("Error parsing file: exceeds maximum file size");
                return;
            }

            const arrays = parseInfo.data;
            onloadCallback(arrays);
        };

        reader.onerror = function(ex) {
            output("Error parsing file: " + ex);
        };

        reader.readAsBinaryString(file);
    };
};

function processEntrants(rawEntrants) {
    let entrants = [];
    for (let idx in rawEntrants) {
        const rawEntrant = rawEntrants[idx];
        let entrant = {};
        if (isEmptyRow(rawEntrant)) {
            continue;
        }
        if (rawEntrant.length < 3) {
            output("Invalid row formatting: " + rawEntrant);
            return;
        }
        else {
            entrant.firstName = rawEntrant[0];
            entrant.lastName = rawEntrant[1];
            let numTicketsString;
            if (rawEntrant.length === 3) {
                numTicketsString = rawEntrant[2];
            }
            else {
                numTicketsString = rawEntrant[3];
            }
            entrant.numTickets = parseInt(numTicketsString, 10);
            if (isNaN(entrant.numTickets)) {
                output("Invalid row formatting: " + rawEntrant + ": " +
                       numTicketsString + " is not an integer");
                return;
            }
            if (entrant.numTickets < 0) {
                output("Invalid row formatting: " + rawEntrant + ": " +
                       numTicketsString + " is not a positive integer");
                return;
            }
        }
        entrants.push(entrant);
    }

    calculateWinner(entrants);
}

function calculateWinner(entrants) {
    let totalNumTickets = 0;
    entrants.forEach(function(entrant) {
        totalNumTickets += entrant.numTickets;
    });

    // From 0 to totalNumTickets - 1, inclusive
    const winningTicket = Math.floor(Math.random() * totalNumTickets);

    let winner;
    let cumulativeCount = 0;
    for (let idx in entrants) {
        const entrant = entrants[idx];
        cumulativeCount += entrant.numTickets
        if (winningTicket < cumulativeCount) {
            winner = entrant;
            break;
        }
    }

    output("The winner is: " + winner.firstName + " " + winner.lastName);
}
