document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const workDurationInput = document.getElementById('work-duration');
    const breakDurationInput = document.getElementById('break-duration');
    const workIndicator = document.getElementById('work-indicator');
    const breakIndicator = document.getElementById('break-indicator');
    const progressBar = document.getElementById('progress-bar');
    
    // Variáveis de estado
    let timer;
    let isRunning = false;
    let isWorkTime = true;
    let totalTime = 25 * 60;
    let currentTime = totalTime;
    
    // Inicializar o timer
    function initTimer() {
        const workMinutes = parseInt(workDurationInput.value) || 25;
        const breakMinutes = parseInt(breakDurationInput.value) || 5;
        
        totalTime = (isWorkTime ? workMinutes : breakMinutes) * 60;
        currentTime = totalTime;
        updateDisplay();
        updateModeIndicator();
        updateProgressBar();
    }
    
    // Atualizar o display
    function updateDisplay() {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    // Atualizar indicador de modo
    function updateModeIndicator() {
        if (isWorkTime) {
            workIndicator.classList.add('active');
            breakIndicator.classList.remove('active');
        } else {
            workIndicator.classList.remove('active');
            breakIndicator.classList.add('active');
        }
    }
    
    // Atualizar barra de progresso
    function updateProgressBar() {
        const progress = ((totalTime - currentTime) / totalTime) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    // Iniciar o timer
    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            timer = setInterval(() => {
                if (currentTime > 0) {
                    currentTime--;
                    updateDisplay();
                    updateProgressBar();
                } else {
                    clearInterval(timer);
                    isRunning = false;
                    // Alternar entre trabalho e pausa
                    isWorkTime = !isWorkTime;
                    initTimer();
                    // Tocar um som de notificação
                    playNotificationSound();
                    // Mostrar notificação
                    showNotification();
                }
            }, 1000);
        }
    }
    
    // Pausar o timer
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
    }
    
    // Resetar o timer
    function resetTimer() {
        pauseTimer();
        initTimer();
    }
    
    // Tocar som de notificação
    function playNotificationSound() {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
        audio.play().catch(e => console.log("Não foi possível reproduzir o som: ", e));
    }
    
    // Mostrar notificação
    function showNotification() {
        if (Notification.permission === 'granted') {
            new Notification(
                isWorkTime ? 'Hora de trabalhar!' : 'Hora de descansar!',
                {
                    body: isWorkTime 
                        ? `Sua pausa acabou. Volte ao trabalho por ${workDurationInput.value} minutos.` 
                        : `Bom trabalho! Descanse por ${breakDurationInput.value} minutos.`,
                    icon: isWorkTime 
                        ? 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png' 
                        : 'https://cdn-icons-png.flaticon.com/512/599/599516.png'
                }
            );
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showNotification();
                }
            });
        }
    }
    
    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    workDurationInput.addEventListener('change', () => {
        if (!isRunning && isWorkTime) {
            initTimer();
        }
    });
    
    breakDurationInput.addEventListener('change', () => {
        if (!isRunning && !isWorkTime) {
            initTimer();
        }
    });
    
    // Solicitar permissão para notificações
    if ('Notification' in window) {
        Notification.requestPermission();
    }
    
    // Inicializar
    initTimer();
});