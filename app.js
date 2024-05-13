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

		//initial colorize sliders

		const color = chroma(randomColor);
		const sliders = div.querySelectorAll('.sliders input');
		const hue = sliders[0];
		const brightness = sliders[1];
		const saturation = sliders[2];

		colorizeSliders(color, hue, brightness, saturation);
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

function colorizeSliders(color, hue, brightness, saturation) {

	//scale saturation

	const noSat = color.set('hsl.s', 0);
	const fullSat = color.set('hsl.s', 1);
	const scaleSat = chroma.scale([noSat,color,fullSat]);

	//scale brightness

	const midBright = color.set('hsl.s', 0.5);
	const scaleBritght = chroma.scale(["black", midBright, "white"]);

	//scale hue


	//update input colors

	saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
	brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBritght(0)},${scaleBritght(0.5)}, ${scaleBritght(1)})`;
	hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`;
}

randomColors();