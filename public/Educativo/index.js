console.log('I made it');
var info = {
	id : 4,
	name : 'Camila',
	age : 6
};
axios.post('/example',{
		params:info
	})
		.then(function(res){
			//handle success
			console.log(res.data);
		})
		.catch(function(error){
			console.log(error);
		})