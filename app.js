//Global Selections

const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelectorAll('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll('.color h2');
let initialColors;


//Functions

//Color generator

function generateHex() {

	//Chroma JS

	const hexColor = chroma.random();
	return hexColor;

	//Custom

	// let letters = "#0123456789ABCDEF";
	// let hash = "#";

	// for(let i = 0; i < 6; i++){
	// 	hash += letters[Math.floor(Math.random() * 16)];
	// }
	// return hash;
}



//Random colors

function randomColors(){
	colorDivs.forEach((div, index) => {
		const hexText = div.children[0];
		let randomColor = generateHex();

		//Add color to Background

		div.style.backgroundColor = randomColor;
		hexText.innerHTML = randomColor;

		//checking contrast 

		textContrast(randomColor,hexText);
	});
}

//Text contrast 

function textContrast(color,text){
	const luminance = chroma(color).luminance();

	if (luminance > 0.5) {
		text.style.color = "black";
	} else {
		text.style.color = "white";
	}
}

randomColors();