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
            img: "media/img/Sofia-Coppola-Cara.WEBP",
            link: "sofia-coppola.html"
        },
        anderson: {
            name: "Wes Anderson",
            desc: "Buscas el orden en el caos. Tu vida es una paleta de colores pastel y simetría perfecta.",
            img: "media/img/Wes-Anderson-Cara.WEBP",
            link: "wes-anderson.html"
        },
        villeneuve: {
            name: "Denis Villeneuve",
            desc: "Te atrae lo monumental y lo brutalista. Tu atmósfera es tensa, inmensa y visualmente impactante.",
            img: "media/img/Denise-Villenueve-Cara.WEBP",
            link: "denis-villeneuve.html"
        },
        amenabar: {
            name: "Alejandro Amenábar",
            desc: "Vives entre luces y sombras. El misterio y la tensión psicológica definen tu espacio.",
            img: "media/img/Alejandro-Amenabar-Cara.WEBP",
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

// ==========================================
// 5. LÓGICA DEL WELCOME POPUP (SOLO HOME)
// ==========================================

if (!sessionStorage.getItem('welcomeShown')) {
    setTimeout(function() {
        $('#welcome-modal').addClass('open');
    }, 1200);
}

function closeWelcome() {
    $('#welcome-modal').removeClass('open');
    sessionStorage.setItem('welcomeShown', 'true');
}

$('#close-welcome, #enter-site').on('click', function() {
    closeWelcome();
});

$('#welcome-modal').on('click', function(e) {
    if ($(e.target).is('#welcome-modal')) {
        closeWelcome();
    }
});

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

    /* WES ANDERSON RAIN SYSTEM */
    if ($('.wes-anderson-page').length) {
        const $wesContainer = $("#wes-container");
        const $wesButton = $("#wes-rain-button");
        const wesObjects = [
            "🦊", "⚓️", "📷", "🎾", "🎒", "🔭", "🛶", "🐕", "🍰", "🚂", 
            "SYMMETRY", "ADMIT ONE", "ZISSOU", "TENENBAUM", "1965", 
            "KHAKI", "PROTAGONIST", "DIORAMA", "I BITE", "❖", "✦"
        ];

        function wesCreateFallingObject() {
            if (!$wesContainer.length) return;

            const content = wesObjects[Math.floor(Math.random() * wesObjects.length)];
            const isEmoji = content.length <= 2;
            
            const $el = $("<div></div>")
                .addClass("wes-falling-object")
                .text(content)
                .css({
                    left: Math.random() * 95 + "vw",
                    fontSize: isEmoji ? (Math.random() * 20 + 25) + "px" : (Math.random() * 5 + 12) + "px",
                    color: isEmoji ? "inherit" : (Math.random() > 0.5 ? "var(--wes-red)" : "var(--wes-static-brown)"),
                    animationDuration: (Math.random() * 3 + 3) + "s",
                    opacity: Math.random() * 0.7 + 0.3
                });

            const startRotation = Math.random() * 360;
            const spinRotation = (Math.random() > 0.5 ? 180 : -180) + startRotation;
            $el[0].style.setProperty('--start-rotation', `${startRotation}deg`);
            $el[0].style.setProperty('--spin-rotation', `${spinRotation}deg`);

            $wesContainer.append($el);

            setTimeout(() => {
                $el.remove();
            }, 6000);
        }

        function wesStartRain(amount = 20) {
            for (let i = 0; i < amount; i++) {
                setTimeout(wesCreateFallingObject, i * 150);
            }
        }
        
        $wesButton.on("click", function() {
            wesStartRain(40);
        });

        setTimeout(() => wesStartRain(15), 500);
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

        // Interacción de paleta de colores
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

        // Hover en el hero para cambiar imagen
        $('.dv-hero-content').hover(function() {
            $('.dv-bg--base').stop().animate({ opacity: 0 }, 500);
            $('.dv-bg--hover').stop().animate({ opacity: 1 }, 500);
        }, function() {
            $('.dv-bg--base').stop().animate({ opacity: 1 }, 500);
            $('.dv-bg--hover').stop().animate({ opacity: 0 }, 500);
        });

        // VILLENEUVE RAIN SYSTEM
        const $dvContainer = $("#dv-container");
        const $dvButton = $("#dv-button");
        const dvObjects = [
            "ARRIVAL", "DUNE", "BLADE RUNNER", "INCENDIES",
            "👁️", "⏳", "🤖","😶‍🌫️",
            "INFINITE", "SCALE", "BRUTAL", "EPIC",
            "DESERT", "POWER", "TENSION", "◇", "⌁", "◎",
            "🌪️", "🏜️", "⚡", "🌌", "💫", "🔥"
        ];

        function dvCreateFallingObject() {
            if ($dvContainer.length === 0) return;

            const el = document.createElement("div");
            el.classList.add("dv-falling-object");

            const content = dvObjects[Math.floor(Math.random() * dvObjects.length)];
            el.innerText = content;

            if (content.length > 2) {
                el.classList.add("is-text");
            } else {
                el.classList.add("is-emoji");
            }

            el.style.left = Math.random() * 98 + "vw";
            const isEmoji = el.classList.contains("is-emoji");
            const size = isEmoji ? (Math.random() * 16 + 24) : (Math.random() * 10 + 16);
            el.style.fontSize = size + "px";

            const duration = Math.random() * 8 + 5;
            el.style.animationDuration = duration + "s";

            const startRotation = Math.random() * 360;
            el.style.setProperty('--start-rotation', `${startRotation}deg`);

            const spinRotation = (Math.random() > 0.5 ? 360 : -360) + startRotation;
            el.style.setProperty('--spin-rotation', `${spinRotation}deg`);

            el.style.opacity = Math.random() * 0.4 + 0.4;

            $dvContainer[0].appendChild(el);

            setTimeout(() => {
                el.remove();
            }, duration * 1000);
        }

        function dvStartRain(amount = 30) {
            for (let i = 0; i < amount; i++) {
                setTimeout(dvCreateFallingObject, i * 80);
            }
        }

        if ($dvButton.length) {
            $dvButton.on("click", function() {
                dvStartRain(50);
            });
        }

        dvStartRain(20);
    }
    // FIN DE VILLENEUVE

    //    AMENABAR
    // AMENÁBAR HERO
    if (window.matchMedia('(max-width: 1024px)').matches) {
        $('.aa-hero-content').on('click', function () {
            $(this).toggleClass('is-active');
        });
    }

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
            $('.aa-color-strip').removeClass('is-active');
            $(this).addClass('is-active');
            const $this = $(this);
            const newBgColor = $this.attr('data-color');
            const newTextColor = $this.attr('data-text-color') || 'var(--aa-text)';

            if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(newBgColor);
            }

            const $aaRoot = $('.amenabar-page');
            $aaRoot.css('--aa-bg', newBgColor);
            $aaRoot.css('--aa-text', newTextColor);


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

    // AA CARACTERÍSTICAS - TABLET&MOVIL
    if ($('.amenabar-page').length && window.matchMedia('(max-width: 1024px)').matches) {
        $(document).on('click', '.aa-bg .aa-prop-card', function(e){
            e.stopPropagation();
            $(this).toggleClass('is-active').siblings().removeClass('is-active');
        });

        $(document).on('click', function(){
            $('.aa-bg .aa-prop-card').removeClass('is-active');
        });
    }
    if ($('.amenabar-page').length) {
    const $aaContainer = $("#aa-container");
    const $aaButton = $("#aa-rain-button");

    const aaObjects = [
        "SILENCIO",
        "¿REAL?", "NO MIRES", "RESPIRA",
        "🗝️", "☠️", "👁️", "📽️","🌙", "🩸", "⁉️"
    ];

    function aaCreateFallingObject() {
        if (!$aaContainer.length) return;

        const content = aaObjects[Math.floor(Math.random() * aaObjects.length)];
        const isEmojiLike = content.length <= 3 && /[🗝🕯🚪🪞👁⏳🌫🔇⟡⦿◻◼]/.test(content);

        const $el = $("<div></div>")
        .addClass("aa-falling-object")
        .addClass(isEmojiLike ? "is-emoji" : "is-text")
        .text(content)
        .css({
            left: (Math.random() * 96) + "vw",
            fontSize: isEmojiLike ? (Math.random() * 18 + 20) + "px" : (Math.random() * 7 + 12) + "px",
            color: isEmojiLike
            ? "rgba(255,248,209,0.75)"
            : (Math.random() > 0.66 ? "rgba(255,248,209,0.75)" : (Math.random() > 0.5 ? "#550909" : "#3c7499")),
            animationDuration: (Math.random() * 3.5 + 3.5) + "s",
            opacity: Math.random() * 0.45 + 0.35
        });

        const startRotation = Math.random() * 360;
        const spinRotation = (Math.random() > 0.5 ? 220 : -220) + startRotation;
        $el[0].style.setProperty('--start-rotation', `${startRotation}deg`);
        $el[0].style.setProperty('--spin-rotation', `${spinRotation}deg`);

        $aaContainer.append($el);

        const removeAfter = (parseFloat($el.css("animation-duration")) || 6) * 1000 + 500;
        setTimeout(() => $el.remove(), removeAfter);
    }

    function aaStartRain(amount = 22) {
        for (let i = 0; i < amount; i++) {
        setTimeout(aaCreateFallingObject, i * 130);
        }
    }

    if ($aaButton.length) {
        $aaButton.on("click", function() {
        aaStartRain(40);
        });
    }

    setTimeout(() => aaStartRain(16), 550);
    }


    // END AMENABAR

    // COPPOLA

    window.addEventListener('scroll', function() {
    const nav = document.querySelector('.copp-nav');
    const hero = document.querySelector('.copp-hero');
    
    // Calculamos la altura del hero para que el cambio sea exacto
    if (hero) {
        const heroHeight = hero.offsetHeight;
        // Cambia justo cuando el scroll llega al final del hero (puedes restar 80px si quieres que sea un poco antes)
        if (window.scrollY >= heroHeight - 80) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }
});
    // Animacion
   const coppContainer = document.getElementById("copp-container");
   const coppButton = document.getElementById("copp-button");
   const coppObjects = [
    "✧", "✦", "†", "soft focus", "melancholy", 
    "Tokyo", "Versailles", "dreamy", "lost", 
    "rose", "youth", "silence", "poudre", "neon",
    "🎀", "💄", "🍰", "🍷", "🎥", "📼", "🦢",
    "pancakes", "ballet", "chateau", "lonely girl",
    "✨", "☁️", "🎧", "🍓", "🚬", "🏩"];

    function coppCreateFallingObject() {
    if (!coppContainer) return;

    const el = document.createElement("div");
    el.classList.add("copp-falling-object");

    const content = coppObjects[Math.floor(Math.random() * coppObjects.length)];
    el.innerText = content;

    if (content.length > 2) {
        el.classList.add("is-text");
    }else {
        el.classList.add("is-emoji");
    }

    el.style.left = Math.random() * 98 + "vw";
    const isEmoji = el.classList.contains("is-emoji");
    const size = isEmoji ? (Math.random() * 12 + 20) : (Math.random() * 8 + 14);
    el.style.fontSize = size + "px";

    const duration = Math.random() * 6 + 4;
    el.style.animationDuration = duration + "s";

    const startRotation = Math.random() * 360;
    el.style.setProperty('--start-rotation', `${startRotation}deg`);

    const spinRotation = (Math.random() > 0.5 ? 360 : -360) + startRotation;
    el.style.setProperty('--spin-rotation', `${spinRotation}deg`);

    el.style.opacity = Math.random() * 0.5 + 0.3;

    coppContainer.appendChild(el);

    setTimeout(() => {
        el.remove();
    }, duration * 1000);
    }

    function coppStartRain(amount = 30) {
    for (let i = 0; i < amount; i++) {
        setTimeout(coppCreateFallingObject, i * 100);
    }
    }

    if (coppButton) {
        coppButton.addEventListener("click", () => {
            coppStartRain(45); 
        });
    }

    coppStartRain(25);

    // Paleta Interactiva
    $(document).ready(function() {
    if ($('.copp-page').length) {
        $('.copp-color-strip').on('click', function () {
            const $this = $(this);
            const newBgColor = $this.attr('data-color');
            const newTextColor = $this.attr('data-text-color') || '#534548';

            if (navigator.clipboard) navigator.clipboard.writeText(newBgColor);

            $('.copp-page').css({
                '--copp-bg': newBgColor,
                '--copp-bg-secondary': newBgColor,
                '--copp-text': newTextColor
            });

            // Feedback
            $('#copp-copy-feedback')
                .text(`Atmósfera: ${newBgColor}`)
                .css({ 
                    'opacity': 1,
                    'color': '#534548',
                    'background-color': '#fff',
                    'padding': '8px 16px',
                    'display': 'inline-block',
                    'border-radius': '4px',
                    'font-size': '12px',
                    'box-shadow': '0 4px 10px rgba(0,0,0,0.1)'
                });

            setTimeout(() => $('#copp-copy-feedback').css('opacity', 0), 2000);
        });
    }
});


    console.log("Sistema jQuery cargado correctamente.");
});