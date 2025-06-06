// ============================================
// CONFIGURACIÓN DEL JUEGO
// ============================================

// Base de datos de preguntas y cupones (fácil de modificar)
const gameData = {
    questions: [
        {
            id: 1,
            question: "¿Cuál fue nuestro primer lugar de cita oficial?",
            answers: [
                "El parque central",
                "El cine del centro comercial", 
                "La cafetería de la esquina",
                "El restaurante italiano"
            ],
            correct: 1, // Índice de la respuesta correcta (empezando en 0)
            coupon: "Vale por desayuno en la cama 🍳"
        },
        {
            id: 2,
            question: "¿Cuál es mi comida favorita que tú cocinas?",
            answers: [
                "Pasta con salsa boloñesa",
                "Pollo al horno con verduras",
                "Tacos de carnitas",
                "Pizza casera"
            ],
            correct: 2,
            coupon: "Un masaje de 20 minutos 💆‍♀️"
        },
        {
            id: 3,
            question: "¿Qué película vimos en nuestra primera noche de películas?",
            answers: [
                "Una comedia romántica",
                "Una película de acción",
                "Una película de terror",
                "Una película de Disney"
            ],
            correct: 0,
            coupon: "Una noche de peli y manta 🍿"
        }
    ]
};

// ============================================
// VARIABLES GLOBALES DEL JUEGO
// ============================================

let currentQuestionIndex = 0;
let unlockedCoupons = [];
let gameState = 'start'; // start, playing, correct, incorrect, coupons, end

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

// Cargar el juego cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    console.log('💕 Quiz del Amor cargado correctamente! 💕');
    
    // Cargar progreso guardado (opcional)
    // loadProgress();
    
    // Mostrar pantalla de inicio
    showScreen('startScreen');
    
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
        }
    });
});

// ============================================
// COMENTARIOS PARA PERSONALIZACIÓN
// ============================================

/*
GUÍA PARA PERSONALIZAR EL JUEGO:

1. AÑADIR NUEVAS PREGUNTAS:
   - Edita el array 'gameData.questions'
   - Cada pregunta debe tener: id, question, answers, correct, coupon
   - El índice 'correct' empieza en 0

2. CAMBIAR COLORES:
   - Edita las variables CSS en style.css
   - Busca los gradientes y colores neón para el tema

3. AÑADIR SONIDOS:
   - Reemplaza las funciones playSuccessSound() y playErrorSound()
   - Puedes usar archivos MP3 o la Web Audio API

4. MODIFICAR CUPONES:
   - Cambia el texto en la propiedad 'coupon' de cada pregunta
   - Puedes usar emojis para hacerlos más divertidos

5. AJUSTAR DIFICULTAD:
   - Cambia el número de opciones de respuesta
   - Modifica el texto de las preguntas

6. GUARDAR PROGRESO:
   - Descomenta las líneas de saveProgress() y loadProgress()
   - El progreso se guardará automáticamente en el navegador
*/
