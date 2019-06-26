function getCsv() {
  // imports the csv file from Google Drive...
  var file = DriveApp.getFilesByName("data.csv").next();
  var csvData = Utilities.parseCsv(file.getBlob().getDataAsString(), ';');
  var sheet = SpreadsheetApp.getActiveSheet();
  sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);

}
  

// majorly converts the vat_rate into a good number to work with
// also calls getCsv
function convertVatRate() {
  getCsv();
// converts the vat_rate column
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  data = sheet.getRange("e2:e11").getValues();
  cleanData = [];
  for (i=0; i<data.length; i++){
    // converts data to a string and remove the 0,
    dat  = data[i].toString();
    dat = parseInt(dat.replace('0,', ''))+'%'; // makes it a percentage
    Logger.log(dat);
    cleanData.push([dat]);
  }
  Logger.log(cleanData);
  // populates the cleandata with the real numbers newData
  newData = sheet.getRange("e2:e11").setValues(cleanData); 
}
  
  
// automates the whole task in the spreadsheet by calling other functions, i.e convertRate and getCsv
function carPriceGross() {
  convertVatRate();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // makes sure that there is only 1 column called 'car_price_gross'
  if (sheet.getRange(1, 8).getValue() === 'car_price_gross') {
    
  }
  else{
    sheet.insertColumnAfter(7);
    sheet.getRange(1, 8).setValue('car_price_gross');
    var car_price_net = sheet.getRange("d2:d11").getValues();
    var vat_rate = sheet.getRange("e2:e11").getValues();
    var priceGross = sheet.getRange("h2:h11"); 
    var gross = [];
    Logger.log(car_price_net);
    for (i=0; i<car_price_net.length; i++){
      var priceGross = sheet.getRange("h2:h11");   
      output = parseFloat(car_price_net[i]) + parseFloat(vat_rate[i]);
      gross.push([output]); 
  }
   priceGross.setValues(gross);   
}
}
  

// Sends the mail to each of the email address in column merchant_email
// A time-based trigger is already setup to automate the sending of mails once every hour.
// it can very much to customized to whatever is intended...
function sendMail() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var merchantMail = sheet.getRange('g2:g11').getValues();
  var stockid = sheet.getRange('a2:a11').getValues();
  var car_manu = sheet.getRange('b2:b11').getValues();
  var car_type = sheet.getRange('c2:c11').getValues();
  var car_price_gross = sheet.getRange('h2:h11').getValues();
  
  // loop through each of the required columns; stockid, car_manu, car_type
  // and get their car_price_gross
  for (i=0; i<stockid.length; i++){
    message  = 'Congratulations, \n\nyou have bought the following car: \n\n'+stockid[i]+' '+car_manu[i]+' '+car_type[i]+'\n\nfor the low price of '+car_price_gross[i].toString().replace('.',',')+'€';
    Logger.log(message);
    // call the mailApp to dispatch messages to corresponding addresses 'merchantMail[i]'
    mail = MailApp.sendEmail(
    merchantMail[i],
    "Auto1 Test",
    message)
  }
}

// THE END!
