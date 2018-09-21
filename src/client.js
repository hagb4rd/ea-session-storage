var module=module||{ exports:{}};
var require=require||(()=>{ });
var window=window||global||{};

var storage = (function(require,exports,module,window={}) {
	var fetch=window.fetch||require('node-fetch');

	//var FormData=FomrData||require('form-data');
	var locate=(key)=>`${exports.baseURI}${encodeURIComponent(key)}`
	//exports.baseURI='https://expressRouting--hagb4rd.repl.co/storage/';
	exports.baseURI= window.location?window.location.href:'http://localhost:5555/storage/';
	exports.getItem = (key) => fetch(locate(key)).then(resp=>resp.text()).then(resp=>{
		try {
			var body = JSON.parse(resp);
		} catch(e) {
			throw new Error("Cannot parse response: "+resp);
		}
		if(body.ok) {
			return body.data;
		} else {
			return null;
		}
	});

	exports.setItem = (key,payload) => {
			//var formData=new FormData();
			//formData.append("data", JSON.stringify(payload))
			return fetch(locate(key), {
				method: "POST",
				//headers: {"content-type":"multipart/form-data"},
				headers: {"Content-Type": "application/json; charset=utf-8"},
				body: JSON.stringify(payload)
			})
			.then(resp=>resp.text())
			.then(resp=>{
				try {
					var body = JSON.parse(resp);
				} catch(e) {
					throw new Error("Cannot parse response: "+resp);
				}
				if(body.ok) {
					return body.data;
				} else {
					throw new Error(body.data);
				}
			})
	}
	return exports;
})(require, module.exports, module, window)