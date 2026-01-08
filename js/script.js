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
            img: "/media/img/Sofia-Coppola-Cara.jpg",
            link: "sofia-coppola.html"
        },
        anderson: {
            name: "Wes Anderson",
            desc: "Buscas el orden en el caos. Tu vida es una paleta de colores pastel y simetría perfecta.",
            img: "/media/img/Wes-Anderson-Cara.jpg",
            link: "wes-anderson.html"
        },
        villeneuve: {
            name: "Denis Villeneuve",
            desc: "Te atrae lo monumental y lo brutalista. Tu atmósfera es tensa, inmensa y visualmente impactante.",
            img: "/media/img/Denise-Villenueve-Cara.jpg",
            link: "denis-villeneuve.html"
        },
        amenabar: {
            name: "Alejandro Amenábar",
            desc: "Vives entre luces y sombras. El misterio y la tensión psicológica definen tu espacio.",
            img: "/media/img/Alejandro-Amenabar-Cara.jpg",
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

        // Lógica del Slider Automático Wes Anderson
        function startWesSlider() {
            const $images = $('.slider-img');
            let currentIndex = 0;

            setInterval(function() {
                $images.eq(currentIndex).removeClass('active');
                currentIndex = (currentIndex + 1) % $images.length;

                $images.eq(currentIndex).addClass('active');
                
            }, 4000);
        }

        $(document).ready(function() {
            if ($('.wes-slider').length) {
                startWesSlider();
            }
        });


        // 2. INTERACCIÓN DE PALETA DE COLORES (THEME SWITCHER)
        $('.color-strip').on('click', function() {
            const $this = $(this);
            const $wesRoot = $('.wes-anderson-page'); 
            const $feedback = $('#copy-feedback');

            const newBgColor = $this.attr('data-color');
            const newTextColor = $this.attr('data-text-color');
            const newAccentColor = $this.attr('data-accent');

            navigator.clipboard.writeText(newBgColor);

            $wesRoot.css('--wes-bg', newBgColor);
            $wesRoot.css('--wes-text', newTextColor);
            $wesRoot.css('--wes-accent', newAccentColor);

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

    // VILLENEUVE
    if ($('.villeneuve-page').length) {
        console.log("Modo Denis Villeneuve: Activado. Preparando escala brutalista.");

        const dvObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.2 });

        $('.reveal-dv').each(function() {
            dvObserver.observe(this);
        });

        // Interacción de paleta de colores (similar a Wes)
        $('.color-strip').on('click', function() {
            const $strip = $(this);
            const bgColor = $strip.data('color');
            const textColor = $strip.data('text-color');
            const accentColor = $strip.data('accent');

            // Copiar al portapapeles
            navigator.clipboard.writeText(bgColor).then(function() {
                console.log('Color copiado: ' + bgColor);
            });

            $('#copy-feedback').text('¡Color Copiado!').fadeIn().delay(2000).fadeOut();

            // Cambiar colores dinámicamente usando variables CSS
            $('body').css('--dv-bg', bgColor);
            $('body').css('--dv-text', textColor);
            $('body').css('--dv-primary', accentColor);

            $('#copy-feedback').text('¡Atmósfera Actualizada!').fadeIn().delay(2000).fadeOut();
        });
    }
    // FIN DE VILLENEUVE

    //    AMENABAR
    // AMENABAR PELIS
    const $aboutArea = $('#aa-narrative-area');
    const $aboutCards = $('.aa-narrative-card');

    if ($aboutArea.length && $aboutCards.length) {
        function posicionarAleatorio($card) {
            const areaRect = $aboutArea[0].getBoundingClientRect();
            const cardRect = $card[0].getBoundingClientRect();
            const maxLeft = areaRect.width - cardRect.width;
            const maxTop = areaRect.height - cardRect.height;
            const left = Math.max(0, Math.random() * maxLeft);
            const top = Math.max(0, Math.random() * maxTop);
            $card.css({ left: left + 'px', top: top + 'px' });
        }

        $aboutCards.each(function () { posicionarAleatorio($(this)); });

        let isDragging = false;
        let activeCard = null;
        let offsetX = 0;
        let offsetY = 0;

        function getClientPos(e) {
            if (e.type && e.type.startsWith('touch')) {
                const touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
                return { x: touch.clientX, y: touch.clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        function startDrag(e) {
            const $target = $(e.currentTarget);
            activeCard = $target;
            isDragging = false;
            const cardRect = $target[0].getBoundingClientRect();
            const pos = getClientPos(e);
            offsetX = pos.x - cardRect.left;
            offsetY = pos.y - cardRect.top;
            $(document).on('mousemove.aa-narrativeDrag touchmove.aa-narrativeDrag', onDrag)
                       .on('mouseup.aa-narrativeDrag touchend.aa-narrativeDrag touchcancel.aa-narrativeDrag', endDrag);
        }

        function onDrag(e) {
            if (!activeCard) return;
            const areaRect = $aboutArea[0].getBoundingClientRect();
            const cardRect = activeCard[0].getBoundingClientRect();
            const pos = getClientPos(e);
            let left = pos.x - offsetX - areaRect.left;
            let top = pos.y - offsetY - areaRect.top;
            const maxLeft = areaRect.width - cardRect.width;
            const maxTop = areaRect.height - cardRect.height;
            left = Math.min(Math.max(0, left), maxLeft);
            top = Math.min(Math.max(0, top), maxTop);
            activeCard.css({ left: left + 'px', top: top + 'px' });
            isDragging = true;
        }

        function endDrag(e) {
            $(document).off('.aa-narrativeDrag');
            if (!activeCard) return;
            const $clickedCard = activeCard;
            const fueArrastre = isDragging;
            activeCard = null;
            isDragging = false;
            if (!fueArrastre) { abrirOverlay($clickedCard); }
        }
    }

    // FIN DE AMENABAR

    // VILLENEUVE
    if ($('.villeneuve-page').length) {
        console.log("Modo Denis Villeneuve: Activado. Preparando escala brutalista.");

        const dvObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.2 });

        $('.reveal-dv').each(function() {
            dvObserver.observe(this);
        });

        // Interacción del slider de escala
        $('#scale-range').on('input', function() {
            const value = $(this).val();
            $('#scale-value').text(value);
            // Aquí podrías añadir efectos visuales, como cambiar el tamaño de elementos
            $('.dv-interactive-container').css('transform', `scale(${1 + value / 100})`);
        });

        // Hover en el hero para cambiar imagen
        $('.dv-hero-content').hover(function() {
            $('.dv-bg--base').stop().animate({ opacity: 0 }, 500);
            $('.dv-bg--hover').stop().animate({ opacity: 1 }, 500);
        }, function() {
            $('.dv-bg--base').stop().animate({ opacity: 1 }, 500);
            $('.dv-bg--hover').stop().animate({ opacity: 0 }, 500);
        });
    }
    // FIN DE VILLENEUVE

    console.log("Sistema jQuery cargado correctamente.");
});