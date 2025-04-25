class Quiz {
    constructor(perguntas, personagens) {
        this.personagens = personagens
        this.perguntas = perguntas
        this.numQuestao = 0
        this.opSelecionado = 0
        this.botaoSelecionado
        this.card = document.getElementById('card')
        this.usuario = new Usuario()

        this.inicializar()
    }

    inicializar() {
        
        this.card.classList.remove('card2')
        this.card.classList.add('card')

        let h1 = document.createElement('h1')
        h1.textContent = 'Perguntas'
        h1.classList.add('cooldown1')

        let p = document.createElement('p')
        p.setAttribute('id', 'pergunta')
        p.classList.add('cooldown1')
        p.textContent = 'A pergunta'

        let form = document.createElement('form')
        form.setAttribute('id', 'form')

        this.card.appendChild(h1)
        this.card.appendChild(p)
        this.card.appendChild(form)

        this.form = document.getElementById('form')
        this.perguntaEl = document.getElementById('pergunta')
        this.titulo = h1

        for(let i = 0; i < 3; i++){
            let input = document.createElement('input')
            input.setAttribute('type', 'button')
            input.setAttribute('name', 'opcoes')
            input.setAttribute('value', `Opção ${i + 1}`)
            input.classList.add('cooldown')
            this.form.appendChild(input)
        }

        let enviarBtn = document.createElement('input')
        enviarBtn.setAttribute('type', 'button')
        enviarBtn.setAttribute('name', 'enviar')
        enviarBtn.setAttribute('value', `Próximo`)
        enviarBtn.setAttribute('id', `enviarBtn`)

        this.form.appendChild(enviarBtn)

        this.opcoes = document.getElementsByName('opcoes')
        this.enviarBtn = document.getElementById('enviarBtn')

        this.opcoes.forEach((botao) => {
            botao.addEventListener('click', () => {
                this.trocarSelecionado(botao)}
            )
        })

        this.enviarBtn.addEventListener('click', () => {
            this.proximaPergunta()
        })

        this.estruturarQuestoes()
    }

    trocarSelecionado(botao) {
        if (this.opSelecionado === 0) {
            botao.classList.add('selecionado')

            this.botaoSelecionado = botao
            this.opSelecionado = 1
        } else {

            this.opcoes.forEach((botao) => {
                botao.classList.remove('selecionado')
            })

            this.botaoSelecionado = botao

            botao.classList.add('selecionado')
        }
        console.log(document.getElementsByClassName('selecionado'))
    }

    resetaForm() {
        this.opcoes.forEach((botao) => {
            botao.classList.remove('selecionado')
        })
    }

    estruturarQuestoes() {
        this.resetaForm()
        this.perguntaEl.classList.add('cooldown1')
        this.titulo.classList.add('cooldown1')
        this.opcoes.forEach((opcao) => opcao.classList.add('cooldown'))

        setTimeout(() => {
            const questaoAtual = this.perguntas[this.numQuestao]
            this.perguntaEl.innerHTML = questaoAtual.pergunta
            this.titulo.textContent = `Pergunta ${this.numQuestao + 1}`
            this.opcoes.forEach((opcao, index) => {
                opcao.value = questaoAtual.respostas[index].texto
            })

            this.perguntaEl.classList.remove('cooldown1')
            this.titulo.classList.remove('cooldown1')
            this.opcoes.forEach((opcao) => opcao.classList.remove('cooldown'))

            this.numQuestao++
        }, 1000)
    }

    proximaPergunta() {
        if (this.opSelecionado === 0) {
            this.perguntaEl.innerHTML = 'ERRO! Selecione uma alternativa!'
            setTimeout(() => {
                this.perguntaEl.innerHTML = this.perguntas[this.numQuestao - 1].pergunta
            }, 1000)
            return
        }

        this.usuario.calcularNotas(this.botaoSelecionado, this.perguntas)

        if (this.numQuestao >= this.perguntas.length) {
            this.exibirResultadoFinal()
            return
        }

        this.opSelecionado = 0
        this.estruturarQuestoes()
    }

    exibirResultadoFinal() {
        let personagem

        if (this.usuario.notaGoku >= this.usuario.notaVegeta && this.usuario.notaGoku >= this.usuario.notaKidBuu) {
            personagem = this.personagens[0]
        } else if (this.usuario.notaVegeta >= this.usuario.notaGoku && this.usuario.notaVegeta >= this.usuario.notaKidBuu) {
            personagem = this.personagens[1]
        } else {
            personagem = this.personagens[2]
        }

        this.resultado = personagem
        
        while(this.card.lastChild){
            this.card.removeChild(this.card.lastChild)
        }

        let h1 = document.createElement('h1')
        h1.textContent = `Resultado final`
        this.card.appendChild(h1)

        let h2 = document.createElement('h2')
        h2.innerHTML = `Você se parece mais com: <strong>${personagem.nome}</strong>`
        this.card.appendChild(h2)

        let img = document.createElement('img')
        img.setAttribute('src', `${personagem.imagem}`)
        img.setAttribute('alt', `${personagem.nome}`)
        img.classList.add('img2')
        this.card.appendChild(img)

        let p = document.createElement('p')
        p.textContent = `${personagem.descricao}`
        p.style['marginTop'] = '10px'
        this.card.appendChild(p)

        let button = document.createElement('button')
        button.textContent = 'Reiniciar'
        button.setAttribute('id', 'reiniciar')
        button.setAttribute('name', 'enviar')
        button.style['marginTop'] = '20px'
        this.card.appendChild(button)

        button.addEventListener('click', ()=>{
            while(this.card.lastChild){
                this.card.removeChild(this.card.lastChild)
            }
            
            inicio.registrarHistorico(this.resultado, this.usuario)
            inicio.telaInicial()
        })
    }
}
class Usuario {
    constructor(){
        this.notaGoku = 0
        this.notaVegeta = 0
        this.notaKidBuu = 0
    }

    calcularNotas(botaoSelecionado, perguntas){
        let selecionado = botaoSelecionado.value
        
        perguntas.forEach((pergunta)=>{
            pergunta.respostas.forEach((resposta)=>{
                if(resposta.texto == selecionado){
                    this.notaGoku += resposta.notaGoku
                    this.notaVegeta += resposta.notaVegeta
                    this.notaKidBuu += resposta.notaKidBuu
                }
            })
        })

        console.log(`Goku: ${this.notaGoku} Vegeta: ${this.notaVegeta} KidBuu: ${this.notaKidBuu} ${selecionado}`)
    }
}

class Inicio {
    constructor(perguntas, personagens){
        this.perguntas = perguntas
        this.personagens = personagens
        this.historico = []
        this.tentativas = 0
        this.card = document.getElementById('card')
        this.telaInicial()
    }
    telaInicial(){
        this.card.classList.remove('card')
        this.card.classList.add('card2')

        while(this.card.lastChild){
            this.card.removeChild(this.card.lastChild)
        }

        let comecarBtn = document.createElement('input')
        comecarBtn.setAttribute('type', 'button')
        comecarBtn.setAttribute('name', 'enviar')
        comecarBtn.setAttribute('value', `Começar`)
        comecarBtn.setAttribute('id', `comecarBtn`)

        let h1 = document.createElement('h1')
        h1.textContent = 'Bem-vindo ao Universo Dragon Ball Z'

        let p = document.createElement('p')
        p.setAttribute('id', 'pergunta')
        p.textContent = 'Em um mundo onde guerreiros poderosos enfrentam ameaças que desafiam os limites da imaginação, você está prestes a descobrir qual personagem de Dragon Ball Z mais se parece com você. Prepare-se para embarcar em uma jornada cheia de energia, batalhas épicas e decisões importantes.'

        this.card.appendChild(h1)
        this.card.appendChild(p)
        this.card.appendChild(comecarBtn)

        this.comecarBtn = document.getElementById('comecarBtn')

        this.iniciar()
    }

    iniciar(){
        this.comecarBtn.addEventListener('click', ()=>{
            while(this.card.lastChild){
                this.card.removeChild(this.card.lastChild)
            }
            this.quiz = new Quiz(this.perguntas, this.personagens)
        })
    }

    registrarHistorico(personagem, usuario){
        this.tentativas++

        let registro = {
            personagem: personagem.nome,
            tentativas: this.tentativas,
            notaGoku: usuario.notaGoku,
            notaVegeta: usuario.notaVegeta,
            notaKidBuu: usuario.notaKidBuu
        }
        this.historico.push(registro)
        console.log('Histórico:', this.historico)
    }
}

const perguntas = [
    {
        pergunta: 'Qual seu nível de inteligencia?',
        respostas: [
            { texto: 'Burro (menos de 100 QI)', notaGoku: 2 , notaVegeta: 1, notaKidBuu: 3},
            { texto: 'Inteligente (mais de 120 QI)', notaGoku: 2 , notaVegeta: 3, notaKidBuu: 1 },
            { texto: 'Na media (100 QI)', notaGoku: 3 , notaVegeta: 2, notaKidBuu: 2 },
        ],
    },
    {
        pergunta: 'Você protege aqueles ao seu redor?',
        respostas: [
            { texto: 'Só importa a mim mesmo', notaGoku: 1 , notaVegeta: 2, notaKidBuu: 3  },
            { texto: 'Apenas aqueles mais próximos', notaGoku: 1 , notaVegeta: 3, notaKidBuu: 2  },
            { texto: 'Tenho prazer em ver o bem dos outros', notaGoku: 3 , notaVegeta: 1, notaKidBuu: 1  },
        ],
    },
    {
        pergunta: 'Você corre atrás dos seus sonhos?',
        respostas: [
            { texto: 'Conquisto eles através do esforço', notaGoku: 3 , notaVegeta: 2, notaKidBuu: 1  },
            { texto: 'Se vier ao acaso', notaGoku: 1 , notaVegeta: 2, notaKidBuu: 3  },
            { texto: 'Não me esforço mas conquisto meus sonhos', notaGoku: 2 , notaVegeta: 3, notaKidBuu: 2  },
        ],
    },
    {
        pergunta: 'Qual é sua reação diante de um desafio?',
        respostas: [
            { texto: 'Aceito com empolgação', notaGoku: 3, notaVegeta: 2, notaKidBuu: 1 },
            { texto: 'Fico frustado mas enfrento', notaGoku: 2, notaVegeta: 3, notaKidBuu: 1 },
            { texto: 'Ignoro ou destruo quem me desafia', notaGoku: 1, notaVegeta: 2, notaKidBuu: 3 },
        ],
    },
    {
        pergunta: 'Qual dessas palavras mais te define?',
        respostas: [
            { texto: 'Determinação', notaGoku: 3, notaVegeta: 2, notaKidBuu: 1 },
            { texto: 'Orgulho', notaGoku: 2, notaVegeta: 3, notaKidBuu: 1 },
            { texto: 'Caos', notaGoku: 1, notaVegeta: 1, notaKidBuu: 3 },
        ],
    },
    {
        pergunta: 'Você costuma cooperar com os outros?',
        respostas: [
            { texto: 'Sim, sempre que posso', notaGoku: 3, notaVegeta: 1, notaKidBuu: 1 },
            { texto: 'Depende do que eu ganho com isso', notaGoku: 2, notaVegeta: 3, notaKidBuu: 2 },
            { texto: 'Prefiro agir sozinho ou causar bagunça', notaGoku: 1, notaVegeta: 2, notaKidBuu: 3 },
        ],
    },
    {
        pergunta: 'Como você reage quando está com raiva?',
        respostas: [
            { texto: 'Respiro fundo e tente me acalmar', notaGoku: 3, notaVegeta: 1, notaKidBuu: 1 },
            { texto: 'Fico irritado, mas penso antes de agir', notaGoku: 2, notaVegeta: 3, notaKidBuu: 2 },
            { texto: 'Perco o controle e ataco', notaGoku: 1, notaVegeta: 1, notaKidBuu: 3 },
        ],
    },
    {
        pergunta: 'Qual dessas cores você mais gosta?',
        respostas: [
            { texto: 'Laranja', notaGoku: 3, notaVegeta: 1, notaKidBuu: 1 },
            { texto: 'Azul', notaGoku: 1, notaVegeta: 3, notaKidBuu: 1 },
            { texto: 'Rosa', notaGoku: 1, notaVegeta: 1, notaKidBuu: 3 },
        ],
    },
    {
        pergunta: 'O que mais importa para você?',
        respostas: [
            { texto: 'Proteger as pessoas', notaGoku: 3, notaVegeta: 1, notaKidBuu: 1 },
            { texto: 'Superar meus limites', notaGoku: 2, notaVegeta: 3, notaKidBuu: 2 },
            { texto: 'Me divertir, não importa como', notaGoku: 1, notaVegeta: 2, notaKidBuu: 3 },
        ],
    },
    {
        pergunta: 'Qual a sua relação com regras?', 
        respostas: [
            { texto: 'Sigo as regras', notaGoku: 3, notaVegeta: 2, notaKidBuu: 1 },
            { texto: 'Regras são flexíveis', notaGoku: 2, notaVegeta: 3, notaKidBuu: 1 },
            { texto: 'Regras foram feitas para serem quebradas', notaGoku: 1, notaVegeta: 1, notaKidBuu: 3 },
        ],
    },
]

const personagens = [
    {
        nome: 'Goku',
        descricao: 'Você é determinado, bondoso e sempre busca proteger aqueles ao seu redor e proporcionar os seus sonhos em realidade, pois quer ver eles bem',
        imagem: 'goku.png',
    },
    {
        nome: 'Vegeta',
        descricao: 'Você tem espirito de um grande guerreiro sempre protegendo quem realmente importa, com uma mente brilhante um futuro promissor o aguarda',
        imagem: 'vegeta.png',
    },
    {
        nome: 'Kid Buu',
        descricao: 'Você age por impulso, com um grande ego mantem o holofotes apenas em você mesmo. Apesar disso você mantem um grande poder e pode se tornar um grande guerreiro',
        imagem: 'kidbuu.jpg',
    },
]

const inicio = new Inicio(perguntas, personagens)