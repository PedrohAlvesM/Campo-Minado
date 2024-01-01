let dificuldade = document.getElementById("dificuldade");

document.querySelector("section").oncontextmenu = function () {
	return false;
};

document.addEventListener("DOMContentLoaded", ()=>{ Main(9,9,10)});

dificuldade.addEventListener("change", ()=>{
        blocoBomba = {
            "facil": ()=>{Main(9,9,1)},
            "medio": ()=>{Main(16,16,50)},
            "dificil": ()=>{Main(50,50,350)},
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

        Main(largura, altura, bombas);
    }
    else {
        document.getElementById("mensagem").style.display = "block";
    }
}

document.getElementById("sair-modal").addEventListener("click", ()=>{document.getElementsByClassName("modal")[0].style.display = "none"});