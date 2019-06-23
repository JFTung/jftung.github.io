let g_fileData = [];

function output(str) {
    document.getElementById("outputText").innerHTML = str;
}

function ExcelToJson() {
    this.parseExcel = function(file) {
        let reader = new FileReader();

        reader.onload = function(e) {
            let data = e.target.result;
            let workbook = XLSX.read(data, {
                type: 'binary'
            });

            workbook.SheetNames.forEach(function(sheetName) {
                let XL_row_object = XLSX.utils.sheet_to_row_object_array(
                    workbook.Sheets[sheetName]);
                let json_object = JSON.stringify(XL_row_object);
                g_fileData.push(json_object);
            });
        };

        reader.onerror = function(ex) {
            output("Error parsing file: " + ex);
        };

        reader.readAsBinaryString(file);
    };
};

function randomButtonClicked() {
    const files = document.getElementById('spreadsheetFile').files;
    if (files.length != 1) {
        output("Please select exactly one Excel file");
        return;
    }
    const file = files[0];

    let excelReader = new ExcelToJson();
    excelReader.parseExcel(file);

    console.log(g_fileData);

    output("The winner is: ");
}
