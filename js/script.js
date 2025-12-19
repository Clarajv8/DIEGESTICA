document.addEventListener('DOMContentLoaded', () => {
    const panels = document.querySelectorAll('.panel');

    // Animación de entrada escalonada
    panels.forEach((panel, index) => {
        panel.style.opacity = "0";
        panel.style.transform = "translateY(50px)";
        
        setTimeout(() => {
            panel.style.transition = "all 1s cubic-bezier(0.25, 1, 0.5, 1)";
            panel.style.opacity = "1";
            panel.style.transform = "translateY(0)";
        }, 200 * index);
    });

    // Interacción de sonido sutil (opcional/conceptual)
    panels.forEach(panel => {
        panel.addEventListener('mouseenter', () => {
            console.log("Explorando atmósfera diegética...");
        });
    });

    // Log para el título del proyecto
    console.log("%c DIEGÉSTICA: Espacio y Narrativa ", "background: #111; color: #d4af37; font-size: 20px;");
});