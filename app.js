//Global Selections

const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelectorAll('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
let initialColors;

//Event Listeners

sliders.forEach(slider => {
	slider.addEventListener("input", hslControls);
});

currentHex.forEach(hex => {
	hex.addEventListener("click", () => {
		copyToClipboard(hex);
	});
});

popup.addEventListener('transitionend', () => {
	const popupBox = popup.children[0];
	popup.classList.remove("active");
	popupBox.classList.remove("active");
});

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

	//Initial Colors
	initialColors = [];

	colorDivs.forEach((div, index) => {
		const hexText = div.children[0];
		let randomColor = generateHex();

		//Add it to array

		initialColors.push(chroma(randomColor).hex());

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
	// Reset
	resetInputs(); 
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

function hslControls(e) {
	const index = e.target.getAttribute("data-bright") || e.target.getAttribute("data-sat") || e.target.getAttribute("data-hue");
	let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');

	const hue = sliders[0];
	const brightness = sliders[1];
	const saturation = sliders[2];
	const bgColor = initialColors[index];

	let color = chroma(bgColor).set('hsl.s', saturation.value).set('hsl.l', brightness.value).set('hsl.h', hue.value);

	colorDivs[index].style.backgroundColor = color;

	//colorize inputs
	colorizeSliders(color, hue, brightness, saturation);
}

function resetInputs() {
	const sliders = document.querySelectorAll(".sliders input");
	sliders.forEach(slider => {
		if (slider.name === "hue") {
			const hueColor = initialColors[slider.getAttribute("data-hue")];
			const hueValue = chroma(hueColor).hsl()[0];
			slider.value = math.floor(hueValue);
		}
		if (slider.name === "brightness") {
			const brightColor = initialColors[slider.getAttribute("data-bright")];
			const brightValue = chroma(brightColor).hsl()[1];
			slider.value = math.floor(brightValue * 100) / 100;
		}
		if (slider.name === "saturation") {
			const satColor = initialColors[slider.getAttribute("data-sat")];
			const satValue = chroma(satColor).hsl()[2];
			slider.value = math.floor(satValue * 100) / 100;
		}
	});
}

function copyToClipboard(hex) {
	const el = document.createElement('textarea');
	el.value = hex.innerText;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	//popup

	const popupBox = popup.children[0];
	popup.classList.add("active");
	popupBox.classList.add("active");
}

randomColors();