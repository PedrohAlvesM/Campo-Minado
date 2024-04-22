import { CampoMinado } from "./campo-minado-class.js";

const jogo = new CampoMinado(9,9,10);
jogo.CarregarEstatisticas();

let dificuldade = document.getElementById("dificuldade");

document.querySelector("section").oncontextmenu = function () {
	return false;
};

document.addEventListener("DOMContentLoaded", ()=>{ jogo.Main()});

dificuldade.addEventListener("change", ()=>{
        let blocoBomba = {
            "facil": ()=>{
                jogo.largura = 9;
                jogo.altura = 9;
                jogo.nBombas = 10;
                jogo.Main();
            },
            "medio": ()=>{
                jogo.largura = 16;
                jogo.altura = 16;
                jogo.nBombas = 50;
                jogo.Main();
            },
            "dificil": ()=>{
                jogo.Main(50,50,350)
                jogo.largura = 50;
                jogo.altura = 50;
                jogo.nBombas = 350;
                jogo.Main();
            },
            "personalizado": ()=>{
                const container = document.getElementsByClassName("modal")[0];
                container.style.display = "flex";
            },
        }
    
        if (blocoBomba[dificuldade.value]){
            blocoBomba[dificuldade.value]();
        }
});

document.getElementById("confirmar-personalizado").addEventListener("click", DificuldadePersonalizada);

function DificuldadePersonalizada() {
    const largura = Number(document.getElementById("largura-personalizado").value);
    const altura = Number(document.getElementById("altura-personalizado").value);
    const bombas = Number(document.getElementById("bombas-personalizado").value);

    if ((largura > 0 && altura > 0) && (bombas < largura*altura)) {
        const container = document.getElementsByClassName("modal")[0];
        container.style.display = "none";

        jogo.largura = largura;
        jogo.altura = altura;
        jogo.nBombas = bombas
        jogo.Main();
    }
    else {
        document.getElementById("mensagem").style.display = "block";
    }
}

const btn = document.getElementsByClassName("sair-modal");
for (let i = 0; i < btn.length; i++) {
    btn[i].addEventListener("click", ()=>{document.getElementsByClassName("modal")[i].style.display = "none";});
}

document.getElementById("abrir-estatisticas").addEventListener("click", ()=>{document.getElementsByClassName("estatisticas")[0].style.display = "flex"});