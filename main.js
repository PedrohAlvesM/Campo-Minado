let contaBombas;
let cronometro;
let venceu = false;
let bombasCriadas = false;

function Main(lado, altura, Nbombas) {
	clearInterval(cronometro);
	venceu = false;

	contaBombas = Nbombas;
	document.getElementById("rosto").classList.remove("sad");
	document.getElementById("rosto").classList.add("feliz");

	document.getElementById("bombas-restantes").innerText = contaBombas;

	CriarGrid(lado, altura);
	let blocos = document.getElementsByClassName('bloco');
	let matrizJogo;

	for (let i = 0; i < blocos.length; i++) {
		blocos[i].addEventListener('mousedown', (e) => {
			if (bombasCriadas) {
				RevelaBloco(matrizJogo, blocos, i, lado, Nbombas, e)
			}
			else {
				retornoGeraBombas = GeraBombas(Nbombas, lado, altura,  Math.floor(i / altura), Math.floor(i % altura));
				matrizJogo = retornoGeraBombas.MatrizComBombas;
				let indexBomba = retornoGeraBombas.IndexDasBombas;

				for (let [posX, posY] of indexBomba) {
					ResolveJogo(matrizJogo, posX, posY);
				}
				RevelaBloco(matrizJogo, blocos, i, lado, Nbombas, e);
				
				bombasCriadas = true;
			}
		});
}

Cronometro();
document.querySelector("#comecar").disabled = true;
}

function CriarGrid(ladoGrid, alturaGrid) {
	const grid = document.getElementById("jogo");
	grid.innerHTML = "";

	for (let i = 0; i < ladoGrid * alturaGrid; i++) {
		let novoBloco = document.createElement('div');
		novoBloco.classList.add("bloco", "borda-bloco");
		grid.appendChild(novoBloco);

	}
	grid.style.display = "grid";
	grid.style.gridTemplateRows = `repeat(${ladoGrid}, 1fr)`;
	grid.style.gridTemplateColumns = `repeat(${ladoGrid}, 1fr)`;

	document.getElementById("menu").style.width = getComputedStyle(grid).width;
	document.getElementById("menu").style.display = "flex";


}

function GeraBombas(Nbombas, Nlinhas, Ncolunas, linhaClicada, colunaClicada) {
	let matriz = CriarMatriz(Nlinhas, Ncolunas);
	let guardaIndexBomba = [];

	for (let i = 0; i < Nbombas; i++) {
		let linha = Math.floor(Math.random() * (Nlinhas));
		let coluna = Math.floor(Math.random() * (Ncolunas));

		if (matriz[linha][coluna] === "B" || (linhaClicada === linha && colunaClicada === coluna)) {
			i -= 1;
			continue
		}

		matriz[linha][coluna] = "B";
		guardaIndexBomba.push([linha, coluna]);
	}

	let retornaMatrizIndex = {
		MatrizComBombas: matriz,
		IndexDasBombas: guardaIndexBomba
	}
	return retornaMatrizIndex
}


function CriarMatriz(Nlinhas, Ncolunas) {
	let matriz = [];

	for (let i = 0; i < Nlinhas; i++) {
		matriz.push([]);
		for (let j = 0; j < Ncolunas; j++) {
			matriz[i].push(0);
		}
	}
	return matriz;
}


function RevelaBloco(matrizJogo, elementos, indiceArr, colunasTotal, bombas, btnMouse) {
	if (venceu) {
		return
	}

	let linhaMatriz = Math.floor(indiceArr / colunasTotal);
	let colunaMatriz = indiceArr % colunasTotal;

	if (btnMouse.button === 0 && matrizJogo[linhaMatriz][colunaMatriz] !== "B") {
		elementos[indiceArr].classList.add("bloco-clicado");

		if (matrizJogo[linhaMatriz][colunaMatriz] === 0 || matrizJogo[linhaMatriz][colunaMatriz] === "") {
			revealEmptyCells(matrizJogo, linhaMatriz, colunaMatriz, elementos);
		}
		else {
			const Nbombas = matrizJogo[linhaMatriz][colunaMatriz];
			const corNBombas = {
				1: "#0100fb",
				2: "#017e00",
				3: "#fa0103",
				4: "#010180",
				5: "#800002",
				6: "#018181",
				7: "#333333",
				8: "#808080",
			}
			elementos[indiceArr].style.color = corNBombas[Nbombas];
			elementos[indiceArr].innerText = matrizJogo[linhaMatriz][colunaMatriz];
		}
	}
	else if (btnMouse.button === 0 && matrizJogo[linhaMatriz][colunaMatriz] === "B") {
		if (!elementos[indiceArr].classList.contains("bandeira")) {
			elementos[indiceArr].classList.add("bomba-explodiu", "imagem");
			clearInterval(cronometro);
			document.getElementById("rosto").classList.remove("feliz");
			document.getElementById("rosto").classList.add("sad");

			RevelaJogo(matrizJogo, elementos);
		}
	}
	else if (btnMouse.button === 2 && !elementos[indiceArr].classList.contains("bloco-clicado")) {
		if (elementos[indiceArr].classList.contains("bandeira")) {
			elementos[indiceArr].classList.remove('bandeira');
			elementos[indiceArr].style.backgroundImage = "";
			contaBombas++;
			document.getElementById("bombas-restantes").innerText = contaBombas;
		}
		else if (elementos[indiceArr].innerText === "") {
			elementos[indiceArr].classList.add('bandeira', "imagem");
			btnMouse.preventDefault();
			contaBombas--;
			document.getElementById("bombas-restantes").innerText = contaBombas;
		}
	}

	if (VerificaVitoria(bombas)) {
		venceu = true;
		FimDeJogo();
	}
}


function revealEmptyCells(jogo, linha, coluna, blocos) {
	if (linha < 0 || linha >= jogo.length || coluna < 0 || coluna >= jogo[0].length) {
		return;
	}

	if (jogo[linha][coluna] !== 0) {
		return;
	}

	// Marca a célula como revelada (pode ser qualquer valor diferente de 0)
	blocos[linha * jogo[0].length + coluna].classList.add("bloco-clicado");

	// Define os movimentos possíveis nas coordenadas (linha, coluna)
	const moves = [
		[-1, 0], [1, 0], [0, -1], [0, 1]
	];

	// Utilizamos uma fila para a busca em largura
	const queue = [];
	queue.push({ linha, coluna });

	while (queue.length > 0) {
		const { linha, coluna } = queue.shift();

		// Verifica células vizinhas
		for (const [dr, dc] of moves) {
			const newRow = linha + dr;
			const newCol = coluna + dc;

			if (newRow >= 0 && newRow < jogo.length && newCol >= 0 && newCol < jogo[0].length) {
				if (jogo[newRow][newCol] === 0) {
					blocos[newRow * jogo[0].length + newCol].classList.add("bloco-clicado");
					jogo[newRow][newCol] = "";
					queue.push({ linha: newRow, coluna: newCol });
				}
				else if (jogo[newRow][newCol] > 0) {
					blocos[newRow * jogo[0].length + newCol].classList.add("bloco-clicado");

					const Nbombas = jogo[newRow][newCol];

					const corNBombas = {
						1: () => { blocos[newRow * jogo[0].length + newCol].style.color = "#0100fb" },
						2: () => { blocos[newRow * jogo[0].length + newCol].style.color = "#017e00" },
						3: () => { blocos[newRow * jogo[0].length + newCol].style.color = "#fa0103" },
						4: () => { blocos[newRow * jogo[0].length + newCol].style.color = "#010180" },
						5: () => { blocos[newRow * jogo[0].length + newCol].style.color = "#800002" },
						6: () => { blocos[newRow * jogo[0].length + newCol].style.color = "#018181" },
						7: () => { blocos[newRow * jogo[0].length + newCol].style.color = "#333333" },
						8: () => { blocos[newRow * jogo[0].length + newCol].style.color = "#808080" },
					}
					corNBombas[Nbombas]();
					blocos[newRow * jogo[0].length + newCol].innerText = jogo[newRow][newCol];
					jogo[newRow][newCol] = "";
				}
			}
		}
	}
}

function RevelaJogo(matriz, elementos) {
	for (let i = 0; i < matriz.length; i++) {
		for (let j = 0; j < matriz[i].length; j++) {
			if (matriz[i][j] === "B" && !elementos[i * matriz[i].length + j].classList.contains("bomba-explodiu")) {
				elementos[i * matriz[i].length + j].classList.add("bloco", "borda-bloco", "imagem", "bomba");
			}
		}
	}
}


function VerificaVitoria(Nbombas) {
	const blocosNaoRevelados = document.getElementById("jogo").querySelectorAll(".bloco:not(.bloco-clicado)");

	return blocosNaoRevelados.length === Nbombas;
}

function ResolveJogo(matriz, linha, coluna) {
	let adjacente = [
		[linha - 1, coluna - 1],
		[linha - 1, coluna],
		[linha - 1, coluna + 1],
		[linha, coluna - 1],
		[linha, coluna + 1],
		[linha + 1, coluna - 1],
		[linha + 1, coluna],
		[linha + 1, coluna + 1]
	];
	for (let [adjLinha, adjColuna] of adjacente) {
		if (matriz[adjLinha] !== undefined && matriz[adjLinha][adjColuna] !== undefined) {
			if (matriz[adjLinha][adjColuna] !== "B") {
				matriz[adjLinha][adjColuna] += 1;
			}
		}
	}
}

function Cronometro() {
	let tempo = document.getElementById("tempo-jogado");
	let i = 0;
	cronometro = setInterval(() => {
		i++;
		tempo.innerText = i;
	}, 1000);
}


function FimDeJogo() {
	clearInterval(cronometro);
	const rosto = document.getElementById("rosto");
	rosto.classList.remove("feliz");
	rosto.classList.add("vitoria");
}