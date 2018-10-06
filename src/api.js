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
contract: "91b83e96f2a7c4fdf0c1688441ec61986c7cae26"
},
//Request data API
methods: {
    request: 
		function (event) {
			this.results = [];
			document.getElementById('txt').innerHTML = "";
			var addr = decode(vm.address);
			var url ="https://api.switcheo.network/v2/balances?addresses="+addr+"&contract_hashes="+vm.contract;
			axios.get(url).then(response => {this.results = response.data});   
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
  
});

