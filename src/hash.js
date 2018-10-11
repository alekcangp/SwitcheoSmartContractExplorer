//NEO Address to ScriptHash
 // Neo address validation and Base58 decoding

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
var ALPHABET_MAP = {}
for(var i = 0; i < ALPHABET.length; i++) {
ALPHABET_MAP[ALPHABET.charAt(i)] = i
}
var BASE = 58
 
function decode(string) { 
  if (string.length === 0) return []
  var i, j, bytes = [0]
  for (i = 0; i < string.length; i++) {
    var c = string[i]
  
		
	
    for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
    bytes[0] += ALPHABET_MAP[c]
 
    var carry = 0
    for (j = 0; j < bytes.length; ++j) {
      bytes[j] += carry
 
      carry = bytes[j] >> 8
      bytes[j] &= 0xff
    }
 
    while (carry) {
      bytes.push(carry & 0xff)
 
      carry >>= 8
    }
  }
 
  // deal with leading zeros
  for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0)
 
  var arr = bytes.reverse()

 
 //DEC to HEX
	
	var res = ''
  for (let i = 0; i < arr.length; i++) {
    let str = arr[i].toString(16)
    str = str.length === 0 ? '00'
      : str.length === 1 ? '0' + str
        : str
    res += str	
	};
		
// reverse HEX		
var hex = res.substr(2,40)
var hash = ''
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    hash += hex.substr(i, 2)
  };
  
  return hash 
};	