/* required Vue
 * required hash.js
 * get balances
 * and save address in local storage
 */
var vm = new Vue({
el: '#api',
data: {
address: "",
results: [],
tokens: [],
contract: "&contract_hashes[]=91b83e96f2a7c4fdf0c1688441ec61986c7cae26&contract_hashes[]=01bafeeafe62e651efc3a530fde170cf2f7b09bd&contract_hashes[]=0ec5712e0f7c63e4b0fea31029a28cea5e9d551f",
},

//Request data API
methods: {
    request: 
		function (event) {
			document.getElementById('txt').innerHTML = ""; //delete alert message
			var data;
			var addr = decode(vm.address);
			var url = "https://api.switcheo.network/v2/balances?addresses="+addr+vm.contract;
			var urll = "https://api.switcheo.network/v2/exchange/tokens"
			vm.results = []; // to update table			
			axios.get(urll).then(function(response) {	   //get json tokens
			vm.tokens = response.data;
				}
			); 
			axios.get(url).then(function(response) {       // get json balances
			vm.results = response.data;
				}
			); 
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

