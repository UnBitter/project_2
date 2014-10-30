;

function scrollToElement() {
	var scrollElt = document.getElementById('scrollElt');
	var selectedPosX = 0;
	var selectedPosY = 0;

	while (scrollElt != null) {
		selectedPosX += scrollElt.offsetLeft;
		selectedPosY += scrollElt.offsetTop;
		scrollElt = scrollElt.offsetParent;
	}

	window.scrollTo(selectedPosX, selectedPosY);

}

document.getElementById('scrollBtn').onclick = scrollToElement;

// scrollToElement('myId');