var btnTest = document.getElementById('btnTest');
var txtMessage = document.getElementById('message');
var info = {
	name : 'Yessy',
	age : 21,
	number : 5678
};

btnTest.addEventListener('click', e => {
	axios.post('/canales',{
		params:info
	})
		.then(function(res){
			//handle success
			console.log(res.data);
			txtMessage.innerHTML = res.data['OK'];
		})
		.catch(function(error){
			console.log(error);
			txtMessage.innerHTML = res.data['error'];
		})
});