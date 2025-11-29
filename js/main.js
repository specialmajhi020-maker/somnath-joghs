/* ------------------------------------------------
   MAIN.JS FOR JOHSS SAHASPUR EDUCATIONAL WEBSITE
-------------------------------------------------- */

/* ----------------------------
   LOAD COURSES
----------------------------- */
function loadCourses() {
    fetch('data/courses.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("course-list");
            if (!container) return;

            data.forEach(course => {
                const div = document.createElement("div");
                div.className = "course-card";
                div.innerHTML = `
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <a class="button" href="lesson.html?course=${course.id}">View Lessons</a>
                    <a class="button" href="quiz.html?course=${course.id}">Take Quiz</a>
                `;
                container.appendChild(div);
            });
        });
}

/* ----------------------------
   LOAD LESSONS OF A COURSE
----------------------------- */
function loadLessons() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("course");

    fetch('data/courses.json')
        .then(res => res.json())
        .then(courses => {
            const course = courses.find(c => c.id === courseId);
            if (!course) return;

            fetch('data/lessons.json')
                .then(res => res.json())
                .then(allLessons => {
                    const container = document.getElementById("lesson-list");
                    course.lessons.forEach(id => {
                        const lesson = allLessons.find(l => l.id === id);

                        const div = document.createElement("div");
                        div.className = "lesson-card";
                        div.innerHTML = `
                            <h3>${lesson.title}</h3>
                            <video controls src="${lesson.videoURL}"></video>
                            <br>
                            <a class="button" href="${lesson.pdfURL}" target="_blank">Download PDF</a>
                        `;
                        container.appendChild(div);
                    });
                });
        });
}

/* ----------------------------
   LOAD QUIZ QUESTIONS
----------------------------- */
function loadQuiz() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("course");

    fetch('data/quizzes.json')
        .then(res => res.json())
        .then(quizzes => {
            const quiz = quizzes.find(q => q.courseId === courseId);
            if (!quiz) return;

            const container = document.getElementById("quiz-container");

            quiz.questions.forEach((q, index) => {
                const div = document.createElement("div");
                div.className = "quiz-card";

                let optionsHTML = "";
                q.options.forEach((opt, i) => {
                    optionsHTML += `
                        <label>
                            <input type="radio" name="q${index}" value="${i}">
                            ${opt}
                        </label><br>
                    `;
                });

                div.innerHTML = `
                    <h3>Q${index + 1}. ${q.question}</h3>
                    ${optionsHTML}
                `;
                container.appendChild(div);
            });

            container.innerHTML += `
                <button onclick="submitQuiz('${quiz.id}')">Submit Quiz</button>
                <h3 id="quiz-result"></h3>
            `;
        });
}

/* ----------------------------
   SUBMIT QUIZ & CALCULATE SCORE
----------------------------- */
function submitQuiz(quizId) {
    fetch('data/quizzes.json')
        .then(res => res.json())
        .then(quizzes => {
            const quiz = quizzes.find(q => q.id === quizId);
            let score = 0;

            quiz.questions.forEach((q, index) => {
                const selected = document.querySelector(`input[name="q${index}"]:checked`);
                if (selected && parseInt(selected.value) === q.correct) {
                    score++;
                }
            });

            const result = document.getElementById("quiz-result");
            result.innerHTML = `Your Score: ${score} / ${quiz.questions.length}`;
        });
}

/* ----------------------------
   SIMPLE LOGIN SYSTEM
----------------------------- */
function loginUser() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    fetch('data/users.json')
        .then(res => res.json())
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);

            const msg = document.getElementById("login-msg");

            if (user) {
                msg.innerHTML = "Login Successful!";
                msg.style.color = "green";

                // Save login data locally
                localStorage.setItem("loggedInUser", user.username);
                localStorage.setItem("role", user.role);

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 1000);
            } else {
                msg.innerHTML = "Invalid username or password.";
                msg.style.color = "red";
            }
        });
}

/* ----------------------------
   CHECK LOGIN STATUS
----------------------------- */
function checkLogin() {
    const user = localStorage.getItem("loggedInUser");
    const display = document.getElementById("user-info");

    if (user) {
        display.innerHTML = `Logged in as: <b>${user}</b>`;
    }
}

/* ----------------------------
   LOGOUT USER
----------------------------- */
function logoutUser() {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("role");
    window.location.href = "login.html";
}
