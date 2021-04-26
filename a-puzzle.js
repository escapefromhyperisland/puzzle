/* global AFRAME THREE */

//alert("Find the pieces, solve the puzzle, discover your destiny!");

AFRAME.registerComponent('puzzle', {
	init: function () {
		this.puzzleMarkers = document.querySelectorAll('a-marker');
		this.puzzleNeighbours = [
			[1, 3],
			[0, 4, 2],
			[1, 5],
			[0, 4, 6],
			[1, 3, 5, 7],
			[2, 5, 8],
			[3, 7],
			[6, 4, 8],
			[7, 5],
		];
		this.getMaterials();
		this.numCorrect = 0;
		this.puzzleComplete = false;
	},
	getMaterials: function () {
		var puzzleMarkersMesh = [];
		for (var marker of this.puzzleMarkers) {
			var model = marker.querySelector('[gltf-model]');
			var object = model.object3D;
			object.traverse(function (node) {
				if (node.isMesh) {
					console.log(node);
					puzzleMarkersMesh.push(node);
				}
			});
		}
		this.puzzleMarkersMesh = puzzleMarkersMesh;
	},
	tick: function () {
		var i = 0;
		var totalAverage = 0;
		for (var i = 0; i < this.puzzleMarkers.length; i++) {
			let marker = this.puzzleMarkers[i];

			if (marker.object3D.visible == true) {
				let neighbours = this.puzzleNeighbours[i];
				let distance = 0;
				for (var j = 0; j < neighbours.length; j++) {
					var index = neighbours[j];
					var neighbour = this.puzzleMarkers[index];
					distance += marker.object3D.position.distanceTo(
						neighbour.object3D.position
					);
				}
				let average = distance / neighbours.length;
				totalAverage += average;
				if (average < 2) {
					if (!marker.classList.contains('correct')) {
						marker.classList.add('correct');
						this.puzzleMarkersMesh[i].material.color.setHex(0x00ff00);
						this.puzzleMarkersMesh[i].material.metalness = 0;
						this.puzzleMarkersMesh[i].material.map = this.tex;
						this.numCorrect++;
					}
				} else {
					if (marker.classList.contains('correct')) {
						marker.classList.remove('correct');
						//this.puzzleMarkersMesh[i].material.color.setHex(0xff0000);
						this.numCorrect--;
					}
				}
			}
		}
		const stats = document.createElement('div');
		document.body.appendChild(stats);
		stats.style.position = 'fixed';
		stats.style.top = '0';
		stats.style.left = '0';
		stats.textContent = `${this.numCorrect}`;
		if (this.numCorrect === 9 && this.puzzleComplete === false) {
			this.puzzleComplete = true;
			setTimeout(function () {
				let answer = prompt(
					'What has roots as nobody sees, Is taller than trees, Up, up it goes, And yet never grows?'
				);
				if (answer.toLowerCase() == 'mountain') {
					// ah, what a personal defeat this must be… :)
					location = 'https://bit.ly/3dWCDEZ'; // gave up that fast did you?
				} else {
					location =
						window.location.href +
						'https://www.youtube.com/embed/cQ_b4_lw0Gg?controls=0&autoplay=1';
				}
			}, 1000);
		}
	},
});
