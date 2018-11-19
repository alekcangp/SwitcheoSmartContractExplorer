	
	// monitoring status
	function monitor () {

		mon1();
		mon2();
		mon3();
		mon4();
		mon5();
		//setInterval(setgauge, 5000)
		
	async function mon1() {
		
			try {
				document.getElementById("s1").innerHTML = "<img src='./img/load.gif'>"
			await neo.node('https://seed1.switcheo.network:10331').getVersion().then(function (result) {
				document.getElementById('ver1').innerText =  result.useragent;	
				if (vm.trig[0] <= 0) {  node1();} else document.getElementById('s1').innerText =  '';	
			}); 	
			
		} catch(e) {
			document.getElementById('nod1').style.color = "red";
			document.getElementById('ver1').innerText = "unreachable"; 
			vm.trig[0] = 0;
			document.getElementById("s1").innerHTML = ""
			}			
	}
		
	async function mon2() {
		try {
			document.getElementById("s2").innerHTML = "<img src='./img/load.gif'>"
			await neo.node('https://seed2.switcheo.network:10331').getVersion().then(function (result) {
				document.getElementById('ver2').innerText =  result.useragent;
				if (vm.trig[1] <= 0) { node2();} else document.getElementById('s2').innerText =  '';
			});
						 
		} catch(e) {
			document.getElementById('nod2').style.color = "red";
			document.getElementById('ver2').innerText = "unreachable"; 
			vm.trig[1] = 0;
			document.getElementById("s2").innerHTML = ""
		}					
	}

	async function mon3() {

		try {
			document.getElementById("s3").innerHTML = "<img src='./img/load.gif'>"
			await neo.node('https://seed3.switcheo.network:10331').getVersion().then(function (result) {
				document.getElementById('ver3').innerText =  result.useragent;
				if (vm.trig[2] <= 0) {  node3(); } else document.getElementById('s3').innerText =  '';
			 }); 
			
		} catch(e) { 
			document.getElementById('nod3').style.color = "red";
			document.getElementById('ver3').innerText = "unreachable"; 
			vm.trig[2] = 0;
			document.getElementById("s3").innerHTML = ""
			}
	}

	async function mon4() {
		try {
			document.getElementById("s4").innerHTML = "<img src='./img/load.gif'>"
			await neo.node('https://seed4.switcheo.network:10331').getVersion().then(function (result) {
				document.getElementById('ver4').innerText =  result.useragent;
				if (vm.trig[3] <= 0) {node4();} else document.getElementById('s4').innerText =  '';
			}); 
						
		} catch(e) {
			document.getElementById('nod4').style.color = "red"; 
			document.getElementById('ver4').innerText = "unreachable";
			vm.trig[3] = 0;
			document.getElementById("s4").innerHTML = ""
			}
		}

	async function mon5() {

		try {
			document.getElementById("s5").innerHTML = "<img src='./img/load.gif'>"
			await neo.node('https://seed5.switcheo.network:10331').getVersion().then(function (result) {
				document.getElementById('ver5').innerText =  result.useragent;
				if (vm.trig[4] <= 0) { node5();} else document.getElementById('s5').innerText =  '';
			}); 			
			
		} catch(e) {
			document.getElementById('nod5').style.color = "red"; 
			document.getElementById('ver5').innerText = "unreachable";
			vm.trig[4] = 0;
			document.getElementById("s5").innerHTML = ""
			}
	}				
};


// set gauge 2	
function setgauge () {
		try {
			var avg = [];	
			var sum = 0;
			for (var i = 0; i < 5; ++i) {
				
				if (vm.trig[i] == 0) {vm.diff[i] = -120; }
				if (vm.diff[i] == 'Infinity') {vm.diff[i] = 0;}
				avg[i] = (vm.diff[i] - vm.counter[i]/30 - vm.mem[i]/50);
				if (avg[i] < -120) avg[i] = -120;
				sum += avg[i];
				};				
			var res = 120 + sum/5; 
				
			if (res > 120) res = 120;
		} catch(e) {res = 0; }			
				
		gauges[2].value = res;
};
 
var st1 = 0, st2 = 0, st3 = 0, st4 = 0, st5 = 0; // start only one time

// NODE 1
async function node1 () {
	vm.trig[0] = 1; 
		var  hei = 0, time, ago, peers = '';
		var url = "https://seed1.switcheo.network:10331";
		
		var pollingPolicy = neo.service.createPollingPolicy(5000);


			neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
			if (hei != result-1) {
				vm.counter[0] = -1; hei = result-1; 
			}	
		  });

			
			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;				
			});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				vm.mem[0] = result.length;				
			  });	

			await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
			}); 

			await neo.node(url).getBlock(bhash, 1).then(function (result) {
			time = result.time;
			 }); 
				  
		var x = moment().unix();
		var y = time;
		ago = x - y;

		vm.counter[0] = ago;

		if (st1 == 0) { st1 = 1; // should run only one time 
			setInterval(differ,1000);	
		}	

		function differ () { //print data
			
			vm.diff[0] = hei -  vm.bestb; 
			if (vm.diff[0] == 1) {vm.diff[0] = 0}
			document.getElementById('height1').innerText = hei + ' (' + vm.diff[0] + ')'; // current block
			document.getElementById('count1').innerText =  (++vm.counter[0]) + " s ago"; //timer
			if (vm.trig[0] != 0) {
				if (vm.diff[0] < -3 || vm.counter[0] > 120 || vm.mem[0] > 200 || peers == 0) {document.getElementById('nod1').style.color = "orange"} 
				else  {document.getElementById('nod1').style.color = "limegreen"}
				document.getElementById('peers1').innerText =  peers;
				document.getElementById('mem1').innerText =  vm.mem[0]; // mempool		
			} else document.getElementById('peers1').innerText =  0
		}
		
		
			document.getElementById("s1").innerHTML = ""
						 
};
		
// NODE 2
async function node2 () {
	vm.trig[1] = 1; 
		var  hei = 0, time, ago, peers = '';
		var url = "https://seed2.switcheo.network:10331";
		
		var pollingPolicy = neo.service.createPollingPolicy(5000);


			neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
			if (hei != result-1) {
				vm.counter[1] = -1; hei = result-1; 
			}	
		  });

			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;				
			});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
			vm.mem[1] = result.length;				
			});	

			await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
			 }); 

			await neo.node(url).getBlock(bhash, 1).then(function (result) {
			time = result.time;
			 }); 
				  
		var x = moment().unix();
		var y = time;
		ago = x - y;

		vm.counter[1] = ago;

		if (st2 == 0) { st2 = 1; // should run only one time 
			setInterval(differ,1000);	
		}

		function differ () { //print data
			
			vm.diff[1] = hei -  vm.bestb; 
			if (vm.diff[1] == 1) {vm.diff[1] = 0}
			document.getElementById('height2').innerText = hei + ' (' + vm.diff[1] + ')'; // current block
			document.getElementById('count2').innerText =  (++vm.counter[1]) + " s ago"; //timer
			
			if (vm.trig[1] != 0) {
				if (vm.diff[1] < -3 || vm.counter[1] > 120 || vm.mem[1] > 200 || peers == 0) {document.getElementById('nod2').style.color = "orange"} 
				else  {document.getElementById('nod2').style.color = "limegreen"}
				document.getElementById('mem2').innerText =  vm.mem[1]; // mempool
				document.getElementById('peers2').innerText =  peers;					
			} else document.getElementById('peers2').innerText =  0
		}

		document.getElementById("s2").innerHTML = ""		 
};
		
// NODE 3		
async function node3 () {
	vm.trig[2] = 1; 
		var  hei = 0, time, ago, peers = '';
		var url = "https://seed3.switcheo.network:10331";
		
		var pollingPolicy = neo.service.createPollingPolicy(5000);


			neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
			if (hei != result-1) {
				vm.counter[2] = -1; hei = result-1; 
			}	
		  });
			  
			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;				
			});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				vm.mem[2] = result.length;				
			});	

			await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
			}); 

			await neo.node(url).getBlock(bhash, 1).then(function (result) {
			time = result.time;
			 }); 
				  
		var x = moment().unix();
		var y = time;
		ago = x - y;

		vm.counter[2] = ago;

		if (st3 == 0) { st3 = 1; // should run only one time 
			setInterval(differ,1000);	
		}	

		function differ () { //print data		
			vm.diff[2] = hei -  vm.bestb; 
			if (vm.diff[2] == 1) {vm.diff[2] = 0}
			document.getElementById('height3').innerText = hei + ' (' + vm.diff[2] + ')'; // current block
			document.getElementById('count3').innerText =  (++vm.counter[2]) + " s ago"; //timer
			if (vm.trig[2] != 0) {
				if (vm.diff[2] < -3 || vm.counter[2] > 120 || vm.mem[2] > 200 || peers == 0) {document.getElementById('nod3').style.color = "orange"} 
				else  {document.getElementById('nod3').style.color = "limegreen"}
				document.getElementById('peers3').innerText =  peers;
				document.getElementById('mem3').innerText =  vm.mem[2]; // mempool	
				
			} else document.getElementById('peers3').innerText =  0
		}	

		document.getElementById("s3").innerHTML = ""	 
};

// NODE 4
async function node4 () {
	vm.trig[3] = 1; 
		var  hei = 0, time, ago, peers = '';
		var url = "https://seed4.switcheo.network:10331";
		
		var pollingPolicy = neo.service.createPollingPolicy(5000);


			neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
			if (hei != result-1) {
				vm.counter[3] = -1; hei = result-1; 
			}	
		  });
		  
			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;				
			});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				vm.mem[3] = result.length;				
			});	

			await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
			 }); 

			await neo.node(url).getBlock(bhash, 1).then(function (result) {
			time = result.time;
			 }); 
				  
		var x = moment().unix();
		var y = time;
		ago = x - y;

		vm.counter[3] = ago;

		if (st4 == 0) { st4 = 1; // should run only one time 
			setInterval(differ,1000);	
		}	

		function differ () { //print data		
			vm.diff[3] = hei -  vm.bestb; 
			if (vm.diff[3] == 1) {vm.diff[3] = 0}
			document.getElementById('height4').innerText = hei + ' (' + vm.diff[3] + ')'; // current block
			document.getElementById('count4').innerText =  (++vm.counter[3]) + " s ago"; //timer

			if (vm.trig[3] != 0) {
				if (vm.diff[3] < -3 || vm.counter[3] > 120 || vm.mem[3] > 200 || peers == 0) {document.getElementById('nod4').style.color = "orange";}
				else  {document.getElementById('nod4').style.color = "limegreen"}
				document.getElementById('peers4').innerText =  peers;
				document.getElementById('mem4').innerText =  vm.mem[3]; // mempool	
				
			} else document.getElementById('peers4').innerText =  0
		}	

		document.getElementById("s4").innerHTML = ""			 
};

// NODE 5
async function node5 () {
	vm.trig[4] = 1; 
		var  hei = 0, time, ago, peers = '', ver = '';
		var url = "https://seed5.switcheo.network:10331";
		
		var pollingPolicy = neo.service.createPollingPolicy(5000);


			neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
			if (hei != result-1) {
				vm.counter[4] = -1; hei = result-1; 
			}	
		  });

			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;				
			});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				vm.mem[4] = result.length;				
			});	

			await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
			}); 

			await neo.node(url).getBlock(bhash, 1).then(function (result) {
			time = result.time;
			}); 
				  
		var x = moment().unix();
		var y = time;
		ago = x - y;

		vm.counter[4] = ago;

		if (st5 == 0) { st5 = 1; // should run only one time 
			setInterval(differ,1000);	
		}	

		function differ () { //print data		
			vm.diff[4] = hei -  vm.bestb; 
			if (vm.diff[4] == 1) {vm.diff[4] = 0}
			document.getElementById('height5').innerText = hei + ' (' + vm.diff[4] + ')'; // current block
			document.getElementById('count5').innerText =  (++vm.counter[4]) + " s ago"; //timer

			if (vm.trig[4] != 0) {
				if (vm.diff[4] < -3 || vm.counter[4] > 120 || vm.mem[4] > 200 || peers == 0) {document.getElementById('nod5').style.color = "orange"} 
				else  {document.getElementById('nod5').style.color = "limegreen"}
				document.getElementById('peers5').innerText =  peers;
				document.getElementById('mem5').innerText =  vm.mem[4]; // mempool	
				
			} else document.getElementById('peers5').innerText =  0
		}	

		document.getElementById("s5").innerHTML = ""			 
};
				
