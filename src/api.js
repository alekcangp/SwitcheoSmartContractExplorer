/* required Vue
 * required hash.js
 * get balances
 * and save address in local storage
 */
 
window.onload = function() {
		setTimeout(timing, 500); // set dex balance on gauge 0, waiting load canvas
		setInterval(timing, 60000); 
		setTimeout(bestblocks(monitor), 100); //found best block
		setInterval(monitor, 30000);
		setInterval(bestblocks, 5000); // get best block
		setInterval(setgauge, 5000) // gauge 2 status
}
 
// SET FEES

var trig = 1;
async function feeVolume (x) {
	
	if (vm.tabn == 'fee' && trig == 0 && x == 0)  { return } ; //run only first time for click on tab
	
	document.getElementById("fee").innerHTML = "<img src='./img/load.gif'>";
var wps = [];	
var mps = [];
var dps = [];
var chart = new CanvasJS.Chart("chartContainer", {
	theme: "dark2",
	animationEnabled: true,
	zoomEnabled: true,
	//zoomType: "xy",
	exportEnabled: true,
	 backgroundColor: "#212A3F",
	 
	title: {
		margin: 50,
		text: " "
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

	if (vm.fees == '') {
			try {
				await axios.get("https://api.switcheolytics.tech/switcheo/fee/amount/graph").then(function(response) {	 
				vm.fees = response.data; 
				});
			} 
			catch (e) {document.getElementById('errfee').innerText = 'API is unreachable!'}
	};
	
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
		dps.push({
			x: time,
			y: resul[i].fee_amount
		});
	};
	
	chart.render();
	document.getElementById("fee").innerHTML = "FEES";
	trig =0;
};


 //get  tokens
axios.get("https://api.switcheo.network/v2/exchange/tokens").then(function(response) {	  
		vm.tokens = response.data; 						
		vm.tokens.SWH = {"hash":"78e6d16b914fe15bc16150aeb11d0c2a8e532bdd","decimals":8};	 //add SWH old token
		vm.tokens.ONT = {"hash":"ceab719b8baa2310f232ee0d277c061704541cfb","decimals":8};	 //add ONT nep-5 token
		
	}); 

	
var addr20 = "AKJQMHma9MA8KK5M8iQg8ASeg3KZLsjwvB"; //address neo v2 contract
var addr15 = "AZ1QiX5nqgm8dsUY7iRyafKwmKnGP9bUhN"; //address neo v1.5 contract
var addr10 = "AJdZA4UftshLwVAS4YAc9k274GmwDmkJgj";	//address neo v1 contract	
var mt = [], ms = [], mb = [], ma = [];

// set dex balance in gauge

async function timing() {
	var addrneo = [];
	(vm.contr == "v20") ? addrneo[0] = addr20 : 
			(vm.contr == "v15") ? addrneo[0] = addr15 : 
			(vm.contr == "v10") ? addrneo[0] = addr10 : addrneo = [addr20, addr15, addr10];			
	
	await axios.get("https://api.switcheo.network/v2/tickers/last_price").then(function (response) { // get tokens price
	vm.prices = response.data;
	});
	
	var amo = 0
	for (var v of addrneo) {

		await axios.get("https://api.neoscan.io/api/main_net/v1/get_balance/"+v).then(function (response) {
		var bal = response.data.balance;

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
		};
		
		});
	};	
	gauges[0].value = amo * 0.001               
};


// VUE modules

var vm = new Vue({
el: '#api',
data: {
diff1: -120,
diff2: -120,	
diff3: -120,
diff4: -120,
diff5: -120,

counter1: -1,
counter2: -1,
counter3: -1,
counter4: -1,
counter5: -1,
bestb: [],

results: {},
tokens: {},
contr: "v20",
tabn: "status",
uhistory: {},
xaddress: "",
orders: {},
volume: [],
prices: [],
addresses: [],
check: [],
fees: '',
selected: 'SWTH',

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
	volumed: function (k1, k2, t1, t2, pr, amt, side) {
		
		if (ms[k1] == null) {ms[k1] = 0};
		if (ms[k2] == null) {ms[k2] = 0};
		if (mb[k1] == null) {mb[k1] = 0};
		if (mb[k2] == null) {mb[k2] = 0};
		mt[k1] = t1;
		mt[k2] = t2;
		
		ms[k1] = ms[k1] + amt*0.00000001;
		if (t2 == 'NEO') {mb[k2] = mb[k2] + amt*0.00000001*pr;} 
		else if (t2 == 'GAS' && side =='sell') {mb[k2] = mb[k2] + amt*0.00000001*pr;} 
		else if (t2 == 'SWTH' && side =='sell') {mb[k2] = mb[k2] + amt*0.00000001*pr;} else {mb[k2] = mb[k2] + amt*0.00000001/pr;}
		
		},
				
	
    request: 
		async function (event) {
			
			timing();//set dex balance	
		
			// set gauge contract
			(vm.contr == 'All') ? gauges[1].value =0 : (vm.contr == 'v20') ? gauges[1].value =270 : 
			(vm.contr == 'v15') ? gauges[1].value = 180 : gauges[1].value = 90
									
			//Neo address validation
			for (address of vm.addresses) {
				if (address.length === 0) { continue };
				for (i = 0; i < address.length; i++) {
					var c = address[i];			
					if (!(c in ALPHABET_MAP) || address[0] != "A" || address.length !=34) 
					{ alert("Incorrect NEO address is detected!"); return []}			 
				};
			};

			var contract20 = "91b83e96f2a7c4fdf0c1688441ec61986c7cae26";
			var contract15 = "01bafeeafe62e651efc3a530fde170cf2f7b09bd";
			var contract10 = "0ec5712e0f7c63e4b0fea31029a28cea5e9d551f";
			var u = "&contract_hashes[]="
			var ua = "&addresses[]="
			
			
			if ((vm.addresses.filter(word => word != '')).length > 0)  {
				document.getElementById('bload').innerHTML = "<img src='./img/load.gif'>";
				document.getElementById('tload').innerHTML = "<img src='./img/load.gif'>";
				document.getElementById('vload').innerHTML = "<img src='./img/load.gif'>";			
				document.getElementById('oload').innerHTML = "<img src='./img/load.gif'>";	
			} else {return;}
			
// BALANCE section			
							
			vm.results = [];	
			var contract = "";
			vm.results = {}; // to update table				
			vm.contr == "All" ? (contract = u+contract20+u+contract15+u+contract10) : vm.contr == "v20" 
			? contract = u+contract20 : vm.contr == "v15" 
			? contract = u+contract15 : contract = u+contract10;						
			var addrb = decode(vm.addresses[0]);
			
			for (i = 1; i < (vm.addresses.filter(word => word != '')).length; ++i) {
			var addrb = addrb + ua + decode(vm.addresses[i]); 
			};
			var urlb = "https://api.switcheo.network/v2/balances?addresses[]="+addrb+contract;

			axios.get(urlb).then(function(response) {       // get json balance				
			vm.results = response.data; 
			document.getElementById('bload').innerHTML = "BALANCE";		
				}			
			); 
			
			
				
// TRANSFERS section		
					
			vm.uhistory = [];	
			var x = 0, urlhx = []
			
			for (j = 0; j < (vm.addresses.filter(word => word != '')).length; ++j) {
			
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
						await axios.get(url+1).then(function (response) {
						pages = response.data.total_pages;
							});							
							for (var i = 1; i <= pages; ++i) {
								urlhx[x] = axios.get(url+(i));
								x += 1;
							};
					};	
			};	
			
				axios.all(urlhx).then(function (response) {			// get json history	
				vm.uhistory = response;
				document.getElementById('tload').innerHTML = "TRANSFERS";
					});							
				
// ORDERS  section
			mt = []; ms = []; mb = []; ma = [];	
			vm.orders = [];
			var contract = [];		
			(vm.contr == "All") ? contract = [contract20, contract15, contract10] : vm.contr == "v20" 
			? contract = [contract20] : (vm.contr == "v15") 
			? contract = [contract15] : contract = [contract10];

			
			
			//var addrb = decode(vm.addresses[0]);
			var ourl = [], ourlx = [], k = 0
			for (i = 1; i <= (vm.addresses.filter(word => word != '')).length; ++i) {
			var addrb = decode(vm.addresses[i-1]);
			
			
						
					for (var j = 0; j < contract.length; ++j) {
						var ourl = "https://api.switcheo.network/v2/orders?address="+addrb+"&contract_hash="+contract[j]+"&limit=200";
						ourlx[k] = axios.get(ourl); 
						k += 1
					};
			};
			
			 await axios.all(ourlx).then(function (response) {			// get json orders	
			vm.orders = response; vm.volume = response;
			document.getElementById('oload').innerHTML = "ORDERS";
			document.getElementById('vload').innerHTML = "VOLUME";			
			});
			vm.volume = [];	//set volume in null after display data	
									
	}
},

// Save Neo address in local storage
mounted() {

	if (localStorage.addresses) {	
     this.addresses = JSON.parse(localStorage.addresses);   
	}

		
	
},
watch: {

	addresses(newaddresses) {
	const  parsed = JSON.stringify(newaddresses);
	localStorage.addresses = parsed
    }		
}
})

