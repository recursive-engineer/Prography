var i=0;
$("#btn").on("click", async function () {
	var text = document.getElementById("text");
	if(i==0){
		text.textContent = "change the world!";
	}else if(i==1){
		text.textContent = "hello,world!";
	}
	i++;
	if(i>=2){
		i=0;
	}
	console.log(i);
});