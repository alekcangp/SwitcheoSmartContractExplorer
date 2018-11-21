/* required Vue
 * required hash.js
 * get balances
 * and save address in local storage
 */

//get  tokens
	axios.get("https://api.switcheo.network/v2/exchange/tokens").then(function(response) {	  
	vm.tokens = response.data; 						
	vm.tokens.SWH = {"hash":"78e6d16b914fe15bc16150aeb11d0c2a8e532bdd","decimals":8};	 //add SWH old token
	vm.tokens.ONT = {"hash":"ceab719b8baa2310f232ee0d277c061704541cfb","decimals":8};	 //add ONT nep-5 token
	vm.tokens.ETH = {"hash":"0x0000000000000000000000000000000000000000","decimals":18};	 //add ETH	
}); 

async function runfee() {

	try {
		await axios.get("https://api.switcheolytics.tech/switcheo/fee/amount/graph").then(function(response) {	 
		vm.fees = response.data; 
		alemes = ''
		document.getElementById('errfee').innerText = alemes;
		});
	} 
	catch (e) {alemes = 'API is unreachable!'; document.getElementById('errfee').innerText = alemes;
	return}

	(vm.tabn == 'fee' ? xfeeVolume() : {})
}


// SET FEES

var trigxx = 1, alemes = '_';
function xfeeVolume () {
	
	if (vm.fees == '' && alemes == '_') {var ii = setInterval(xfeeVolume, 1000); document.getElementById("fee").innerHTML = "<img src='./img/load.gif'>";} 
	else { 
		clearInterval(ii); 
		document.getElementById("fee").innerHTML = "FEES";
		if (trigxx == 1 && alemes != 'API is unreachable!')  {  trigxx = 0; feeVolume (0) } else return;//run only first time for click on tab
	}
}	


var trigx = 1;
async function feeVolume (x) {
var wps = [];	
var mps = [];
var dps = [];
var chart = new CanvasJS.Chart("chartContainer", {
	theme: "dark2",
	animationEnabled: true,
	zoomEnabled: true,
	exportEnabled: true,
	 backgroundColor: "#212A3F",
	 
	title: {
		margin: 50,
		text: " ",
		
	},
	axisX: {
		valueFormatString: "DD MMM",
		labelFontSize: 16,
	},
	axisY: {
		title: "Daily & weekly volume",
		titleFontSize: 20,
		labelFontSize: 16,
		minimum: 0,
		gridColor: "#4169E1",
		gridDashType: 'dot',
			gridThickness: 1,
		
		includeZero: true,
		lineColor: "#4169E1",
		tickColor: "#4169E1",
		labelFontColor: "#4169E1",
		titleFontColor: "#4169E1",
		//valueFormatString: "##,,###,.##",
		lineThickness: 1,
		
	},
	axisY2: {
		title: "Monthly volume",
		titleFontSize: 20,
		labelFontSize: 16,
		minimum: 0,
		gridColor: "#9370DB",
			gridDashType: 'dot',
			gridThickness: 1,
		lineColor: "#9370DB",
		tickColor: "#9370DB",
		//valueFormatString: "##,,###,.##",
		labelFontColor: "#9370DB",
		titleFontColor: "#9370DB",
		lineThickness: 1
	},
	axisY3: {
		title: "Volume",
		lineColor: "#4169E1",
		tickColor: "#4169E1",
		minimum: 0,
		//valueFormatString: "##,,###,.##",
		labelFontColor: "#4169E1",
		lineThickness: 1
	},
	
	toolTip: {
		shared: true
	},
	
	legend: {
            cursor: "pointer",
            itemclick: function (e) {
               
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        },
	
	data: [
	{
		type: "stepArea",	
		axisYType: "secondary",
		name: "monthly volume",
		
		color: "#9370DB",
		showInLegend: true,
		yValueFormatString: "##,###.",
		xValueType: "dateTime",
		dataPoints: mps
	},
	{
		type: "stepArea",
		name: "weekly volume",
		color: "#4169E1",
		showInLegend: true,
		yValueFormatString: "##,###.",
		xValueType: "dateTime",
		dataPoints: wps
	},
	{
		type: "column",		
		name: "daily volume",		
		color: "#00FF00",
		showInLegend: true,
		yValueFormatString: "##,###.",
		xValueType: "dateTime",
		dataPoints: dps
	},
	
	]
});

	var resul = [];
	
	for (var key in vm.fees) {
	if (key == vm.selected) {resul = vm.fees[key]}
	};
		
	var msum = 0;
	var wsum = 0;
	var mo = '';
	var ind = 0;
	var wind = 0;
	var mtime =[];
	var we = '';
	
	for (var i = 0; i < resul.length; i++) {
		time = 1000*moment(resul[i].block_date, "YYYY-MM-DD").unix();

		mo = moment.unix(time/1000).format('DD');
		we = moment.unix(time/1000).format('dd'); 

		mtime[i] = time;
		
		(i == resul.length-1 && (mo != '01' ||  we != 'Mo'))  ? k=i+1 : k=i; //plus last day
				
	//calculate month			
		if (mo == '01' || i == resul.length-1) { 
			for (var j = ind; j < k; ++j) {
				mps.push({
				x: mtime[j],
				y: msum
				}); 
			};			
					
			(i == resul.length-1 && mo == '01') ? //if today is 01
				mps.push({
				x: mtime[i],
				y: resul[i].fee_amount
				})
				: {};
		 	 		 
			msum = 0;		
			ind = k;
			
		};
				
		msum += resul[i].fee_amount;				
		
	//calculate week	
		if (we == 'Mo' || i == resul.length-1) { 
			for (var g = wind; g < k; ++g) {
				wps.push({
				x: mtime[g],
				y: wsum
				}); 
			};	
			
			(i == resul.length-1 && we == 'Mo') ? //if today is Monday
				wps.push({
				x: mtime[i],
				y: resul[i].fee_amount
				})
			: {};
		 
		 	wsum = 0;
			wind = k;
		};
		
		wsum += resul[i].fee_amount; 
		if (trigx == 0 && x == 0)  { return } ; //run only first time for click on tab
		dps.push({
			x: time,
			y: resul[i].fee_amount
		});
	};
	
	chart.render();
	trigx = 0;	
};


var addr20 = "AKJQMHma9MA8KK5M8iQg8ASeg3KZLsjwvB"; //address neo v2 contract
var addr15 = "AZ1QiX5nqgm8dsUY7iRyafKwmKnGP9bUhN"; //address neo v1.5 contract
var addr10 = "AJdZA4UftshLwVAS4YAc9k274GmwDmkJgj";	//address neo v1 contract	
var mt = [], ms = [], mb = [], ma = [], morders = [];


// set dex balance in gauge
var amo = 0, amoe = 0, peth, pneo, pswth, addrne = [], bal20, bal15, bal10;
async function timing() {
	
	// eth and neo in dollars
	 axios.get("https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=ETH,NEO,SWTH,DAI,OMG,MKR&CMC_PRO_API_KEY=******************************").then(
		function (result) {peth = result.data.data.ETH.quote.USD.price;  pneo = result.data.data.NEO.quote.USD.price; pswth = result.data.data.SWTH.quote.USD.price; 
			vm.number = pswth;
		})
	
	// amount neo tokens in contracts
	axios.get("https://api.neoscan.io/api/main_net/v1/get_balance/"+addr20).then(function (response) {
		bal20 = response.data.balance; });
	axios.get("https://api.neoscan.io/api/main_net/v1/get_balance/"+addr15).then(function (response) {
		bal15 = response.data.balance;});
	axios.get("https://api.neoscan.io/api/main_net/v1/get_balance/"+addr10).then(function (response) {
		bal10 = response.data.balance;});

		// amount eth in contract
		 axios.get("https://api.etherscan.io/api?module=account&action=balance&address=0xba3ed686cc32ffa8664628b1e96d8022e40543de&tag=latest&apikey=*******************************").then(
		function (result) { amoe += result.data.result*1e-18 });

		// tokens price in neo or eth
	 	await axios.get("https://api.switcheo.network/v2/tickers/last_price").then(function (response) { 
		vm.prices = response.data;
		vm.prices.NEO = {"NEO":"1"}; vm.prices.ETH = {"ETH":"1"};
		});	

	   // amount tokens in eth 
	   function amtok(ehash, ind) {
		   axios.get("https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress="+ehash+"&address=0xba3ed686cc32ffa8664628b1e96d8022e40543de&tag=latest&apikey=************************").then(
			function (result) { var res = result.data.result/10**vm.tokens[ind].decimals*vm.prices[ind].ETH; amoe += res});
	   }
	   
	   
	   	for (var ind in vm.tokens) {
			if (vm.tokens[ind].hash.substr(0,2) == '0x') { amtok(vm.tokens[ind].hash, ind) } 
			}		
		setTimeout(timingCal, 2500);	
}

function timingCal() {
	// calculate neo contracts
	amo = 0; addrne = []; 
				(vm.contr == "v20") ? addrne = [bal20] : 
				(vm.contr == "v15") ? addrne = [bal15] : 
				(vm.contr == "v10") ? addrne = [bal10] : 
				(vm.contr == "All") ? addrne = [bal20, bal15, bal10] : {};
			for (var bal of addrne) {
			for (var w of bal) {	
				var am = 0;
				for (var tpr in vm.prices) {	
					var symbol = w.asset_symbol;
						if (symbol == tpr) { 						
							am = Number(w.amount)*Number(vm.prices[tpr].NEO);break		
						};
						if (symbol == 'NEO') {am = Number(w.amount); break};						
				};	
			amo += am ;				
			}
		}	

		(vm.contr == 'All') ? gauges[0].value = (amo*pneo + amoe*peth) * 1e-4 :
		(vm.contr == 'eth') ? gauges[0].value = (amoe*peth) * 1e-4 :
		gauges[0].value = amo*pneo*1e-4  			
}


// VUE modules

var vm = new Vue({
el: '#api',
data: {

diff: [-120, -120, -120, -120, -120], // show differens between best block
trig: [-1, -1, -1, -1, -1], //show status nodes
counter: [-1, -1, -1, -1, -1], // secons ago
bestb: 0,
mem: ['','','','',''], // mempool

results: [],
tokens: {},
contr: "All",
tabn: "tabneo",
uhistory: [],
ehistory: [],
xaddress: "",
orders: [],
volume: [],
prices: [],
addresses: [], // neo addresses
check: [],
fees: '',
selected: 'SWTH',
tweenedNumber: 0,
number: 0,
transfers: [],
balance: [],


},

//Request data API
methods: {
	
		
	//add and del addresses
	deleteItem: function(items, index) {
       items.splice(index, 1);
     },
	 
	 
    addItem: function(items) {
       var newVal = '';
       items.push(newVal);
     },

	
// get price in order	
	priced: function (prfills, prmakes) {
		var pr;
		if (prfills == '') {pr = prmakes[0].price} else {pr = prfills[0].price;}
		return Number(pr).toFixed(8)			
	},
// get total amount in order	
	persent: function (pefills, pemakes) {
		var pe = 0;		
		for (i = 0; i < pefills.length; ++i) {
		 pe += Number(pefills[i].fill_amount);
		};
		for (i = 0; i < pemakes.length; ++i) {
		 pe += Number(pemakes[i].filled_amount);
		};		
		return pe
	},
		
// get total volume for each token	
	volumed: function (dec1, dec2, k1, k2, t1, t2, pr, amt, side) {
		
		if (ms[k1] == null) {ms[k1] = 0};
		if (ms[k2] == null) {ms[k2] = 0};
		if (mb[k1] == null) {mb[k1] = 0};
		if (mb[k2] == null) {mb[k2] = 0};
		mt[k1] = t1;
		mt[k2] = t2;
		var st1 = Number(dec1.decimals);
		var st2 = Number(dec2.decimals);
		ms[k1] = ms[k1] + amt/10**st1;
		if (t2 == 'NEO') {mb[k2] = mb[k2] + (amt/10**st2)*pr;} 
		else if (t2 == 'ETH') {mb[k2] = mb[k2] + (amt/10**st2)*pr;} 
		else if (t2 == 'GAS' && side =='sell') {mb[k2] = mb[k2] + (amt/10**st2)*pr;} 
		else if (t2 == 'SWTH' && side =='sell') {mb[k2] = mb[k2] + (amt/10**st2)*pr;} else {mb[k2] = mb[k2] + (amt/10**st2)/pr;}
		
		},
				
	
	request: async function tabsx() {

		timingCal();//set dex balance
		
		// set gauge contract	
		(vm.contr == 'All') ? gauges[1].value = 0 : 
		(vm.contr == 'eth') ? gauges[1].value = 180 : 
		(vm.contr == 'v20') ? gauges[1].value = 135 : 
		(vm.contr == 'v15') ? gauges[1].value = 90 : 
		gauges[1].value = 45;
								
			//addresses validation
			var num = -1
			for (address of vm.addresses) { ++num
				if (address.length == 0)  continue ;
				// neo address validation
				if (address.length == 34) { 
					for (i = 0; i < address.length; i++) {
						var c = address[i];			
						if (!(c in ALPHABET_MAP) || address[0] != "A") {
						 document.getElementById('go').innerHTML ="<span style = 'color:yellow'>Incorrect NEO address is detected!</span>";
						 return	 			
						}
					}
				}	
				
				//eth address validation
				else if ( address.length == 42 || address.length == 40 ) {
			 
					 (address.substr(0,2) != '0x') ? vm.addresses[num] = "0x" + address : address = address.substr(2,40);

					vm.addresses[num] = vm.addresses[num].toLowerCase();			
					var ALPHABET_ETH = '0123456789ABCDEFabcdef';
					var ALPHABET_MAP_ETH = {};
					for (var i = 0; i < ALPHABET_ETH.length; i++) {
					ALPHABET_MAP_ETH[ALPHABET_ETH.charAt(i)] = i
					};
					
					for (i = 0; i < address.length; i++) {
						var c = address[i];	
						if (!(c in ALPHABET_MAP_ETH)) {
						document.getElementById('go').innerHTML ="<span style = 'color:yellow'>Incorrect ETH address is detected!</span>"; 
						return 
						}	
					}
				} else {
					document.getElementById('go').innerHTML ="<span style = 'color:yellow'>Incorrect address is detected!</span>"; 
					return 
				}
			}
		
			document.getElementById('go').innerHTML ="<span style = 'color:#fff'>Go</span>";

			var contracteth = "0xba3ed686cc32ffa8664628b1e96d8022e40543de";
			var contract20 = "91b83e96f2a7c4fdf0c1688441ec61986c7cae26";
			var contract15 = "01bafeeafe62e651efc3a530fde170cf2f7b09bd";
			var contract10 = "0ec5712e0f7c63e4b0fea31029a28cea5e9d551f";
			var u = "&contract_hashes[]=";
			var ua = ""
			
			if ((vm.addresses.filter(word => word != '')).length > 0)  {
				document.getElementById('bload').innerHTML = "<img src='./img/load.gif'>";
				document.getElementById('tload').innerHTML = "<img src='./img/load.gif'>";
				document.getElementById('vload').innerHTML = "<img src='./img/load.gif'>";			
				document.getElementById('oload').innerHTML = "<img src='./img/load.gif'>";	
			} else {return;}
	
// BALANCE section			
				
			var contract = "", addrb = '';
			vm.results = []; // to update table				
			(vm.contr == "All") ? contract = u+contracteth+u+contract20+u+contract15+u+contract10 : 
			(vm.contr == 'eth') ? contract = u+contracteth : 
			(vm.contr == "v20") ? contract = u+contract20 : 
			(vm.contr == "v15") ? contract = u+contract15 : 
			contract = u+contract10;
			var nonemp = vm.addresses.filter(word => word != '');
	
			for (i = 0; i < nonemp.length; ++i) {

				(nonemp[i].length == 34) ? addrb = addrb + ua + decode(nonemp[i]) :
				addrb = addrb + ua + nonemp[i];
				
				ua = "&addresses[]="

			};
			var urlb = "https://api.switcheo.network/v2/balances?addresses[]="+addrb+contract;

			axios.get(urlb).then(function(response) {       // get json balance				
			var resultsb = response.data; 
			document.getElementById('bload').innerHTML = "BALANCE";	
			var sp = 0, sc = 0, so = 0;
			for (var tok in vm.tokens) {
				
				var i = 0, a = ['','','','','','']
				for (var col in resultsb) {++i;

						var tokensb = resultsb[col]
					for (var tokb in tokensb) {
						if (tokb == tok && tokensb[tokb] != 0 ) { 
							if ( i == 1 ) {
								a[0] = tokb; let res = tokensb[tokb][0].amount/10**vm.tokens[tok].decimals;
								a[i] = res; a[4] = tokensb[tokb][0].event_type; a[5] = moment(tokensb[tokb][0].created_at).format('DD-MM-YYYY, HH:mm:ss');
							}
							else { a[0] = tokb; let res = tokensb[tokb]/10**vm.tokens[tok].decimals; a[i] = res; }
						}
					}	
				} 
				// create string and calculate total
				if (a[0] != '')  { vm.results.push(a);
					if ((vm.tokens[a[0]].hash).substr(0, 2) == '0x') { 
						sp += a[1]*vm.prices[a[0]].ETH*peth; sc += a[2]*vm.prices[a[0]].ETH*peth; so += a[3]*vm.prices[a[0]].ETH*peth
					} else { sp += a[1]*vm.prices[a[0]].NEO*pneo; sc += a[2]*vm.prices[a[0]].NEO*pneo; so += a[3]*vm.prices[a[0]].NEO*pneo }			
				}
				vm.balance = ['TOTAL in $', sp.toFixed(8), sc.toFixed(8), so.toFixed(8)];
			}

			}); 
						
													
// ORDERS  section
			mt = []; ms = []; mb = []; ma = [];	morders = [];
			vm.orders = [];
			contract = [];
			(vm.contr == "All") ? contract = [contracteth, contract20, contract15, contract10] : 
			(vm.contr == "eth") ? contract = [contracteth] : 
			(vm.contr == "v20") ? contract = [contract20] :
			(vm.contr == "v15") ? contract = [contract15] : 
			contract = [contract10];		
			
			var ourl = [], ourlx = [], k = 0
			for (i = 0; i < nonemp.length; ++i) {
				(nonemp[i].length == 34) ? addrb = decode(nonemp[i]) :
				addrb = nonemp[i]; 
						
					for (var j = 0; j < contract.length; ++j) {
						var ourl = "https://api.switcheo.network/v1/orders?address="+addrb+"&contract_hash="+contract[j]+"&limit=200";
						ourlx[k] = axios.get(ourl); 
						k += 1
					};
			};
			 await axios.all(ourlx).then(function (response) {			// get json orders	
			vm.orders = response; vm.volume = response;
			document.getElementById('oload').innerHTML = "ORDERS";
			document.getElementById('vload').innerHTML = "VOLUME";			
			});
			vm.volume = [];//set volume in null after display data


			// create array for orders
			for (var oresult0 of vm.orders) {
				for (var oresult of oresult0.data) {
					for (var otok in vm.tokens) {
						if (oresult.offer_asset_id == vm.tokens[otok].hash) {var tok1 = otok, dec1 = vm.tokens[otok].decimals };
						if (oresult.want_asset_id == vm.tokens[otok].hash) {var tok2 = otok, dec2 = vm.tokens[otok].decimals};
					}
					var stamp = moment(oresult.created_at).unix(); 
					morders.push([oresult, tok1, tok2, dec1, dec2, stamp]);			
				}
			}
			morders.sort(function (a, b) { return b[5] - a[5] });


// TRANSFERS section	
			vm.uhistory = [], vm.ehistory = [];;	
			var x = 0, y = 0, urlhx = [], urlex = [];
			
	for (j = 0; j < nonemp.length; ++j) {
		if (nonemp[j].length == 34 && vm.contr != 'eth') {	
			var urlh20 = "https://api.neoscan.io/api/main_net/v1/get_address_to_address_abstracts/"+vm.addresses[j]+"/"+addr20+"/";
			var urlh15 = "https://api.neoscan.io/api/main_net/v1/get_address_to_address_abstracts/"+vm.addresses[j]+"/"+addr15+"/";
			var urlh10 = "https://api.neoscan.io/api/main_net/v1/get_address_to_address_abstracts/"+vm.addresses[j]+"/"+addr10+"/";
			var urlh = [urlh20, urlh15, urlh10];
			var urlhh = [];
			vm.xaddress = vm.addresses[j];//when user are inputing his address,  the tab has not be to updated
			
			(vm.contr == "v20") ? urlhh[0] = urlh[0] : 
			(vm.contr == "v15") ? urlhh[0] = urlh[1] : 
			(vm.contr == "v10") ? urlhh[0] = urlh[2] : urlhh = urlh;
					
			  var pages = 1;			
					for (var url of urlhh) {
						try {
						await axios.get(url+1).then(function (response) {
						pages = response.data.total_pages;
							})	
						} catch(e) {breake}					
							for (var i = 1; i <= pages; ++i) {
								urlhx[x] = axios.get(url+(i));
								x += 1;
							};
					};
		}

		if (nonemp[j].length == 42 && (vm.contr == 'eth' || vm.contr == 'All') ) { 
			var urleth = "https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=6665614&toBlock=latest&address=0xba3ed686cc32ffa8664628b1e96d8022e40543de&topic1=0x000000000000000000000000"+ nonemp[j].substr(2, 40) +"&sort=desc&apikey=******************************"
			urlex[y] = axios.get(urleth);
			++y
		}
	};		
				await axios.all(urlhx).then(function (response) {			// get neo history	
				vm.uhistory = response;
				});

				await axios.all(urlex).then(function (response) {			// get eth history	
				var etrans = response, ehist = [];
				for (var i = 0; i < etrans.length; ++i) {
					ehist[i] = etrans[i].data.result; 
				}
				vm.ehistory = ehist;
				});	
				
				function findtok(has) { // find tok by hash
					for (var ind in vm.tokens) {
						if (has == vm.tokens[ind].hash) {return ind}
					}
				}
				function finddec(has) { // find decimals by hash
					for (var ind in vm.tokens) {
						if (has == vm.tokens[ind].hash) {return vm.tokens[ind].decimals}
					}
				}
				// create neo array
				vm.transfers = [];
				for (var neo of vm.uhistory) { 
					for (var strn of neo.data.entries) {
						var an = ['','','','',''];
						an[0] = strn.time;
						if ( strn.address_from == addr20 || strn.address_from == addr15 || strn.address_from == addr10 )  { an[1] = "withdrawal" ; an[4] = strn.address_to} 
						else { an[1] = "deposit" ; an[4] = strn.address_from};
						an[2] = findtok(strn.asset);
						an[3] = strn.amount;
						vm.transfers.push(an);
					}
				}
			// create eth array
			for (var ehist of vm.ehistory) {
				for (var eth of ehist ) { 
					var ae = ['','','','',''];
					ae[0] = parseInt(eth.timeStamp, 16);
					(eth.topics[0] == '0x4a52a947455663fbd6ddcc61a4d3a18a7e387c418de430ea8a191956cc53ec79') ? ae[1] = "deposit" :
					(eth.topics[0] == '0xa3bbf8b09a42177fa9310281fb7f2fc8803d7c6df09a82093ea047cb6a222aa3') ? ae[1] = "withdrawal" : ae[1] = 'none';
					ae[2] = findtok('0x'+eth.topics[2].substr(26,40));
					ae[3] = parseInt(eth.data, 16)/10**(finddec('0x'+eth.topics[2].substr(26,40)));
					ae[4] = '0x'+eth.topics[1].substr(26,40);
					(ae[1] != 'none') ? vm.transfers.push(ae) : {};
				}
			}
			vm.transfers.sort(function (a, b) { return b[0] - a[0] })
			document.getElementById('tload').innerHTML = "TRANSFERS";	
	}
},

// Save Neo address in local storage
mounted() {

	if (localStorage.addresses) {	
     this.addresses = JSON.parse(localStorage.addresses);   
	};
	if (localStorage.tabn) {	
		this.tabn = localStorage.tabn; 
	   }
	
},

computed: {
    animatedNumber: function() {
      return this.tweenedNumber.toFixed(8);
		}
  },

watch: {
	addresses(newaddresses) {
	const  parsed = JSON.stringify(newaddresses);
	localStorage.addresses = parsed
	},

	tabn(newtabn) {
		localStorage.tabn = newtabn
		},
	
	number: function(newValue) {
      TweenLite.to(this.$data, 1, { tweenedNumber: newValue });
    }
},


})



