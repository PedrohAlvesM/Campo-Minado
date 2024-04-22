export class CampoMinado {
    #contaBombas;
    #tempoJogado
    #IDCronometro;
    #venceu = false;
    #perdeu = false;
    #bombasCriadas = false;

    #matrizJogo;
    #celulas;
    #nBombas;

    #largura;
    #altura;

    constructor(largura, altura, nBombas) {
        this.#largura = largura;
        this.#altura = altura;
        this.#nBombas = nBombas;
    }

    Main() {
        clearInterval(this.#IDCronometro);
        this.#venceu = false;
        this.#perdeu = false;
        this.#bombasCriadas = false;

        this.#contaBombas = this.#nBombas;
        document.getElementById("rosto").classList.remove("sad");
        document.getElementById("rosto").classList.add("feliz");

        document.getElementById("bombas-restantes").innerText = this.#contaBombas;

        this.CriarGrid(this.#largura, this.#altura);
        this.#celulas = document.getElementsByClassName('bloco');

        for (let i = 0; i < this.#celulas.length; i++) {
            this.#celulas[i].addEventListener('mousedown', (e) => {
                if (this.#bombasCriadas) {
                    this.RevelaBloco(i, e);
                }
                else {
                    let retornoGeraBombas = this.GeraBombas(Math.floor(i / this.#altura), Math.floor(i % this.#altura));
                    this.#matrizJogo = retornoGeraBombas.MatrizComBombas;
                    let indexBomba = retornoGeraBombas.IndexDasBombas;

                    for (let [posX, posY] of indexBomba) {
                        this.ResolveJogo(posX, posY);
                    }
                    this.RevelaBloco(i, e);

                    this.#bombasCriadas = true;
                }
            });
        }

        this.Cronometro();
        document.querySelector("#comecar").disabled = true;
    }

    CriarGrid() {
        const grid = document.getElementById("jogo");
        grid.innerHTML = "";

        for (let i = 0; i < this.#largura * this.#altura; i++) {
            let novoBloco = document.createElement('div');
            novoBloco.classList.add("bloco", "borda-bloco");
            grid.appendChild(novoBloco);

        }
        grid.style.display = "grid";
        grid.style.gridTemplateRows = `repeat(${this.#altura}, 1fr)`;
        grid.style.gridTemplateColumns = `repeat(${this.#largura}, 1fr)`;

        document.getElementById("menu").style.width = getComputedStyle(grid).width;
        document.getElementById("menu").style.display = "flex";
    }

    GeraBombas(linhaClicada, colunaClicada) {
        let matriz = this.CriarMatriz(this.#altura, this.#largura);
        let guardaIndexBomba = [];

        for (let i = 0; i < this.#nBombas; i++) {
            let linha = Math.floor(Math.random() * (this.#altura));
            let coluna = Math.floor(Math.random() * (this.#largura));

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


    CriarMatriz(nLinhas, nColunas) {
        let matriz = [];

        for (let i = 0; i < nLinhas; i++) {
            matriz.push([]);
            for (let j = 0; j < nColunas; j++) {
                matriz[i].push(0);
            }
        }
        return matriz;
    }


    RevelaBloco(indiceArr, btnMouse) {
        if (this.#venceu) {
            return
        }

        let linhaMatriz = Math.floor(indiceArr / this.#largura);
        let colunaMatriz = indiceArr % this.#largura;

        if (btnMouse.button === 0 && this.#matrizJogo[linhaMatriz][colunaMatriz] !== "B") {
            this.#celulas[indiceArr].classList.add("bloco-clicado");

            if (this.#matrizJogo[linhaMatriz][colunaMatriz] === 0 || this.#matrizJogo[linhaMatriz][colunaMatriz] === "") {
                this.RevelaCelulasVazias(linhaMatriz, colunaMatriz, this.#celulas);
            }
            else {
                const Nbombas = this.#matrizJogo[linhaMatriz][colunaMatriz];
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
                this.#celulas[indiceArr].style.color = corNBombas[Nbombas];
                this.#celulas[indiceArr].innerText = this.#matrizJogo[linhaMatriz][colunaMatriz];
            }
        }
        else if (btnMouse.button === 0 && this.#matrizJogo[linhaMatriz][colunaMatriz] === "B") {
            if (!this.#celulas[indiceArr].classList.contains("bandeira")) {
                this.#perdeu = true;
                this.#celulas[indiceArr].classList.add("bomba-explodiu", "imagem");
                this.FimDeJogo();

                this.RevelaJogo(this.#matrizJogo, this.#celulas);
            }
        }
        else if (btnMouse.button === 2 && !this.#celulas[indiceArr].classList.contains("bloco-clicado")) {
            if (this.#celulas[indiceArr].classList.contains("bandeira")) {
                this.#celulas[indiceArr].classList.remove('bandeira');
                this.#celulas[indiceArr].style.backgroundImage = "";
                this.#contaBombas++;
                document.getElementById("bombas-restantes").innerText = this.#contaBombas;
            }
            else if (this.#celulas[indiceArr].innerText === "") {
                this.#celulas[indiceArr].classList.add('bandeira', "imagem");
                btnMouse.preventDefault();
                this.#contaBombas--;
                document.getElementById("bombas-restantes").innerText = this.#contaBombas;
            }
        }

        if (this.VerificaVitoria()) {
            this.#venceu = true;
            this.FimDeJogo();
        }
    }


    RevelaCelulasVazias(linha, coluna, blocos) {
        if (linha < 0 || linha >= this.#matrizJogo.length || coluna < 0 || coluna >= this.#matrizJogo[0].length) {

        }

        if (this.#matrizJogo[linha][coluna] !== 0) {

        }

        blocos[linha * this.#matrizJogo[0].length + coluna].classList.add("bloco-clicado");

        const moves = [
            [-1, 0], [1, 0], [0, -1], [0, 1]
        ];

        const queue = [];
        queue.push({ linha, coluna });

        while (queue.length > 0) {
            const { linha, coluna } = queue.shift();

            for (const [dr, dc] of moves) {
                const newRow = linha + dr;
                const newCol = coluna + dc;

                if (newRow >= 0 && newRow < this.#matrizJogo.length && newCol >= 0 && newCol < this.#matrizJogo[0].length) {
                    if (this.#matrizJogo[newRow][newCol] === 0) {
                        blocos[newRow * this.#matrizJogo[0].length + newCol].classList.add("bloco-clicado");
                        this.#matrizJogo[newRow][newCol] = "";
                        queue.push({ linha: newRow, coluna: newCol });
                    }
                    else if (this.#matrizJogo[newRow][newCol] > 0) {
                        blocos[newRow * this.#matrizJogo[0].length + newCol].classList.add("bloco-clicado");

                        const Nbombas = this.#matrizJogo[newRow][newCol];

                        const corNBombas = {
                            1: () => { blocos[newRow * this.#matrizJogo[0].length + newCol].style.color = "#0100fb" },
                            2: () => { blocos[newRow * this.#matrizJogo[0].length + newCol].style.color = "#017e00" },
                            3: () => { blocos[newRow * this.#matrizJogo[0].length + newCol].style.color = "#fa0103" },
                            4: () => { blocos[newRow * this.#matrizJogo[0].length + newCol].style.color = "#010180" },
                            5: () => { blocos[newRow * this.#matrizJogo[0].length + newCol].style.color = "#800002" },
                            6: () => { blocos[newRow * this.#matrizJogo[0].length + newCol].style.color = "#018181" },
                            7: () => { blocos[newRow * this.#matrizJogo[0].length + newCol].style.color = "#333333" },
                            8: () => { blocos[newRow * this.#matrizJogo[0].length + newCol].style.color = "#808080" },
                        }
                        corNBombas[Nbombas]();
                        blocos[newRow * this.#matrizJogo[0].length + newCol].innerText = this.#matrizJogo[newRow][newCol];
                        this.#matrizJogo[newRow][newCol] = "";
                    }
                }
            }
        }
    }

    RevelaJogo() {
        for (let i = 0; i < this.#matrizJogo.length; i++) {
            for (let j = 0; j < this.#matrizJogo[i].length; j++) {
                if (this.#matrizJogo[i][j] === "B" && !this.#celulas[i * this.#matrizJogo[i].length + j].classList.contains("bomba-explodiu")) {
                    this.#celulas[i * this.#matrizJogo[i].length + j].classList.add("bloco", "borda-bloco", "imagem", "bomba");
                }
            }
        }
    }


    VerificaVitoria() {
        const blocosNaoRevelados = document.getElementById("jogo").querySelectorAll(".bloco:not(.bloco-clicado)");

        return blocosNaoRevelados.length === this.#nBombas;
    }

    ResolveJogo(linha, coluna) {
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
            if (this.#matrizJogo[adjLinha] !== undefined && this.#matrizJogo[adjLinha][adjColuna] !== undefined) {
                if (this.#matrizJogo[adjLinha][adjColuna] !== "B") {
                    this.#matrizJogo[adjLinha][adjColuna] += 1;
                }
            }
        }
    }

    Cronometro() {
        let tempo = document.getElementById("tempo-jogado");
        this.#tempoJogado = 0;
        this.#IDCronometro = setInterval(() => {
            this.#tempoJogado++;
            tempo.innerText = this.#tempoJogado;
        }, 1000);
    }


    FimDeJogo() {
        clearInterval(this.#IDCronometro);
        const rosto = document.getElementById("rosto");

        if (this.#venceu) {
            rosto.classList.remove("feliz");
            rosto.classList.add("vitoria");
        }
        else {
            rosto.classList.remove("feliz");
            rosto.classList.add("sad");
        }

        this.SalvarEstatisticas();
        this.CarregarEstatisticas();
        document.getElementsByClassName("estatisticas")[0].style.display = "flex";
    }

    SalvarEstatisticas() {
        const salvar = this.ObterEstatisticas();
        if (this.#venceu) {
            salvar.vitorias++;
            if (this.#largura === 9 && this.#altura === 9) {
                salvar.vitoriasFacil++;
                salvar.partidasJogadasFacil++;
                salvar.tempoMedioPGanharFacil = (salvar.tempoMedioPGanharFacil + this.#tempoJogado) / salvar.partidasJogadasFacil;
            }
            else if (this.#largura === 16 && this.#altura === 16) {
                salvar.vitoriasMedio++;
                salvar.partidasJogadasMedio++;
                salvar.tempoMedioPGanharMedio = (salvar.tempoMedioPGanharMedio + this.#tempoJogado) / salvar.partidasJogadasMedio;
            }
            else if (this.#largura === 50 && this.#altura === 50) {
                salvar.vitoriasDificil++;
                salvar.partidasJogadasDificil++;
                salvar.tempoMedioPGanharDificil = (salvar.tempoMedioPGanharDificil + this.#tempoJogado) / salvar.partidasJogadasDificil;
            }
        }
        else if (this.#perdeu) {
            salvar.derrotas++;
            if (this.#largura === 9 && this.#altura === 9) {
                salvar.derrotasFacil++;
                salvar.partidasJogadasFacil++;
                salvar.tempoMedioPGanharFacil = (salvar.tempoMedioPGanharFacil + this.#tempoJogado) / salvar.partidasJogadasFacil;
            }
            else if (this.#largura === 16 && this.#altura === 16) {
                salvar.derrotasMedio++;
                salvar.partidasJogadasMedio++;
                salvar.tempoMedioPGanharMedio = (salvar.tempoMedioPGanharMedio + this.#tempoJogado) / salvar.partidasJogadasMedio;
            }
            else if (this.#largura === 50 && this.#altura === 50) {
                salvar.derrotasDificil++;
                salvar.partidasJogadasDificil++;
                salvar.tempoMedioPGanharDificil = (salvar.tempoMedioPGanharDificil + this.#tempoJogado) / salvar.partidasJogadasDificil;
            }
        }

        salvar.partidasJogadas++;
        if (localStorage.getItem("estatisticas")) {
            localStorage.removeItem("estatisticas");
        }
        localStorage.setItem("estatisticas", JSON.stringify(salvar));
    }

    ObterEstatisticas() {
        return localStorage.getItem("estatisticas") === null ? {
            vitorias: 0,
            derrotas: 0,
            partidasJogadas: 0,

            tempoMedioPGanharFacil: 0,
            partidasJogadasFacil: 0,
            vitoriasFacil: 0,
            derrotasFacil: 0,

            tempoMedioPGanharMedio: 0,
            partidasJogadasMedio: 0,
            vitoriasMedio: 0,
            derrotasMedio: 0,

            tempoMedioPGanharDificil: 0,
            partidasJogadasDificil: 0,
            vitoriasDificil: 0,
            derrotasDificil: 0,
        } : JSON.parse(localStorage.getItem("estatisticas"));
    }

    CarregarEstatisticas() {
        const dados = this.ObterEstatisticas();

        document.getElementById("n-partidas").innerText = `Partidas jogadas: ${dados.partidasJogadas}`;
        document.getElementById("vitorias").innerText = `Vitórias: ${dados.vitorias}`;
        document.getElementById("derrotas").innerText = `Derrotas: ${dados.derrotas}`;

        document.getElementById("n-partidas-facil").innerText = `Partidas jogadas na difilculdade fácil: ${dados.partidasJogadasFacil}`;
        document.getElementById("vitorias-facil").innerText = `Vitórias na dificuldade fácil: ${dados.vitoriasFacil}`;
        document.getElementById("derrotas-facil").innerText = `Derrotas na dificuldade fácil: ${dados.derrotasFacil}`;
        document.getElementById("tempo-facil").innerText = `Tempo médio para vencer na dificuldade fácil: ${dados.tempoMedioPGanharFacil}`;

        document.getElementById("n-partidas-medio").innerText = `Partidas jogadas na difilculdade média: ${dados.partidasJogadasMedio}`;
        document.getElementById("vitorias-medio").innerText = `Vitórias na dificuldade médio: ${dados.vitoriasMedio}`;
        document.getElementById("derrotas-medio").innerText = `Derrotas na dificuldade médio: ${dados.derrotasMedio}`;
        document.getElementById("tempo-medio").innerText = `Tempo médio para vencer na dificuldade média: ${dados.tempoMedioPGanharMedio}`;

        document.getElementById("n-partidas-dificil").innerText = `Partidas jogadas na difilculdade difícil: ${dados.partidasJogadasDificil}`;
        document.getElementById("vitorias-dificil").innerText = `Vitórias na dificuldade difícil: ${dados.vitoriasDificil}`;
        document.getElementById("derrotas-dificil").innerText = `Derrotas na dificuldade difícil: ${dados.derrotasDificil}`;
        document.getElementById("tempo-dificil").innerText = `Tempo médio para vencer na dificuldade difícil: ${dados.tempoMedioPGanharDificil}`;
    }

    get contaBombas() {
        return this.#contaBombas;
    }

    set contaBombas(valor) {
        if (typeof valor !== 'number') {
            throw new Error('O valor atribuído à contaBombas deve ser um número.');
        }
        this.#contaBombas = valor;
    }

    get cronometro() {
        return this.#tempoJogado;
    }

    set cronometro(valor) {
        if (typeof valor !== 'number') {
            throw new Error('O valor atribuído ao cronômetro deve ser um número.');
        }
        this.#tempoJogado = valor;
    }

    get venceu() {
        return this.#venceu;
    }

    set venceu(valor) {
        if (typeof valor !== 'boolean') {
            throw new Error('O valor atribuído a venceu deve ser um booleano.');
        }
        this.#venceu = valor;
    }

    get perdeu() {
        return this.#perdeu;
    }
    set perdeu(valor) {
        if (typeof valor !== "boolean") {
            throw new Error("O valor atribuído a perdeu deve ser um booleano.");
        }
        this.#perdeu = valor;
    }

    get bombasCriadas() {
        return this.#bombasCriadas;
    }

    set bombasCriadas(valor) {
        if (typeof valor !== 'boolean') {
            throw new Error('O valor atribuído a bombasCriadas deve ser um booleano.');
        }
        this.#bombasCriadas = valor;
    }

    get matrizJogo() {
        return this.#matrizJogo;
    }

    set matrizJogo(valor) {
        if (!Array.isArray(valor)) {
            throw new Error('O valor atribuído à matrizJogo deve ser uma matriz.');

        }
        this.#matrizJogo = valor;
    }

    get celulas() {
        return this.#celulas;
    }

    set celulas(valor) {
        if (!(valor instanceof HTMLElement)) {
            throw new Error('O valor atribuído a celulas deve ser um elemento HTML div.bloco.');
        }
        this.#celulas = valor;
    }

    get nBombas() {
        return this.#nBombas;
    }

    set nBombas(valor) {
        if (typeof valor !== 'number') {
            throw new Error('O valor atribuído a nBombas deve ser um número.');
        }
        this.#nBombas = valor;
    }

    get largura() {
        return this.#largura;
    }

    set largura(valor) {
        if (typeof valor !== 'number') {
            throw new Error('O valor atribuído à largura deve ser um número.');
        }
        this.#largura = valor;
    }

    get altura() {
        return this.#altura;
    }

    set altura(valor) {
        if (typeof valor !== 'number') {
            throw new Error('O valor atribuído à altura deve ser um número.');
        }
        this.#altura = valor;
    }
}