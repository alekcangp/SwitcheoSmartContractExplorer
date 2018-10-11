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
 
 
var vm = new Vue({
el: '#api',
data: {
address: "",
results: {},
tokens: {},
contr: "v20",
tabn: "balance",
uhistory: {},
xaddress: "",
},

//Request data API
methods: {
	
    request: 
		async function (event) {
									
			//Neo address validation
			if (vm.address.length === 0) { return [] };
			for (i = 0; i < vm.address.length; i++) {
			var c = vm.address[i];
			
			if (!(c in ALPHABET_MAP) || vm.address[0] != "A" || vm.address.length !=34) 
			{ document.getElementById('load').innerHTML = "NEO address is not correct!"; return []}
			 else {document.getElementById('load').innerHTML = "Go"; 
				}
			};
	
		document.getElementById('load').innerHTML = "loading...";
			
// BALANCE section			
			
		if (vm.tabn == "balance") {				
			var contract20 = "&contract_hashes[]=91b83e96f2a7c4fdf0c1688441ec61986c7cae26";
			var contract15 = "&contract_hashes[]=01bafeeafe62e651efc3a530fde170cf2f7b09bd";
			var contract10 = "&contract_hashes[]=0ec5712e0f7c63e4b0fea31029a28cea5e9d551f";			
			
			vm.results = []; // to update table				
			vm.contr == "All" ? (contract = contract20+contract15+contract10) : vm.contr == "v20" 
			? contract = contract20 : vm.contr == "v15" 
			? contract = contract15 : contract = contract10;						
			
			var addrb = decode(vm.address);
			var urlb = "https://api.switcheo.network/v2/balances?addresses="+addrb+contract;

			axios.get(urlb).then(function(response) {       // get json balance				
			vm.results = response.data; 
			document.getElementById('load').innerHTML = "Go";		
				}
				
			); 			
// HISTORY section			
		};  
		if (vm.tabn == "history"){
			
			var addr20 = "AKJQMHma9MA8KK5M8iQg8ASeg3KZLsjwvB";
			var addr15 = "AZ1QiX5nqgm8dsUY7iRyafKwmKnGP9bUhN";
			var addr10 = "AJdZA4UftshLwVAS4YAc9k274GmwDmkJgj";						
			var urlh20 = "https://api.neoscan.io/api/main_net/v1/get_address_to_address_abstracts/"+vm.address+"/"+addr20+"/";
			var urlh15 = "https://api.neoscan.io/api/main_net/v1/get_address_to_address_abstracts/"+vm.address+"/"+addr15+"/";
			var urlh10 = "https://api.neoscan.io/api/main_net/v1/get_address_to_address_abstracts/"+vm.address+"/"+addr10+"/";
			var urlh = [urlh20, urlh15, urlh10];
			var urlhh = [];
			vm.xaddress = vm.address;
			
			vm.uhistory = []; // to update table		

			(vm.contr == "v20") ? urlhh[0] = urlh[0] : 
			(vm.contr == "v15") ? urlhh[0] = urlh[1] : 
			(vm.contr == "v10") ? urlhh[0] = urlh[2] : urlhh = urlh;
					
			 var x = 0, urlhx = [], pages = 1;			
					for (var url of urlhh) {
						await axios.get(url+1).then(function (response) {
						pages = response.data.total_pages;
							});							
							for (var i = 1; i <= pages; ++i) {
								urlhx[x] = axios.get(url+(i));
								x += 1;
							};
					};
							
				axios.all(urlhx).then(function (response) {			// get json history	
				vm.uhistory = response;
				document.getElementById('load').innerHTML = "Go";
					});				
		};
	}
},
// Save Neo address in local storage
mounted() {
	  if (localStorage.address) {
      this.address = localStorage.address;
    }
},
watch: {
    address(newAddress) {
    localStorage.address = newAddress;
    }
}
})

