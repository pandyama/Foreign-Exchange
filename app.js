const http= require ('https'); //Constant that requires the HTTPS package in order to make requests to the API
// var keypress = require('keypress');
// //keypress(process.stdin);
// process.stdin.on('keypress',function(ch, key){
// 	//console.log('got keypress',key);
// 	if(key && key.ctrl && key.name == 'c'){
// 		process.exitCode;
// 	}
// });

var url; //Holds the API URL

var str = "";

const readline = require('readline'); //Package used for reading user input

var date, baseCurrency, baseAmount, convertCurrency; // Four variables that will hold key information

var res = [];
var arr = ['0','0','0']

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});


//Below is the syntax for how user input is taken For each of the 4 questions asked
rl.question('Please enter the date to do currency conversion for: Format (yyyy-dd-mm) ',(ans)=>{
	date = ans; // The data from callback is stored in DATE variable
	x = date.split('-'); //Split function used to split the Date value by DASH

	//All the user input is nested inside one another
	rl.question('Base Currency (GBP,CAD,USD....): ',(ans)=>{
		baseCurrency = String(ans);// baseCurrency holds the value user puts, such as GBP, USD...

		//Another Nested user input prompt
		rl.question('Conversion Amount(number only): ',(ans)=>{
			baseAmount = String(ans); //baseAmount holds the value for the amount to be converted....

			//One more neste user input statement
			rl.question('Conversion Currency(GBP,CAD,USD....): ',(ans)=>{
				convertCurrency = String(ans); //convertCurrency holds the value user gives, such as the final currency to convert to

				//Below is the modified URL for the API Call where Date, Base Currency and Converted Currency variables are inserted
				url = `https://api.exchangeratesapi.io/api/${date}?symbols=${baseCurrency},${convertCurrency}`;
				//console.log(convertCurrency);
				//https://api.exchangeratesapi.io/latest HTTP/1.1


				for(var i = 0; i < 3; i++){

						if (x[i] > 999){
							arr[0] = x[i]
						}
						else if (x[i] <= 31 && x[i]>=12){
							arr[1] = x[i]
						}
						else{
							arr[2] = x[i];
						}
					}
				getRate();// Calls the getRate() function, which returns
 

				rl.close();
				process.stdin.resume();
			});
		});
	});

});



function getRate(){

	var jsonObj; //The Main JSON Object retrieved when the call to API is made
	var ratesObj; // Captures Rates from the jsonObject
	var final; // Holds final converted currency Value

	var finalJson; //JSON object that is displayed as final result

	//Below is the callback function which sends HTTP request to the Exchange Rates API
	callback = function(response){

			response.on('data',function(chunk){
				str+=chunk; //collect all the data coming from the API
				jsonObj = JSON.parse(str); //Parse it into a JSON Object
			});
			response.on('end',function(){
				//console.log(str);
				//console.log('\n On '+jsonObj["date"]+' the rate was: ');
				//console.log(jsonObj["rates"]+'\n');

				ratesObj = jsonObj["rates"];
				//console.log(ratesObj[`${baseCurrency}`]);

				var final = (baseAmount*ratesObj[convertCurrency])/ratesObj[baseCurrency];
				//console.log(`Your ${baseAmount} ${baseCurrency} is worth ${final} in ${convertCurrency} with the rate conversion shown above`);

				finalJson = {"Date":`${jsonObj["date"]}`,"Base Currency":`${baseCurrency}`,"Base Amount":`${baseAmount}`,"Conversion Currency":`${convertCurrency}`,"Converted Amount":`${final}`};
				console.log('Your '+baseAmount+' '+baseCurrency+ ' was worth '+Math.ceil(final,2)+' in '+convertCurrency);
			});
		}
	http.request(url, callback).end();

}
