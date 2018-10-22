
// set value gauge


	node1();
	node2();
	node3();
	node4();
	node5();
	setgauge(4000);
	

function setgauge(t) {
	
	setTimeout(setg, t)
	
};

function setg () {
	
	var avg = [vm.diff1, vm.diff2, vm.diff3, vm.diff4, vm.diff5];
				//if (avg[0] === null) {document.getElementById('nod1').innerText = "unreachable"} 
				//if (avg[1] === null) {document.getElementById('nod2').style.color = "red"}
				//if (avg[2] === null) {document.getElementById('nod3').style.color = "red"}
				//if (avg[3] === null) {document.getElementById('nod4').style.color = "red"}
				//if (avg[4] === null) {document.getElementById('nod5').style.color = "red"}
	
				var sum = 0;
				for (var i = 0; i < 5; ++i) {
					
				if (avg[i] < -3) avg[i] =  avg[i]*2;
				if (avg[i] === null || avg[i] < -120) avg[i] = -120;
				sum += avg[i];
				};				
				var res = 120+sum/5;
				gauges[2].value = res;
};

var urlb = "https://seed1.neo.org:10331"	

async function node1 () {
	
	//get second ago last block node 1
		
		var block, height, time, ago, peers, mem, ver, best, a;
		var url = "https://seed1.switcheo.network:10331";
		
		await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
		}); 
		await neo.node(url).getBlock(bhash, 1).then(function (result) {
			height =  result.index; time = result.time;
		});  
		var x = moment().unix();
		var y = time;
		ago = x - y;

        var pollingPolicy = neo.service.createPollingPolicy(1000);
		
        var counter = ago;

        setInterval((function () {
				
            document.getElementById('count1').innerText =  (++counter) + " s ago"; 
				
		}),1000);
			

            neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
				if (height != result-1) {
					counter = -1; height = result-1; setgauge(1000);
				};
				document.getElementById('height1').innerText =  height + ' (' + vm.diff1 + ')';
          	});
				  
			neo.node(urlb).poll(pollingPolicy).getBlockCount().notify(function (result) {
				 best = result; vm.diff1 = height - best + 1;
				 if (vm.diff1 === null) {document.getElementById('nod1').style.color = "red"} 
				else if (vm.diff1 < -3) {document.getElementById('nod1').style.color = "orange"} 
				else {document.getElementById('nod1').style.color = "limegreen"}
				
				
          	});	  
			
						

			neo.node(url).poll(pollingPolicy).getVersion().notify(function (result) {
				var ver = result.useragent;
				document.getElementById('ver1').innerText =  ver;
			});	  
				  
			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;
				document.getElementById('peers1').innerText =  peers;
			});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				mem = result;
				document.getElementById('mem1').innerText =  mem.length;
          	});	
 
				 
};
		

async function node2 () {

		//get seconds ago last block node
		
		var block, height, time, ago, peers, mem, ver, best;
		var url = "https://seed2.switcheo.network:10331"
		
		 await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
		 }); 
		 await neo.node(url).getBlock(bhash, 1).then(function (result) {
			height =  result.index; time = result.time;
		  });  
		var x = moment().unix();
		var y = time;
		ago = x - y;

        var pollingPolicy = neo.service.createPollingPolicy(1000);

        var counter = ago;
			
           setInterval((function () {	
                document.getElementById('count2').innerText = (++counter) + " s ago"; 
            }), 1000);
			
            neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
				if (height != result-1) {
					counter = -1; height = result-1; setgauge(1000);
				};
				 document.getElementById('height2').innerText = height + ' (' + vm.diff2 + ')';

          	});
				  
  
			neo.node(urlb).poll(pollingPolicy).getBlockCount().notify(function (result) {
				best = result; vm.diff2 = height - best+1;
				if (vm.diff2 === null) {document.getElementById('nod2').style.color = "red"} 
				else if (vm.diff2 < -3) {document.getElementById('nod2').style.color = "orange"} 
				else {document.getElementById('nod2').style.color = "limegreen"}
          	});
				  

			neo.node(url).poll(pollingPolicy).getVersion().notify(function (result) {
				var ver = result.useragent;
				document.getElementById('ver2').innerText = ver;
          	});	  
				  
			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;
				document.getElementById('peers2').innerText =  peers;
          	});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				mem = result;
				document.getElementById('mem2').innerText =  mem.length;
          	});					  		 
				 
};
		
		
async function node3 () {

		//get seconds ago last block node
		
		var block, height, time, ago, peers, mem, ver, best;
		var url = "https://seed3.switcheo.network:10331"
		
		 await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
		 }); 
		 await neo.node(url).getBlock(bhash, 1).then(function (result) {
			height =  result.index; time = result.time;
		  });  
		var x = moment().unix();
		var y = time;
		ago = x - y;

        var pollingPolicy = neo.service.createPollingPolicy(1000);

        var counter = ago;
			
           setInterval((function () {	
                document.getElementById('count3').innerText = (++counter) + " s ago"; 
            }), 1000);
			
            neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
				if (height != result-1) {
					counter = -1; height = result-1; setgauge(1000);
				};
				 document.getElementById('height3').innerText = height + ' (' + vm.diff3 + ')';

          	});
				  
  
			neo.node(urlb).poll(pollingPolicy).getBlockCount().notify(function (result) {
				best = result; vm.diff3 = height - best+1;
				if (vm.diff3 === null) {document.getElementById('nod3').style.color = "red"} 
				else if (vm.diff3 < -3) {document.getElementById('nod3').style.color = "orange"}
				else {document.getElementById('nod3').style.color = "limegreen"}
          	});
				  

			neo.node(url).poll(pollingPolicy).getVersion().notify(function (result) {
				var ver = result.useragent;
				document.getElementById('ver3').innerText = ver;
          	});	  
				  
			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;
				document.getElementById('peers3').innerText =  peers;
          	});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				mem = result;
				document.getElementById('mem3').innerText =  mem.length;
          	});					  		 
				 
};

async function node4 () {

		//get seconds ago last block node
		
		var block, height, time, ago, peers, mem, ver, best;
		var url = "https://seed4.switcheo.network:10331"
		
		 await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
		 }); 
		 await neo.node(url).getBlock(bhash, 1).then(function (result) {
			height =  result.index; time = result.time;
		  });  
		var x = moment().unix();
		var y = time;
		ago = x - y;

        var pollingPolicy = neo.service.createPollingPolicy(1000);

        var counter = ago;
			
           setInterval((function () {	
                document.getElementById('count4').innerText = (++counter) + " s ago"; 
            }), 1000);
			
            neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
				if (height != result-1) {
					counter = -1; height = result-1; setgauge(1000);
				};
				 document.getElementById('height4').innerText = height + ' (' + vm.diff4 + ')';

          	});
				  
  
			neo.node(urlb).poll(pollingPolicy).getBlockCount().notify(function (result) {
				best = result; vm.diff4 = height - best+1;
				if (vm.diff4 === null) {document.getElementById('nod4').style.color = "red"} 
				else if (vm.diff4 < -3) {document.getElementById('nod4').style.color = "orange"}
				else {document.getElementById('nod4').style.color = "limegreen"}
          	});
				  

			neo.node(url).poll(pollingPolicy).getVersion().notify(function (result) {
				var ver = result.useragent;
				document.getElementById('ver4').innerText = ver;
          	});	  
				  
			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;
				document.getElementById('peers4').innerText =  peers;
          	});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				mem = result;
				document.getElementById('mem4').innerText =  mem.length;
          	});					  		 
				 
};	


async function node5 () {

		//get seconds ago last block node
		
		var block, height, time, ago, peers, mem, ver, best;
		var url = "https://seed5.switcheo.network:10331"
		
		 await neo.node(url).getBestBlockHash().then(function (result) {
			bhash = result	
		 }); 
		 await neo.node(url).getBlock(bhash, 1).then(function (result) {
			height =  result.index; time = result.time;
		  });  
		var x = moment().unix();
		var y = time;
		ago = x - y;

        var pollingPolicy = neo.service.createPollingPolicy(1000);

        var counter = ago;
			
           setInterval((function () {	
                document.getElementById('count5').innerText = (++counter) + " s ago"; 
            }), 1000);
			
            neo.node(url).poll(pollingPolicy).getBlockCount().notify(function (result) {
				if (height != result-1) {
					counter = -1; height = result-1; setgauge(1000);
				};
				 document.getElementById('height5').innerText = height + ' (' + vm.diff5 + ')';
				
          	});
				  
  
			neo.node(urlb).poll(pollingPolicy).getBlockCount().notify(function (result) {
				best = result; vm.diff5 = height - best+1;
				if (vm.diff5 === null) {document.getElementById('nod5').style.color = "red"} 
				else if (vm.diff5 < -3) {document.getElementById('nod5').style.color = "orange"}
				else {document.getElementById('nod5').style.color = "limegreen"}
          	});
				  

			neo.node(url).poll(pollingPolicy).getVersion().notify(function (result) {
				var ver = result.useragent;
				document.getElementById('ver5').innerText = ver;
          	});	  
				  
			neo.node(url).poll(pollingPolicy).getConnectionCount().notify(function (result) {
				peers = result;
				document.getElementById('peers5').innerText =  peers;
          	});

			neo.node(url).poll(pollingPolicy).getRawMemPool().notify(function (result) {
				mem = result;
				document.getElementById('mem5').innerText =  mem.length;
          	});					  		 
				 
};					
		
		
		