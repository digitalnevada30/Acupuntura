var btnUpload = document.getElementById('btnUpload');
var btnRead = document.getElementById('btnRead');
var btnLocalUpload = document.getElementById('btnLocalUpload');
var btnLocalRead = document.getElementById('btnLocalRead');

btnUpload.addEventListener('click', e => {
	location.replace('http://127.0.0.1:3000/Educativo');
});

btnRead.addEventListener('click', e => {
	location.replace('http://127.0.0.1:3000/Evaluativo');
});

btnLocalUpload.addEventListener('click', e => {
	var data = {
		name : 'Yayis',
		age : 20,
		number : 5839
	};

	axios.post('/testWrite', {
		params: data
	})
	.then(function(res){
		console.log(res.data);
	})
	.catch(function(error){
		console.log(error);
	})
});

btnLocalRead.addEventListener('click', e => {
	var data = {
		name : 'Yayis'
	};
	axios.get('/testRead', {
		params : data
	})
	.then(function(res){
		console.log(res.data);
	})
	.catch(function(error){
		console.log(error);
	});
});