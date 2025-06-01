document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const resetButton = document.getElementById('resetButton');
    const lapButton = document.getElementById('lapButton');
    const lapsList = document.getElementById('lapsList');

    let startTime = 0;
    let elapsedTime = 0;
    let timerInterval;
    let isRunning = false;
    let lapCounter = 0;

    function formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10); // Show two digits for ms

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
    }


    function updateDisplay() {
        const currentTime = Date.now();
        elapsedTime = currentTime - startTime;
        display.textContent = formatTime(elapsedTime);
    }
    
    function updateDisplayWhilePaused() {
        // This function is used to display the elapsedTime when paused or reset
        display.textContent = formatTime(elapsedTime);
    }


    function startTimer() {
        if (isRunning) return;
        isRunning = true;

        // If elapsedTime is 0, it's a fresh start.
        // If elapsedTime > 0, it's a resume, so adjust startTime.
        startTime = Date.now() - elapsedTime;

        timerInterval = setInterval(updateDisplay, 10); // Update every 10ms for 2-digit ms display

        startButton.disabled = true;
        pauseButton.disabled = false;
        resetButton.disabled = false;
        lapButton.disabled = false;
    }

    function pauseTimer() {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timerInterval);
        // elapsedTime is already correctly set by the last updateDisplay call
        // or by adding (Date.now() - startTime) in a more robust pause
        // but since updateDisplay sets elapsedTime globally, it should be fine.
        // For robustness: elapsedTime += Date.now() - startTime (if updateDisplay didn't set it)
        // But in our case, updateDisplay which calls formatTime(currentTime - startTime)
        // means elapsedTime is already this delta. So simply saving it when pausing is enough.

        startButton.disabled = false;
        pauseButton.disabled = true;
        // Reset and Lap buttons remain as they were (Reset enabled, Lap depends on context)
    }

    function resetTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        elapsedTime = 0;
        lapCounter = 0;
        updateDisplayWhilePaused(); // Show 00:00:00.00
        lapsList.innerHTML = ''; // Clear laps

        startButton.disabled = false;
        pauseButton.disabled = true;
        resetButton.disabled = true;
        lapButton.disabled = true;
    }

    function recordLap() {
        if (!isRunning && elapsedTime === 0) return; // Don't lap if reset or never started

        lapCounter++;
        const lapTime = display.textContent; // Get current displayed time

        const li = document.createElement('li');
        const lapNumberSpan = document.createElement('span');
        lapNumberSpan.className = 'lap-number';
        lapNumberSpan.textContent = `Lap ${lapCounter}`;

        const lapTimeSpan = document.createElement('span');
        lapTimeSpan.textContent = lapTime;
        
        li.appendChild(lapNumberSpan);
        li.appendChild(lapTimeSpan);
        
        lapsList.prepend(li); // Add new laps to the top
    }

    // Event Listeners
    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
    lapButton.addEventListener('click', recordLap);

    // Initial state
    resetTimer(); // Call reset to set initial button states and display
});