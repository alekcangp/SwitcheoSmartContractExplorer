/* required Vue
 * required hash.js
 * get balances
 * and save address in local storage
 */
  

 
axios.get("https://api.switcheo.network/v2/exchange/tokens").then(function(response) {	   //get json tokens
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

results: {},
tokens: {},
contr: "v20",
tabn: "balance",
uhistory: {},
xaddress: "",
orders: {},
volume: [],
prices: [],
addresses: [],
check: [],


},

//Request data API
methods: {
	
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
			
			timing();//set gauge balance	
		
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
				document.getElementById('bload').innerHTML = "loading...";
				document.getElementById('tload').innerHTML = "loading...";
				document.getElementById('vload').innerHTML = "loading...";			
				document.getElementById('oload').innerHTML = "loading...";	
			} else {alert("NEO address is not detected"); return;}
			
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
	setTimeout(timing, 500);// waiting for drawing canavas
	setInterval(timing, 60000); //run timer
},
watch: {

	addresses(newaddresses) {
	const  parsed = JSON.stringify(newaddresses);
	localStorage.addresses = parsed
    }		
}
})

