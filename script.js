class FitnessTracker {
    constructor() {
        this.workouts = JSON.parse(localStorage.getItem('workouts')) || [];
        this.form = document.getElementById('workout-form');
        this.workoutList = document.getElementById('workouts');
        this.themeToggle = document.getElementById('theme-toggle');
        this.chartCanvas = document.getElementById('chart');
        this.heartRateEl = document.getElementById('heart-rate');
        this.waterIntakeEl = document.getElementById('water-intake');
        this.goalProgressEl = document.getElementById('goal-progress');
        this.sleepInput = document.getElementById('sleep-hours');
        this.leaderboardEl = document.getElementById('leaderboard');

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        this.sleepInput.addEventListener('input', this.trackSleep.bind(this));
        document.getElementById('connect-watch').addEventListener('click', this.connectSmartwatch.bind(this));

        this.displayWorkouts();
        this.updateStats();
        this.loadTheme();
        this.updateLeaderboard();
        this.generateChart();
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const workout = {
            id: Date.now(),
            category: document.getElementById('category').value,
            exercise: document.getElementById('exercise').value,
            duration: parseInt(document.getElementById('duration').value),
            calories: parseInt(document.getElementById('calories').value),
            heartRate: parseInt(document.getElementById('heart-rate-input').value) || 0,
            waterIntake: parseFloat(document.getElementById('water-intake-input').value) || 0,
            goal: parseInt(document.getElementById('goal-input').value) || 2000,
            date: new Date().toLocaleDateString(),
            timestamp: new Date().getTime()
        };

        this.workouts.push(workout);
        this.saveToLocalStorage();
        this.displayWorkouts();
        this.updateStats();
        this.generateChart();
        this.form.reset();
    }

    deleteWorkout(id) {
        this.workouts = this.workouts.filter(workout => workout.id !== id);
        this.saveToLocalStorage();
        this.displayWorkouts();
        this.updateStats();
        this.generateChart();
    }

    saveToLocalStorage() {
        localStorage.setItem('workouts', JSON.stringify(this.workouts));
    }

    getCategoryIcon(category) {
        const icons = {
            cardio: 'fa-running',
            strength: 'fa-dumbbell',
            yoga: 'fa-pray',
            hiit: 'fa-bolt',
            sports: 'fa-basketball-ball'
        };
        return icons[category] || 'fa-dumbbell';
    }

    displayWorkouts() {
        this.workoutList.innerHTML = this.workouts
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(workout => `
                <div class="workout-item animate__animated animate__fadeInUp">
                    <div class="workout-header">
                        <i class="fas ${this.getCategoryIcon(workout.category)}"></i>
                        <strong>${workout.exercise}</strong>
                    </div>
                    <div class="workout-meta">
                        <div><i class="fas fa-clock"></i> ${workout.duration} min</div>
                        <div><i class="fas fa-fire"></i> ${workout.calories} cal</div>
                        <div><i class="fas fa-heartbeat"></i> ${workout.heartRate} bpm</div>
                        <div><i class="fas fa-glass-whiskey"></i> ${workout.waterIntake} L</div>
                        <div><i class="fas fa-calendar"></i> ${workout.date}</div>
                    </div>
                    <button onclick="fitnessTracker.deleteWorkout(${workout.id})" class="delete-btn">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `)
            .join('');
    }

    updateStats() {
        const totalCalories = this.workouts.reduce((sum, workout) => sum + workout.calories, 0);
        const totalDuration = this.workouts.reduce((sum, workout) => sum + workout.duration, 0);
        const totalHeartRate = this.workouts.reduce((sum, workout) => sum + workout.heartRate, 0);
        const totalWaterIntake = this.workouts.reduce((sum, workout) => sum + workout.waterIntake, 0);
        const totalWorkouts = this.workouts.length;

        document.getElementById('total-calories').textContent = totalCalories.toLocaleString();
        document.getElementById('total-duration').textContent = totalDuration.toLocaleString();
        document.getElementById('total-workouts').textContent = totalWorkouts;
        this.heartRateEl.textContent = totalHeartRate ? (totalHeartRate / totalWorkouts).toFixed(0) + " bpm" : "-- bpm";
        this.waterIntakeEl.textContent = totalWaterIntake.toFixed(1) + " L";

        const goalAchieved = totalWorkouts > 0 ? (totalCalories / this.workouts[0].goal) * 100 : 0;
        this.goalProgressEl.textContent = `${goalAchieved.toFixed(1)}%`;
    }

    toggleTheme() {
        const html = document.documentElement;
        const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        this.themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    }

    generateChart() {
        const ctx = this.chartCanvas.getContext('2d');
        if (this.chart) this.chart.destroy();

        const labels = this.workouts.map(w => w.date);
        const data = this.workouts.map(w => w.calories);

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Calories Burned',
                    data,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: '#36a2eb',
                    borderWidth: 2
                }]
            }
        });
    }

    connectSmartwatch() {
        alert("⌚ Connecting to smartwatch...");
        setTimeout(() => {
            alert("✅ Smartwatch connected! Heart rate tracking enabled.");
            let liveHeartRate = 75 + Math.floor(Math.random() * 10);
            setInterval(() => {
                liveHeartRate += Math.random() > 0.5 ? 1 : -1;
                this.heartRateEl.textContent = `${liveHeartRate} bpm`;
            }, 5000);
        }, 2000);
    }

    trackSleep() {
        const hours = this.sleepInput.value;
        document.getElementById('sleep-tracker').innerHTML = `<p>😴 You slept ${hours} hours last night!</p>`;
    }

    updateLeaderboard() {
        this.leaderboardEl.innerHTML = `<p>🏆 You are ranked #${Math.floor(Math.random() * 5) + 1} this week!</p>`;
    }
}
class FitTrackPro {
    constructor() {
        this.workouts = JSON.parse(localStorage.getItem('workouts')) || [];
        this.leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [
            { name: "Alex", score: 500 },
            { name: "Chris", score: 450 },
            { name: "Jordan", score: 400 },
        ];
        this.theme = localStorage.getItem("theme") || "light";
        
        document.getElementById('workout-form').addEventListener('submit', this.logWorkout.bind(this));
        document.getElementById('theme-toggle').addEventListener('click', this.toggleTheme.bind(this));
        
        this.loadTheme();
        this.updateStats();
        this.displayLeaderboard();
        this.displayWorkoutHistory();
    }

    logWorkout(event) {
        event.preventDefault();
        
        const exercise = document.getElementById("exercise").value;
        const duration = parseInt(document.getElementById("duration").value);
        const calories = parseInt(document.getElementById("calories").value);
        const heartRate = document.getElementById("heart-rate-input").value || "--";
        const goal = parseInt(document.getElementById("goal-input").value) || 2000;
        const waterIntake = parseFloat(document.getElementById("water-intake-input").value) || 0;
        
        const workout = { exercise, duration, calories, heartRate, date: new Date().toLocaleString() };
        
        this.workouts.push(workout);
        localStorage.setItem("workouts", JSON.stringify(this.workouts));
        
        this.updateStats();
        this.displayWorkoutHistory();
        this.updateProgress(goal, calories);
        
        document.getElementById("workout-form").reset();
    }

    updateStats() {
        const totalCalories = this.workouts.reduce((sum, w) => sum + w.calories, 0);
        const totalDuration = this.workouts.reduce((sum, w) => sum + w.duration, 0);
        document.getElementById("total-calories").textContent = totalCalories;
        document.getElementById("total-duration").textContent = totalDuration;
    }

    displayWorkoutHistory() {
        const history = document.getElementById("workout-history");
        history.innerHTML = this.workouts.slice(-5).map(w => `
            <div class="workout-entry">
                <strong>${w.exercise}</strong> - ${w.duration} min - ${w.calories} cal
            </div>
        `).join("");
    }

    displayLeaderboard() {
        const leaderboardList = document.getElementById("leaderboard-list");
        leaderboardList.innerHTML = this.leaderboard
            .sort((a, b) => b.score - a.score)
            .map(user => `<li>${user.name} - ${user.score} pts</li>`)
            .join("");
    }

    updateProgress(goal, caloriesBurned) {
        const percentage = Math.min((caloriesBurned / goal) * 100, 100);
        document.getElementById("progress-bar").style.width = percentage + "%";
        document.getElementById("goal-progress").textContent = percentage.toFixed(1) + "%";
    }

    toggleTheme() {
        this.theme = this.theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", this.theme);
        localStorage.setItem("theme", this.theme);
    }

    loadTheme() {
        document.documentElement.setAttribute("data-theme", this.theme);
    }
}

const fitTrack = new FitTrackPro();

const fitnessTracker = new FitnessTracker();
