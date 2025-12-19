document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. PRELOADER & ANIMACIONES INICIALES
    // ==========================================
    window.onload = () => {
        document.body.classList.add('loaded');
    };

    const panels = document.querySelectorAll('.panel');
    panels.forEach((panel, index) => {
        panel.style.opacity = "0";
        panel.style.transform = "translateY(50px)";
        setTimeout(() => {
            panel.style.transition = "flex 0.8s cubic-bezier(0.05, 0.61, 0.41, 0.95), filter 0.5s, opacity 1s ease, transform 1s ease";
            panel.style.opacity = "1";
            panel.style.transform = "translateY(0)";
        }, 200 * index);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));


    // ==========================================
    // 2. CONFIGURACIÓN DEL QUIZ (DATOS)
    // ==========================================
    const questions = [
        {
            text: "¿Qué elemento no puede faltar en tu habitación?",
            answers: [
                { text: "Un tocadiscos vintage y luz tenue", type: "coppola" },
                { text: "Objetos simétricamente ordenados por color", type: "anderson" },
                { text: "Paredes de hormigón y sombras duras", type: "villeneuve" },
                { text: "Cortinas pesadas y una puerta cerrada con llave", type: "amenabar" }
            ]
        },
        {
            text: "¿Cuál es tu mayor miedo existencial?",
            answers: [
                { text: "La soledad rodeado de gente", type: "coppola" },
                { text: "Que mi familia sea un desastre", type: "anderson" },
                { text: "La inmensidad incontrolable del futuro", type: "villeneuve" },
                { text: "No saber qué es real y qué es sueño", type: "amenabar" }
            ]
        },
        {
            text: "¿Elige una paleta de colores para tu vida?",
            answers: [
                { text: "Tonos pastel y rosas", type: "anderson" },
                { text: "Amarillo sepia y naranja tóxico", type: "villeneuve" },
                { text: "Azul oscuro y negro", type: "amenabar" },
                { text: "Luz natural difusa y dorada", type: "coppola" }
            ]
        }
    ];

    const directorsData = {
        coppola: {
            name: "Sofia Coppola",
            desc: "Tu mundo es íntimo y melancólico. Encuentras belleza en el aislamiento y los silencios.",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6sEwXv4wH-fGgWJvG-Dq4q4q4q4q4q4q4q4&s",
            link: "sofia-coppola.html"
        },
        anderson: {
            name: "Wes Anderson",
            desc: "Buscas el orden en el caos. Tu vida es una paleta de colores pastel y simetría perfecta.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Wes_Anderson_Venice_Film_Festival_2023.jpg/800px-Wes_Anderson_Venice_Film_Festival_2023.jpg",
            link: "wes-anderson.html"
        },
        villeneuve: {
            name: "Denis Villeneuve",
            desc: "Te atrae lo monumental y lo brutalista. Tu atmósfera es tensa, inmensa y visualmente impactante.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Denis_Villeneuve_by_Gage_Skidmore.jpg/640px-Denis_Villeneuve_by_Gage_Skidmore.jpg",
            link: "denis-villeneuve.html"
        },
        amenabar: {
            name: "Alejandro Amenábar",
            desc: "Vives entre luces y sombras. El misterio y la tensión psicológica definen tu espacio.",
            img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Alejandro_Amen%C3%A1bar_2019.jpg/640px-Alejandro_Amen%C3%A1bar_2019.jpg",
            link: "alejandro-amenabar.html"
        }
    };


    // ==========================================
    // 3. VARIABLES Y REFERENCIAS DOM
    // ==========================================
    let currentQuestionIndex = 0;
    let scores = { coppola: 0, anderson: 0, villeneuve: 0, amenabar: 0 };

    const modal = document.getElementById('quiz-modal');
    const quizBody = document.getElementById('quiz-body'); 
    const openBtn = document.getElementById('open-quiz');
    const closeBtn = document.getElementById('close-quiz');
    
    let questionText = document.getElementById('question-text');
    let answersContainer = document.getElementById('answers-container');
    let progressFill = document.getElementById('progress-fill');
    let counter = document.getElementById('question-counter');


    // ==========================================
    // 4. FUNCIONES DEL QUIZ
    // ==========================================

    function openModal() {
        modal.classList.add('open');
        currentQuestionIndex = 0;
        scores = { coppola: 0, anderson: 0, villeneuve: 0, amenabar: 0 };
        
        refreshDomRefs();
        loadQuestion();
    }

    function closeModal() {
        modal.classList.remove('open');
    }

    function refreshDomRefs() {
        questionText = document.getElementById('question-text');
        answersContainer = document.getElementById('answers-container');
        progressFill = document.getElementById('progress-fill');
        counter = document.getElementById('question-counter');
    }

    function loadQuestion() {
        const currentQ = questions[currentQuestionIndex];
        
        if(questionText) questionText.textContent = currentQ.text;
        if(counter) counter.textContent = `Pregunta ${currentQuestionIndex + 1}/${questions.length}`;
        if(progressFill) progressFill.style.width = `${((currentQuestionIndex) / questions.length) * 100}%`;

        if(answersContainer) {
            answersContainer.innerHTML = '';
            currentQ.answers.forEach(answer => {
                const btn = document.createElement('button');
                btn.classList.add('answer-btn');
                btn.textContent = answer.text;
                btn.addEventListener('click', () => selectAnswer(answer.type));
                answersContainer.appendChild(btn);
            });
        }
    }

    function selectAnswer(type) {
        scores[type]++;
        currentQuestionIndex++;

        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            finishQuiz();
        }
    }

    // --- FUNCIÓN PRINCIPAL DE RESULTADO (SOLO UNA) ---
    function finishQuiz() {
        // 1. Calcular ganador
        const winnerKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const winnerData = directorsData[winnerKey];

        // 2. Inyectar HTML del Resultado
        quizBody.innerHTML = `
            <div class="result-container">
                <div class="result-img-wrapper">
                    <img src="${winnerData.img}" alt="${winnerData.name}" class="result-img">
                </div>
                <p style="color:var(--accent); letter-spacing:2px; text-transform:uppercase; font-size:0.7rem;">Tu atmósfera pertenece a</p>
                <h3 class="result-title">${winnerData.name}</h3>
                <p class="result-desc">${winnerData.desc}</p>
                
                <a href="${winnerData.link}" class="btn-quiz" style="display:inline-block; text-decoration:none; margin-top:10px;">
                    Explorar su Universo
                </a>
                
                <div style="margin-top:20px;">
                    <button id="restart-quiz" style="background:none; border:none; color:#555; cursor:pointer; text-decoration:underline; font-family: inherit;">Repetir Test</button>
                </div>
            </div>
        `;

        // 3. Lógica para el botón "Repetir Test"
        document.getElementById('restart-quiz').addEventListener('click', () => {
            window.location.reload(); 
        });
    }


    // ==========================================
    // 5. EVENT LISTENERS
    // ==========================================
    if(openBtn) openBtn.addEventListener('click', openModal);
    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    console.log("Sistema de Quiz cargado correctamente.");
});