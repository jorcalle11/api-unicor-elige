var minusculas =['a','b','c','d','e','f','g','h','i','j','k','l','m','n','ñ','o','p','q','r','s','t','u','v','w','y','z'];
var mayusculas =['A','B','C','D','E','F','G','H','I','J','K','L','M','N','Ñ','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var numero = ['0','1','2','3','4','5','6','7','8','9'];

function random (array){
	var numPosibilidades = array.length-1;
	var aleatorio = Math.random()* numPosibilidades;
	aleatorio = Math.round(aleatorio);
	return array[aleatorio];
};

exports.generatePassword = function(){
	var longPassword = 5;
	var password = random(mayusculas);
	for (var i = 0; i < longPassword; i++) {
		password+= random(minusculas);
	};
	password+=random(numero);
	return password;
}
