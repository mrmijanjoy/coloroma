//Global Selections

const colorDivs = document.querySelectorAll('.color');
const generateBtn = document.querySelector('.generate');
const sliders = document.querySelectorAll('input[type="range"]');
const currentHex = document.querySelectorAll('.color h2');
const popup = document.querySelector('.copy-container');
const adjustButton = document.querySelectorAll('.adjust');
const lockButton = document.querySelectorAll('.lock');
const closeAdjustments = document.querySelectorAll('.close-adjusment');
const sliderContainers = document.querySelectorAll('.sliders');
let initialColors;
let savedPalettes = [];

//Save palette

const saveBtn = document.querySelector(".save");
const submitSave = document.querySelector(".submit-save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector('.save-container');
const saveInput = document.querySelector('.save-container input');
const libraryContainer = document.querySelector('.library-container');
const libraryBtn = document.querySelector('.library');
const closeLibraryBtn = document.querySelector('.close-library');


//Event Listeners

saveBtn.addEventListener("click", openpalette);
closeSave.addEventListener("click", closepalette);
generateBtn.addEventListener("click", randomColors);
libraryBtn.addEventListener("click", openLibrary);
closeLibraryBtn.addEventListener("click", closeLibrary);

sliders.forEach(slider => {
	slider.addEventListener("input", hslControls);
});

colorDivs.forEach((div, index) => {
	div.addEventListener("change", () => {
		updateTextUI(index);
	});
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

adjustButton.forEach((button, index) => {
	button.addEventListener("click", () => {
		openAdjustmentPanel(index);
	});
});

closeAdjustments.forEach((button, index) => {
	button.addEventListener("click", () => {
		closeAdjustmentPanel(index);
	});
});

lockButton.forEach((button, index) => {
	button.addEventListener("click", () => {
		lockLayer(index);
	});
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

		if (div.classList.contains('locked')) {
			initialColors.push(hexText.innerText);
			return;
		} else {
			initialColors.push(chroma(randomColor).hex());
		}

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

	// check buttons
	adjustButton.forEach((button, index) => {
		checkTextContrast(initialColors[index], button);
		checkTextContrast(initialColors[index], lockButton[index]);
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

function openAdjustmentPanel(index) {
	sliderContainers[index].classList.toggle("active");
}
function closeAdjustmentPanel(index) {
	sliderContainers[index].classList.remove("active");
}

// lock feature
function lockLayer(e, index) {
	const lockSVG = e.target.children[0];
	const activeBg = colorDivs[index];
	activeBg.classList.toggle("locked");

	if (lockSVG.classList.contains("fa-lock-open")) {
		e.target.innerHTML = '<i class="fas fa-lock"></i>';
	} else {
		e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
	}
}

function openpalette(e) {
	const popup = saveContainer.children[0];
	saveContainer.classList.add('active');
	popup.classList.add('active');
}

function closepalette(e) {
	const popup = saveContainer.children[0];
	saveContainer.classList.remove('active');
	popup.classList.remove('active');
}

function savePalette(e) {
	saveContainer.classList.remove('active');
	popup.classList.remove('active');
	const name = saveInput.value;
	const colors = [];
	currentHex.forEach(hex => {
		colors.push(hexText.innerText);
	});

	//generate object

	let palleteNr;
	const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
	if (paletteObjects) {
		palleteNr = paletteObjects.length;
	} else {
		palleteNr = savedPalettes.length;
	}


	const palleteObj = {name, colors, nr: palleteNr };
	savedPalettes.push(palleteObj);

	//save to local 

	savetoLocal(palleteObj);
	saveInput.value = "";

	// Generate library

	const  palette = document.createElement("div");
	palette.classList.add("custom-palette");
	const title = document.createElement("h4");
	title.innerText = palleteObj.name;
	const preview = document.createElement("div");
	preview.classList.add("small-preview");
	palleteObj.colors.forEach(smallColor => {
		const smallDiv = document.createElement("div");
		smallDiv.style.backgroundColor = smallColor;
		preview.appendChild(smallDiv);
	});
	const paletteBtn = document.createElement("button");
	paletteBtn.classList.add('pick-palette-btn');
	paletteBtn.classList.add(palleteObj.nr);
	paletteBtn.innerText = "Select";

	paletteBtn.addEventListener("click", e => {
		closeLibrary();
		const paletteIndex = e.target.classList[1];
		initialColors = [];
		savedPalettes[paletteIndex].colors.forEach((color, index) => {
			initialColors.push(color);
			colorDivs[index].style.backgroundColor = color;
			const text = colorDivs[index].children[0];
			checkTextContrast(color, text);
			updateTextUI(index);
		});
		resetInputs();
		// libraryInputUpdate();
	});

	//Append to library
	palette.appendChild(title);
	pallete.appendChild(preview);
	palette.appendChild(paletteBtn);
	libraryContainer.children[0].appendChild(palette);
}

function savetoLocal(palleteObj) {
	let localPalettes;
	if (localStorage.getItem("palettes") === null) {
		localPalettes = [];
	} else {
		localPalettes = JSON.parse(localStorage.getItem("palettes"));
	}
	localPalettes.push(palleteObj);
	localPalettes.setItem("palettes", JSON.stringify(localPalettes));
}

function openLibrary() {
	const popup = libraryContainer.children[0];
	libraryContainer.classList.add('active');
	popup.classList.add('active');
}

function closeLibrary() {
	const popup = libraryContainer.children[0];
	libraryContainer.classList.remove('active');
	popup.classList.remove('active');
}

function getLocal() {
	if (localStorage.getItem('palettes') === null) {
		localPalettes = [];
	} else {
		const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
		savedPalettes = [...paletteObjects]; //Copy of this
		paletteObjects.forEach(paletteObj => {
			const  palette = document.createElement("div");
			palette.classList.add("custom-palette");
			const title = document.createElement("h4");
			title.innerText = palleteObj.name;
			const preview = document.createElement("div");
			preview.classList.add("small-preview");
			palleteObj.colors.forEach(smallColor => {
				const smallDiv = document.createElement("div");
				smallDiv.style.backgroundColor = smallColor;
				preview.appendChild(smallDiv);
			});
			const paletteBtn = document.createElement("button");
			paletteBtn.classList.add('pick-palette-btn');
			paletteBtn.classList.add(palleteObj.nr);
			paletteBtn.innerText = "Select";

			paletteBtn.addEventListener("click", e => {
				closeLibrary();
				const paletteIndex = e.target.classList[1];
				initialColors = [];
				paletteObjects[paletteIndex].colors.forEach((color, index) => {
					initialColors.push(color);
					colorDivs[index].style.backgroundColor = color;
					const text = colorDivs[index].children[0];
					checkTextContrast(color, text);
					updateTextUI(index);
				});
				resetInputs();
			});

			//Append to library
			palette.appendChild(title);
			pallete.appendChild(preview);
			palette.appendChild(paletteBtn);
			libraryContainer.children[0].appendChild(palette);
	}
}

localStorage.clear();
getLocal();
randomColors();