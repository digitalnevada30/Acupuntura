var btnRead = document.getElementById('btnRead');
var txtName = document.getElementById('txtName');
var lblName = document.getElementById('lblName');
var lblAge = document.getElementById('lblAge');
var lblNumber = document.getElementById('lblNumber');

btnRead.addEventListener('click', e => {
	console.log(txtName.value);
	var data = {name : txtName.value};
	console.log(data);
	axios.get('/getCanal', {
		params:data
	})
	.then(function (res){
		console.log(res.data);
		lblName.innerHTML = res.data.name;
		lblAge.innerHTML = res.data.age;
		lblNumber.innerHTML = res.data.id;
	})
	.catch(function (error){
		console.log(error);
	})
});