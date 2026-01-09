// 1. LÓGICA DEL PRELOADER 
$(window).on('load', function() {
    $('body').addClass('loaded');
});

setTimeout(function() {
    if (!$('body').hasClass('loaded')) {
        console.warn("Forzando cierre del preloader por tiempo de espera...");
        $('body').addClass('loaded');
    }
}, 3000);


// 2. RESTO DE LA LÓGICA 
$(document).ready(function() {

    // --- ANIMACIÓN DE PANELES (HERO) ---
    $('.panel').each(function(index) {
        var $panel = $(this);
        $panel.css({
            'opacity': 0,
            'transform': 'translateY(50px)'
        });

        setTimeout(function() {
            $panel.css({
                'transition': 'flex 0.8s cubic-bezier(0.05, 0.61, 0.41, 0.95), filter 0.5s, opacity 1s ease, transform 1s ease',
                'opacity': 1,
                'transform': 'translateY(0)'
            });
        }, 200 * index);
    });

    // --- INTERSECTION OBSERVER (REVEAL ON SCROLL) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('active');
            }
        });
    }, { threshold: 0.2 });

    $('.reveal-on-scroll').each(function() {
        observer.observe(this);
    });

    // --- DATOS DEL QUIZ ---
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

    // --- VARIABLES DE ESTADO ---
    let currentQuestionIndex = 0;
    let scores = { coppola: 0, anderson: 0, villeneuve: 0, amenabar: 0 };

    // --- LÓGICA DEL QUIZ (JQUERY) ---

    $('#open-quiz').on('click', function() {
        $('#quiz-modal').addClass('open');
        currentQuestionIndex = 0;
        scores = { coppola: 0, anderson: 0, villeneuve: 0, amenabar: 0 };
        loadQuestion();
    });

    $('#close-quiz').on('click', function() {
        $('#quiz-modal').removeClass('open');
    });

    $('#quiz-modal').on('click', function(e) {
        if ($(e.target).is('#quiz-modal')) {
            $(this).removeClass('open');
        }
    });

    function loadQuestion() {
        const currentQ = questions[currentQuestionIndex];
        
        $('#question-text').text(currentQ.text);
        $('#question-counter').text(`Pregunta ${currentQuestionIndex + 1}/${questions.length}`);
        
        const percentage = ((currentQuestionIndex) / questions.length) * 100;
        $('#progress-fill').css('width', percentage + '%');

        const $answersContainer = $('#answers-container');
        $answersContainer.empty();

        $.each(currentQ.answers, function(index, answer) {
            const $btn = $('<button>')
                .addClass('answer-btn')
                .text(answer.text)
                .on('click', function() {
                    selectAnswer(answer.type);
                });
            $answersContainer.append($btn);
        });
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

    function finishQuiz() {
        const winnerKey = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
        const winnerData = directorsData[winnerKey];

        $('#progress-fill').css('width', '100%');

        const resultHTML = `
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

        $('#quiz-body').html(resultHTML);

        $('#restart-quiz').on('click', function() {
            window.location.reload();
        });
    }

/* =========================================
       === WES ANDERSON PAGE JS ===
       ========================================= */

    if ($('.wes-anderson-page').length) {
        console.log("Modo Wes Anderson: Activado (jQuery). Preparando simetría.");

        const wesObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('active');
                    wesObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        $('.reveal-wes').each(function() {
            wesObserver.observe(this);
        });


        // 2. INTERACCIÓN DE PALETA DE COLORES (THEME SWITCHER)
        $('.color-strip').on('click', function() {
            const $this = $(this);
            const $wesRoot = $('.wes-anderson-page'); 
            const $feedback = $('#copy-feedback');
            const newBgColor = $this.attr('data-color');
            const newTextColor = $this.attr('data-text-color');

            navigator.clipboard.writeText(newBgColor);

            $wesRoot.css('--wes-bg', newBgColor);
            $wesRoot.css('--wes-text', newTextColor);

            if (newTextColor === '#FFFFFF' || newTextColor === '#FBF6E9') {
                $wesRoot.css('--wes-bg-secondary', 'rgba(0,0,0,0.2)');
            } else {
                $wesRoot.css('--wes-bg-secondary', '#FBF6E9');
            }

            $feedback
                .text(`Atmósfera reescrita: ${newBgColor}`)
                .css({
                    'color': newTextColor,
                    'opacity': 1
                });

            $('body').css('transition', 'background-color 0.5s ease, color 0.5s ease');

            setTimeout(function() {
                $feedback.css('opacity', 0);
            }, 2000);
        });
    }

    /* =========================================
       === WES ANDERSON PAGE JS END ===
       ========================================= */



    //    AMENABAR
    /* NARRATIVE  CARDS*/

    (function enableAmenabarDragCards() {
    const $area = $('#aa-narrative-area');
    if (!$area.length) return;

    let topZ = 10;

    let draggingEl = null;
    let startPointer = { x: 0, y: 0 };
    let startPos = { x: 0, y: 0 };

    const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

    $area.find('.aa-narrative-card').each(function (i) {
        const el = this;

        const hasInlineLeft = el.style.left !== '';
        const hasInlineTop  = el.style.top !== '';
        if (hasInlineLeft && hasInlineTop) return;

        const areaRect = $area[0].getBoundingClientRect();

        const elW = el.offsetWidth;
        const elH = el.offsetHeight;

        const marginRight = 40;
        const startTop = 80;

        const defaultLeft = Math.max(0, areaRect.width - elW - marginRight);
        const defaultTop  = startTop + (i * 25);

        el.style.left = `${defaultLeft}px`;
        el.style.top  = `${defaultTop}px`;

        el.style.userSelect = 'none';
    });



    $area.on('pointerdown', '.aa-narrative-card', function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        draggingEl = this;
        draggingEl.setPointerCapture(e.pointerId);
        topZ += 1;
        draggingEl.style.zIndex = topZ;
        startPointer = { x: e.clientX, y: e.clientY };

        const left = parseFloat(draggingEl.style.left) || 0;
        const top = parseFloat(draggingEl.style.top) || 0;
        startPos = { x: left, y: top };

        draggingEl.style.cursor = 'grabbing';

        e.preventDefault();
    });

    $area.on('pointermove', function (e) {
        if (!draggingEl) return;

        const $drag = $(draggingEl);

        const areaRect = $area[0].getBoundingClientRect();
        const dragRect = draggingEl.getBoundingClientRect();

        const dx = e.clientX - startPointer.x;
        const dy = e.clientY - startPointer.y;

        let newX = startPos.x + dx;
        let newY = startPos.y + dy;

        const maxX = areaRect.width - dragRect.width;
        const maxY = areaRect.height - dragRect.height;

        newX = clamp(newX, 0, maxX);
        newY = clamp(newY, 0, maxY);

        draggingEl.style.left = `${newX}px`;
        draggingEl.style.top = `${newY}px`;
    });

    function endDrag(e) {
        if (!draggingEl) return;
        draggingEl.style.cursor = 'grab';
        draggingEl = null;
    }

    $area.on('pointerup pointercancel pointerleave', endDrag);
    })();

    // PALETA INTERACTIVA
    if ($('.amenabar-page').length) {
        $('.aa-color-strip').on('click', function () {
            const $this = $(this);
            const newBgColor = $this.attr('data-color');
            const newTextColor = $this.attr('data-text-color') || 'var(--aa-text)';

            if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(newBgColor);
            }

            const $aaRoot = $('.amenabar-page');
            $aaRoot.css('--aa-surface', newBgColor);
            $aaRoot.css('--aa-surface-text', newTextColor);

            const $feedback = $('#aa-copy-feedback');
            $feedback
            .text(`Atmósfera actualizada: ${newBgColor}`)
            .css({ color: newTextColor, opacity: 1 });

            setTimeout(function () {
            $feedback.css('opacity', 0);
            }, 2000);
        });
    }

//     CARRUSEL
    (function enableAmenabarFilmCarousel(){
    if (!$('.amenabar-page').length) return;

    const $carousel = $('#aa-vert-carousel');
    if (!$carousel.length) return;

    const $slides = $carousel.find('.aa-film-slide');
    const total = $slides.length;
    if (total < 3) return;

    let index = 0;
    let timer = null;
    const intervalMs = 5000;

    const mod = (n, m) => ((n % m) + m) % m;

    function applyClasses(){
        const prev = mod(index - 1, total);
        const next = mod(index + 1, total);

        $slides.each(function(i){
        $(this)
            .removeClass('is-prev is-current is-next is-hidden')
            .addClass('is-hidden');
        });

        $slides.eq(prev).removeClass('is-hidden').addClass('is-prev');
        $slides.eq(index).removeClass('is-hidden').addClass('is-current');
        $slides.eq(next).removeClass('is-hidden').addClass('is-next');
    }

    function goNext(){
        index = mod(index + 1, total);
        applyClasses();
    }

    function goPrev(){
        index = mod(index - 1, total);
        applyClasses();
    }

    function resetAutoplay(){
        if (timer) clearInterval(timer);
        timer = setInterval(goNext, intervalMs);
    }

    $carousel.on('click', '.aa-film-slide', function(){
        const $s = $(this);
        if ($s.hasClass('is-prev')) {
        goPrev();
        resetAutoplay();
        } else if ($s.hasClass('is-next')) {
        goNext();
        resetAutoplay();
        }
    });

    applyClasses();
    resetAutoplay();

    const io = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
        if (!entry.isIntersecting) {
            if (timer) clearInterval(timer);
            timer = null;
        } else {
            resetAutoplay();
        }
        });
    }, { threshold: 0.25 });

    io.observe($carousel[0]);
    })();


    // END AMENABAR


    console.log("Sistema jQuery cargado correctamente.");
});