// ============================================
// CONFIGURACIÓN DEL JUEGO
// ============================================

// Base de datos de preguntas y cupones (fácil de modificar)
const gameData = {
    questions: [
        {
            id: 1,
            question: "¿Quién tiene más olor a patas y se tira peos?",
            answers: [
                "Marrano",
                "Marrana"
            ],
            correct: 1, // Índice de la respuesta correcta (empezando en 0)
            coupon: "Date en el cine: Lilo & Stitch"
        },
        {
            id: 2,
            question: "¿Dónde fue nuestra primera cita eh marrana?",
            answers: [
                "Cine (Barbie)",
                "Cacao Much",
                "Johnny Rockets",
                "Parque O'Higgins"
            ],
            correct: 2,
            coupon: "Cita en Pub (Yo invito obviamente)🥂"
        },
        {
            id: 3,
            question: "¿Cuánto tiempo llevamos (a la fecha 05.06.25)?",
            answers: [
                "17 octubre 2023",
                "17 noviembre 2023",
                "14 de noviembre 2023",
                "14 octubre 2023"
            ],
            correct: 0,
            coupon: "Banano Running rosadito 🏃‍♀️💖"
        },
        {
            id: 4,
            question: "Aquí se acaba la primera parte del juego bby, ya se viene la procsima...",
            answers: [
                "Yei"
            ],
            correct: 0, // Índice de la respuesta correcta (empezando en 0)
            coupon: "Mi amorcito para siempre princesa 💕 y desayuno Piaf (Ya lo canjeaste uwu)"
        }
    ]
};

// ============================================
// VARIABLES GLOBALES DEL JUEGO
// ============================================

let currentQuestionIndex = 0;
let unlockedCoupons = [];
let gameState = 'welcome'; // welcome, start, playing, correct, incorrect, coupons, end
let backgroundMusic = null;
let musicStarted = false;

// ============================================
// FUNCIONES DE NAVEGACIÓN ENTRE PANTALLAS
// ============================================

function showScreen(screenId) {
    // Ocultar todas las pantallas
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    
    // Mostrar la pantalla solicitada
    document.getElementById(screenId).classList.add('active');
    
    // Añadir efectos de partículas en transiciones importantes
    if (screenId === 'correctScreen' || screenId === 'endScreen') {
        createSparkles();
    }
}

function startWelcome() {
    // Inicializar y reproducir música de fondo
    initBackgroundMusic();
    
    // Ir a la pantalla de inicio del juego
    gameState = 'start';
    showScreen('startScreen');
}

function startGame() {
    currentQuestionIndex = 0;
    unlockedCoupons = [];
    gameState = 'playing';
    updateProgressBar();
    loadQuestion();
    showScreen('gameScreen');
}

function goHome() {
    gameState = 'start';
    showScreen('startScreen');
}

function goToWelcome() {
    gameState = 'welcome';
    showScreen('welcomeScreen');
}

function restartGame() {
    startGame();
}

// ============================================
// LÓGICA PRINCIPAL DEL QUIZ
// ============================================

function loadQuestion() {
    const question = gameData.questions[currentQuestionIndex];
    
    // Actualizar contador de preguntas
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('totalQuestions').textContent = gameData.questions.length;
    
    // Mostrar la pregunta
    document.getElementById('questionText').textContent = question.question;
    
    // Crear botones de respuesta
    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });
    
    // Actualizar barra de progreso
    updateProgressBar();
}

function selectAnswer(selectedIndex) {
    const question = gameData.questions[currentQuestionIndex];
    
    if (selectedIndex === question.correct) {
        // Respuesta correcta
        gameState = 'correct';
        unlockedCoupons.push(question.coupon);
        showCorrectAnswer(question.coupon);
    } else {
        // Respuesta incorrecta
        gameState = 'incorrect';
        showIncorrectAnswer();
    }
}

function showCorrectAnswer(coupon) {
    // Mostrar el cupón desbloqueado con animación
    const couponElement = document.querySelector('#unlockedCoupon .coupon-content');
    couponElement.textContent = coupon;
    
    showScreen('correctScreen');
    
    // Reproducir sonido de éxito (opcional)
    playSuccessSound();
}

function showIncorrectAnswer() {
    showScreen('incorrectScreen');
    
    // Reproducir sonido de error (opcional)
    playErrorSound();
}

function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex >= gameData.questions.length) {
        // Fin del juego
        gameState = 'end';
        showGameEnd();
    } else {
        // Siguiente pregunta
        gameState = 'playing';
        loadQuestion();
        showScreen('gameScreen');
    }
}

// ============================================
// SISTEMA DE CUPONES
// ============================================

function showCoupons() {
    gameState = 'coupons';
    renderCouponsGallery();
    showScreen('couponsScreen');
}

function renderCouponsGallery() {
    const gallery = document.getElementById('couponsGallery');
    gallery.innerHTML = '';
    
    gameData.questions.forEach((question, index) => {
        const couponCard = document.createElement('div');
        couponCard.className = 'coupon-card';
        
        if (unlockedCoupons.includes(question.coupon)) {
            // Cupón desbloqueado
            couponCard.innerHTML = `
                <div class="coupon-header">🎟️ CUPÓN DESBLOQUEADO</div>
                <div class="coupon-content">${question.coupon}</div>
            `;
        } else {
            // Cupón bloqueado
            couponCard.classList.add('locked-coupon');
            couponCard.innerHTML = `
                <div class="coupon-header">🔒 CUPÓN BLOQUEADO</div>
                <div class="coupon-content">Responde correctamente para desbloquear</div>
            `;
        }
        
        gallery.appendChild(couponCard);
    });
}

// ============================================
// INTERFAZ Y EFECTOS VISUALES
// ============================================

function updateProgressBar() {
    const progress = ((currentQuestionIndex) / gameData.questions.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
}

function showGameEnd() {
    document.getElementById('totalCoupons').textContent = unlockedCoupons.length;
    showScreen('endScreen');
    
    // Crear celebración con partículas
    setTimeout(() => {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => createSparkles(), i * 100);
        }
    }, 500);
}

// ============================================
// EFECTOS ESPECIALES Y ANIMACIONES
// ============================================

function createSparkles() {
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = ['✨', '💖', '⭐', '💎', '🎊'][Math.floor(Math.random() * 5)];
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.fontSize = (Math.random() * 20 + 15) + 'px';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }
}

// ============================================
// SISTEMA DE MÚSICA DE FONDO
// ============================================

function initBackgroundMusic() {
    if (!musicStarted) {
        backgroundMusic = document.getElementById('backgroundMusic');
        
        if (backgroundMusic) {
            // Configurar el volumen
            backgroundMusic.volume = 0.3; // Volumen al 30% para que no sea muy fuerte
            
            // Intentar reproducir la música
            const playPromise = backgroundMusic.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('🎵 Música de fondo iniciada exitosamente');
                    musicStarted = true;
                }).catch(error => {
                    console.log('⚠️ No se pudo reproducir la música automáticamente:', error);
                    // Mostrar un mensaje al usuario si es necesario
                });
            }
            
            // Asegurarse de que la música se mantenga en loop
            backgroundMusic.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            });
            
            // Manejar errores de reproducción
            backgroundMusic.addEventListener('error', function(e) {
                console.log('❌ Error al cargar la música:', e);
            });
        }
    }
}

function toggleMusic() {
    if (backgroundMusic) {
        const musicBtn = document.getElementById('musicBtn');
        
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            if (musicBtn) musicBtn.textContent = '🎵 PAUSAR MÚSICA';
        } else {
            backgroundMusic.pause();
            if (musicBtn) musicBtn.textContent = '🎵 REANUDAR MÚSICA';
        }
    }
}

// ============================================
// EFECTOS DE SONIDO (OPCIONAL)
// ============================================

function playSuccessSound() {
    // Crear un sonido simple usando Web Audio API
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.setValueAtTime(440, context.currentTime); // La nota
        oscillator.frequency.setValueAtTime(554.37, context.currentTime + 0.1); // Do#
        oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.2); // Mi
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.5);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.5);
    } catch (error) {
        console.log('Audio no soportado en este navegador');
    }
}

function playErrorSound() {
    try {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        
        oscillator.frequency.setValueAtTime(200, context.currentTime);
        oscillator.frequency.setValueAtTime(150, context.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.3);
        
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.3);
    } catch (error) {
        console.log('Audio no soportado en este navegador');
    }
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

// Guardar progreso en localStorage (opcional)
function saveProgress() {
    const gameProgress = {
        unlockedCoupons: unlockedCoupons,
        currentQuestion: currentQuestionIndex
    };
    localStorage.setItem('loveQuizProgress', JSON.stringify(gameProgress));
}

function loadProgress() {
    const saved = localStorage.getItem('loveQuizProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        unlockedCoupons = progress.unlockedCoupons || [];
        currentQuestionIndex = progress.currentQuestion || 0;
    }
}

// ============================================
// INICIALIZACIÓN DEL JUEGO
// ============================================

// Cargar el juego cuando la página esté ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('💕 Quiz del Amor cargado correctamente! 💕');
    
    // Cargar progreso guardado (opcional)
    // loadProgress();
    
    // Mostrar pantalla de bienvenida
    showScreen('welcomeScreen');
    
    // Añadir eventos de teclado para mejor experiencia
    document.addEventListener('keydown', function(event) {
        if (gameState === 'playing') {
            // Permitir responder con las teclas A, B, C, D
            const key = event.key.toLowerCase();
            if (['a', 'b', 'c', 'd'].includes(key)) {
                const index = key.charCodeAt(0) - 97; // Convertir a-d a 0-3
                const question = gameData.questions[currentQuestionIndex];
                if (index < question.answers.length) {
                    selectAnswer(index);
                }
            }
        } else if (gameState === 'correct' || gameState === 'incorrect') {
            // Continuar con Enter o Espacio
            if (event.key === 'Enter' || event.key === ' ') {
                nextQuestion();
            }
        } else if (gameState === 'welcome') {
            // Comenzar con Enter o Espacio
            if (event.key === 'Enter' || event.key === ' ') {
                startWelcome();
            }
        }
    });
});

// ============================================
// COMENTARIOS PARA PERSONALIZACIÓN
// ============================================

/*
GUÍA PARA PERSONALIZAR EL JUEGO:

1. PERSONALIZAR LA CARTA DE BIENVENIDA:
   - Edita el contenido de la carta en index.html
   - Busca la sección con clase "letter-content"
   - Cambia "[Tu nombre aquí]" por tu nombre real

2. AÑADIR NUEVAS PREGUNTAS:
   - Edita el array 'gameData.questions'
   - Cada pregunta debe tener: id, question, answers, correct, coupon
   - El índice 'correct' empieza en 0

3. CAMBIAR LA MÚSICA:
   - Reemplaza "Floating Cat.mp3" por tu archivo de música
   - Asegúrate de que esté en la misma carpeta
   - Formatos soportados: MP3, WAV, OGG

4. CAMBIAR COLORES:
   - Edita las variables CSS en style.css
   - Busca los gradientes y colores neón para el tema

5. MODIFICAR CUPONES:
   - Cambia el texto en la propiedad 'coupon' de cada pregunta
   - Puedes usar emojis para hacerlos más divertidos

6. AJUSTAR VOLUMEN DE MÚSICA:
   - Modifica backgroundMusic.volume en initBackgroundMusic()
   - Valores de 0.0 (silencio) a 1.0 (máximo)

7. GUARDAR PROGRESO:
   - Descomenta las líneas de saveProgress() y loadProgress()
   - El progreso se guardará automáticamente en el navegador
*/
