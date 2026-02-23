// Political Compass Quiz Application
class PoliticalQuiz {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.screens = {
            welcome: null,
            quiz: null,
            results: null
        };
        this.storageKey = 'eescit_quiz_progress';
        
        this.initializeElements();
        this.loadQuestions();
        this.bindEvents();
        this.initializeSounds();
        this.loadSavedProgress();
    }

    initializeElements() {
        // Screen elements
        this.screens.welcome = document.getElementById('welcome-screen');
        this.screens.quiz = document.getElementById('quiz-screen');
        this.screens.results = document.getElementById('results-screen');

        // Quiz elements
        this.questionText = document.getElementById('question-text');
        this.questionNumber = document.getElementById('question-number');
        this.questionCounter = document.getElementById('question-counter');
        this.currentAxis = document.getElementById('current-axis');
        this.progressFill = document.getElementById('progress-fill');
        this.answerButtons = document.querySelectorAll('.answer-btn');
        this.prevButton = document.getElementById('prev-question');
        this.nextButton = document.getElementById('next-question');

        // Navigation buttons
        this.startButton = document.getElementById('start-quiz');
        this.restartButton = document.getElementById('restart-quiz');
        this.shareButton = document.getElementById('share-results');
    }

    loadQuestions() {
        // Parse questions from the text file content
        const questionsData = {
            economic: [
                "The state should increase taxes to fund more public services.",
                "A universal basic income should be introduced for all citizens.",
                "Large corporations should be more strictly regulated by the state.",
                "Privatizing public services improves their efficiency.",
                "The minimum wage should be increased regularly.",
                "International free trade benefits the national economy.",
                "The state should intervene to rescue struggling companies.",
                "Reducing public spending is an economic priority.",
                "Economic inequalities are acceptable in a high-performing economy.",
                "Banks should be more strictly controlled by public authorities."
            ],
            environmental: [
                "Governments should strongly limit carbon emissions even if economic growth slows.",
                "Nuclear energy is part of the ecological transition.",
                "Combustion-engine vehicles should be banned in the long term.",
                "Environmental taxes effectively reduce pollution.",
                "Organic farming should receive strong public subsidies.",
                "Polluting companies should face higher financial penalties.",
                "Biodiversity protection should take priority over urban development.",
                "Renewable energy should fully replace fossil fuels.",
                "Citizens should change their lifestyles to fight climate change.",
                "International environmental agreements should be sufficiently effective."
            ],
            societal: [
                "The state should guarantee universal access to healthcare.",
                "Immigration is overall beneficial for society.",
                "Affirmative action policies are necessary to reduce inequalities.",
                "Public surveillance is justified to ensure security.",
                "Individual rights take priority over collective security.",
                "The legal retirement age should be increased.",
                "The state should intervene more to reduce poverty.",
                "Social media platforms should be more strictly regulated by law.",
                "Gender equality has been achieved in modern societies.",
                "Social policies should prioritize equality rather than individual responsibility."
            ],
            cultural: [
                "The state should fund culture and the arts.",
                "Globalization threatens local cultures.",
                "Public media are necessary in a democracy.",
                "Teaching national history should be a priority in schools.",
                "Controversial works should not be censored in public spaces.",
                "The state should encourage the protection of regional languages.",
                "Popular culture is as valuable as so-called 'classical' culture.",
                "Digital platforms promote local cultural production.",
                "National cultural identity is essential to social cohesion.",
                "Cultural subsidies should be allocated based on public interest rather than artistic freedom."
            ],
            industrial: [
                "The state should financially support strategic national industries.",
                "Industrial reshoring should be a political priority.",
                "Strict environmental standards should not harm industrial competitiveness.",
                "Industrial automation should not threaten employment.",
                "Heavy industries should be gradually replaced by more sustainable sectors.",
                "International supply chains are too risky.",
                "The state should impose national production quotas.",
                "Public investments in industrial infrastructure are essential.",
                "International competition should be limited to protect local industry.",
                "Industrial companies should play a greater role in vocational training."
            ],
            technological: [
                "Artificial intelligence should be strongly regulated by governments.",
                "Data protection should not limit technological innovation.",
                "Large technology companies have too much power.",
                "The state should invest massively in scientific research.",
                "Surveillance technologies should be allowed for national security.",
                "Internet access should be considered a fundamental right.",
                "Robots and automation require new social policies.",
                "Cryptocurrencies should be regulated like traditional banks.",
                "Digital platforms should be responsible for content published by their users.",
                "Technological development should improve overall human quality of life."
            ]
        };

        // Convert to flat array with metadata
        let questionIndex = 0;
        for (const [axis, axisQuestions] of Object.entries(questionsData)) {
            axisQuestions.forEach((question, index) => {
                this.questions.push({
                    id: questionIndex++,
                    text: question,
                    axis: axis,
                    axisIndex: index + 1
                });
            });
        }

        // Shuffle questions to mix axes
        this.questions = this.shuffleArray([...this.questions]);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    bindEvents() {
        // Start quiz
        this.startButton.addEventListener('click', () => {
            this.playSound('start');
            this.startQuiz();
        });

        // Answer buttons
        this.answerButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.playSound('answer');
                this.selectAnswer(e);
            });
        });

        // Navigation
        this.prevButton.addEventListener('click', () => {
            this.playSound('navigate');
            this.previousQuestion();
        });
        this.nextButton.addEventListener('click', () => {
            this.playSound('navigate');
            this.nextQuestion();
        });

        // Results actions
        this.restartButton.addEventListener('click', () => {
            this.playSound('click');
            this.restartQuiz();
        });
        this.shareButton.addEventListener('click', () => {
            this.playSound('click');
            this.shareResults();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Save progress before page unload
        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });

        // Auto-save every answer
        window.addEventListener('answer-selected', () => {
            this.saveProgress();
        });
    }

    handleKeyboard(e) {
        if (this.screens.quiz.classList.contains('active')) {
            if (e.key >= '1' && e.key <= '5') {
                const buttonIndex = parseInt(e.key) - 1;
                if (this.answerButtons[buttonIndex]) {
                    this.selectAnswer({ target: this.answerButtons[buttonIndex] });
                }
            } else if (e.key === 'ArrowLeft' && !this.prevButton.disabled) {
                this.previousQuestion();
            } else if (e.key === 'ArrowRight' && !this.nextButton.disabled) {
                this.nextQuestion();
            }
        }
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.showScreen('quiz');
        this.displayQuestion();
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Update question content
        this.questionText.textContent = question.text;
        this.questionNumber.textContent = question.id + 1;
        this.questionCounter.textContent = `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`;
        this.currentAxis.textContent = question.axis.charAt(0).toUpperCase() + question.axis.slice(1);
        
        // Update progress
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        
        // Clear previous selection
        this.answerButtons.forEach(button => button.classList.remove('selected'));
        
        // Restore previous answer if exists
        if (this.answers[question.id] !== undefined) {
            const value = this.answers[question.id];
            const button = this.querySelector(`[data-value="${value}"]`);
            if (button) button.classList.add('selected');
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }

    selectAnswer(e) {
        const button = e.target.closest('.answer-btn');
        if (!button) return;
        
        const value = parseInt(button.dataset.value);
        const question = this.questions[this.currentQuestionIndex];
        
        // Store answer
        this.answers[question.id] = value;
        
        // Update UI
        this.answerButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        
        // Update navigation
        this.updateNavigationButtons();
        
        // Save progress
        this.saveProgress();
        
        // Dispatch custom event for auto-save
        window.dispatchEvent(new CustomEvent('answer-selected'));
        
        // Auto-advance after a short delay (optional)
        setTimeout(() => {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.nextQuestion();
            }
        }, 300);
    }

    updateNavigationButtons() {
        // Previous button
        this.prevButton.disabled = this.currentQuestionIndex === 0;
        
        // Next button
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const hasAnswer = this.answers[currentQuestion.id] !== undefined;
        const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
        
        this.nextButton.disabled = !hasAnswer;
        this.nextButton.textContent = isLastQuestion ? 'See Results' : 'Next';
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const hasAnswer = this.answers[currentQuestion.id] !== undefined;
        
        if (!hasAnswer) return;
        
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    calculateScores() {
        const scores = {
            economic: 0,
            environmental: 0,
            societal: 0,
            cultural: 0,
            industrial: 0,
            technological: 0
        };

        const counts = {
            economic: 0,
            environmental: 0,
            societal: 0,
            cultural: 0,
            industrial: 0,
            technological: 0
        };

        // Calculate raw scores
        this.questions.forEach(question => {
            const answer = this.answers[question.id];
            if (answer !== undefined) {
                scores[question.axis] += answer;
                counts[question.axis]++;
            }
        });

        // Normalize to -100 to +100 scale
        const normalizedScores = {};
        for (const axis in scores) {
            if (counts[axis] > 0) {
                // Convert from -2 to +2 scale to -100 to +100 scale
                normalizedScores[axis] = Math.round((scores[axis] / counts[axis]) * 50);
            } else {
                normalizedScores[axis] = 0;
            }
        }

        return normalizedScores;
    }

    getScoreDescription(score, axis) {
        const descriptions = {
            economic: {
                far_left: "Strongly supports progressive taxation, wealth redistribution, and extensive public services.",
                left: "Supports government intervention in the economy and social safety nets.",
                center: "Balanced approach to economic policy with mixed market elements.",
                right: "Favors free markets, lower taxes, and limited government intervention.",
                far_right: "Strongly advocates for minimal government involvement and pure free markets."
            },
            environmental: {
                far_left: "Strongly supports aggressive environmental regulations and immediate climate action.",
                left: "Supports significant environmental protections and climate policies.",
                center: "Balanced approach to environmental and economic concerns.",
                right: "Prioritizes economic growth over environmental regulations.",
                far_right: "Minimal environmental regulations, favors market-based solutions."
            },
            societal: {
                far_left: "Strongly supports extensive social programs, equality initiatives, and individual rights.",
                left: "Supports social safety nets and progressive social policies.",
                center: "Moderate approach to social issues with balanced policies.",
                right: "Emphasizes personal responsibility and traditional social structures.",
                far_right: "Strongly emphasizes traditional values and limited social programs."
            },
            cultural: {
                far_left: "Strongly supports cultural diversity, public funding for arts, and freedom of expression.",
                left: "Supports cultural pluralism and public cultural investment.",
                center: "Balanced approach to cultural policy and funding.",
                right: "Emphasizes traditional cultural values and selective funding.",
                far_right: "Strongly promotes national culture and limits on cultural diversity."
            },
            industrial: {
                far_left: "Strongly supports industrial nationalization and worker control.",
                left: "Supports significant government involvement in industry.",
                center: "Balanced approach with public-private partnerships.",
                right: "Favors private industry with minimal government interference.",
                far_right: "Strongly advocates for complete deregulation of industry."
            },
            technological: {
                far_left: "Strongly supports strict regulation of technology and data protection.",
                left: "Supports significant government oversight of technology.",
                center: "Balanced approach to innovation and regulation.",
                right: "Favors technological freedom with minimal regulation.",
                far_right: "Strongly advocates for complete technological deregulation."
            }
        };

        const axisDescriptions = descriptions[axis];
        if (score <= -60) return axisDescriptions.far_left;
        if (score <= -20) return axisDescriptions.left;
        if (score <= 20) return axisDescriptions.center;
        if (score <= 60) return axisDescriptions.right;
        return axisDescriptions.far_right;
    }

    getOverallPoliticalTitle(scores) {
        // Calculate overall political leaning based on all scores
        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
        const averageScore = totalScore / Object.keys(scores).length;
        
        // Determine dominant tendencies
        const leftScores = scores.economic + scores.societal + scores.cultural;
        const rightScores = scores.industrial + scores.technological + (100 - scores.environmental);
        
        // Determine political archetypes
        if (averageScore <= -50) {
            if (scores.environmental <= -40) {
                return {
                    title: "Eco-Socialist",
                    description: "You strongly support environmental protection combined with socialist economic policies and progressive social values."
                };
            } else if (scores.economic <= -60) {
                return {
                    title: "Revolutionary Socialist", 
                    description: "You advocate for fundamental economic transformation with strong government control and progressive social policies."
                };
            } else {
                return {
                    title: "Progressive Activist",
                    description: "You champion comprehensive social change, environmental protection, and economic equality."
                };
            }
        } else if (averageScore <= -15) {
            if (scores.environmental <= -30 && scores.economic <= -20) {
                return {
                    title: "Green Progressive",
                    description: "You combine environmental concern with progressive economic and social policies."
                };
            } else if (scores.societal <= -30) {
                return {
                    title: "Social Liberal",
                    description: "You prioritize individual rights, social equality, and democratic reforms."
                };
            } else {
                return {
                    title: "Social Democrat",
                    description: "You support a mixed economy with strong social safety nets and progressive values."
                };
            }
        } else if (averageScore <= 15) {
            if (scores.economic >= 20 && scores.technological >= 20) {
                return {
                    title: "Tech Centrist",
                    description: "You balance economic freedom with technological innovation and moderate social policies."
                };
            } else if (Math.abs(scores.economic) <= 20 && Math.abs(scores.societal) <= 20) {
                return {
                    title: "Moderate Pragmatist",
                    description: "You take balanced approaches across all political dimensions, favoring practical solutions."
                };
            } else {
                return {
                    title: "Centrist",
                    description: "You blend elements from both left and right, seeking balanced solutions to complex issues."
                };
            }
        } else if (averageScore <= 50) {
            if (scores.technological >= 40 && scores.industrial >= 30) {
                return {
                    title: "Techno-Capitalist",
                    description: "You strongly support free markets, technological innovation, and industrial growth."
                };
            } else if (scores.economic >= 30) {
                return {
                    title: "Fiscal Conservative",
                    description: "You prioritize economic freedom, limited government, and fiscal responsibility."
                };
            } else {
                return {
                    title: "Center-Right",
                    description: "You lean toward free markets and traditional values while maintaining some social programs."
                };
            }
        } else {
            if (scores.economic >= 60 && scores.industrial >= 40) {
                return {
                    title: "Libertarian Capitalist",
                    description: "You strongly advocate for minimal government intervention, free markets, and individual liberty."
                };
            } else if (scores.technological >= 60) {
                return {
                    title: "Tech Libertarian",
                    description: "You champion technological freedom, innovation, and minimal regulation of digital platforms."
                };
            } else {
                return {
                    title: "Free Market Advocate",
                    description: "You strongly support unrestricted free markets, individual responsibility, and limited government."
                };
            }
        }
    }

    getIdeologyTitle(score, axis) {
        const ideologies = {
            economic: {
                far_left: "Communist",
                left: "Socialist", 
                center: "Social Democrat",
                right: "Capitalist",
                far_right: "Libertarian"
            },
            environmental: {
                far_left: "Eco-Socialist",
                left: "Green",
                center: "Environmental Pragmatist",
                right: "Skeptic",
                far_right: "Climate Denier"
            },
            societal: {
                far_left: "Progressive",
                left: "Liberal",
                center: "Moderate",
                right: "Conservative",
                far_right: "Traditionalist"
            },
            cultural: {
                far_left: "Cultural Radical",
                left: "Multiculturalist",
                center: "Pluralist",
                right: "Cultural Conservative",
                far_right: "Nationalist"
            },
            industrial: {
                far_left: "Industrial Collectivist",
                left: "Protectionist",
                center: "Mixed Economy",
                right: "Free Trader",
                far_right: "Laissez-Faire"
            },
            technological: {
                far_left: "Tech Regulator",
                left: "Digital Progressive",
                center: "Tech Centrist",
                right: "Tech Optimist",
                far_right: "Tech Libertarian"
            }
        };

        const axisIdeologies = ideologies[axis];
        if (score <= -60) return axisIdeologies.far_left;
        if (score <= -20) return axisIdeologies.left;
        if (score <= 20) return axisIdeologies.center;
        if (score <= 60) return axisIdeologies.right;
        return axisIdeologies.far_right;
    }

    showResults() {
        const scores = this.calculateScores();
        this.playSound('complete');
        this.clearSavedProgress(); // Clear progress after completion
        this.showScreen('results');
        
        // Animate results
        setTimeout(() => {
            this.displayResults(scores);
        }, 300);
    }

    displayResults(scores) {
        const axes = ['economic', 'environmental', 'societal', 'cultural', 'industrial', 'technological'];
        
        // Display overall title
        const overallTitle = this.getOverallPoliticalTitle(scores);
        const generalTitleElement = document.getElementById('general-title');
        const generalDescElement = document.getElementById('general-description');
        
        if (generalTitleElement) {
            generalTitleElement.textContent = overallTitle.title;
        }
        if (generalDescElement) {
            generalDescElement.textContent = overallTitle.description;
        }
        
        axes.forEach(axis => {
            const score = scores[axis];
            const percentage = ((score + 100) / 200) * 100; // Convert -100 to 100 scale to 0-100 percentage
            const ideology = this.getIdeologyTitle(score, axis);
            
            // Update bar
            const fillElement = document.getElementById(`${axis}-fill`);
            const labelElement = document.getElementById(`${axis}-label`);
            const descElement = document.getElementById(`${axis}-desc`);
            
            if (fillElement) {
                fillElement.style.width = `${percentage}%`;
            }
            
            if (labelElement) {
                labelElement.textContent = `${ideology} (${score > 0 ? '+' : ''}${score})`;
            }
            
            if (descElement) {
                descElement.textContent = this.getScoreDescription(score, axis);
            }
        });
    }

    shareResults() {
        const scores = this.calculateScores();
        const text = `I took the Political Compass quiz! My scores:\n` +
            `Economic: ${scores.economic > 0 ? '+' : ''}${scores.economic}\n` +
            `Environmental: ${scores.environmental > 0 ? '+' : ''}${scores.environmental}\n` +
            `Societal: ${scores.societal > 0 ? '+' : ''}${scores.societal}\n` +
            `Cultural: ${scores.cultural > 0 ? '+' : ''}${scores.cultural}\n` +
            `Industrial: ${scores.industrial > 0 ? '+' : ''}${scores.industrial}\n` +
            `Technological: ${scores.technological > 0 ? '+' : ''}${scores.technological}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Political Compass Results',
                text: text
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                alert('Results copied to clipboard!');
            });
        }
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = {};
        this.clearSavedProgress();
        this.showScreen('welcome');
    }

    saveProgress() {
        if (this.currentQuestionIndex > 0 || Object.keys(this.answers).length > 0) {
            const progressData = {
                currentQuestionIndex: this.currentQuestionIndex,
                answers: this.answers,
                timestamp: Date.now(),
                version: '1.0.2'
            };
            localStorage.setItem(this.storageKey, JSON.stringify(progressData));
        }
    }

    loadSavedProgress() {
        try {
            const savedData = localStorage.getItem(this.storageKey);
            if (savedData) {
                const progressData = JSON.parse(savedData);
                
                // Check if saved data is compatible (same version and not too old)
                const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
                if (progressData.timestamp > oneWeekAgo && progressData.version === '1.0.2') {
                    this.answers = progressData.answers || {};
                    this.currentQuestionIndex = progressData.currentQuestionIndex || 0;
                    
                    // Show resume option if there's meaningful progress
                    if (this.currentQuestionIndex > 0 || Object.keys(this.answers).length > 0) {
                        this.showResumeOption();
                    }
                } else {
                    // Clear old or incompatible data
                    this.clearSavedProgress();
                }
            }
        } catch (error) {
            console.error('Error loading saved progress:', error);
            this.clearSavedProgress();
        }
    }

    clearSavedProgress() {
        localStorage.removeItem(this.storageKey);
    }

    showResumeOption() {
        const answeredCount = Object.keys(this.answers).length;
        const progressPercent = Math.round((answeredCount / this.questions.length) * 100);
        
        // Create resume notification
        const resumeNotification = document.createElement('div');
        resumeNotification.className = 'resume-notification';
        resumeNotification.innerHTML = `
            <div class="resume-content">
                <h4><i class="fas fa-save"></i> Progress Saved</h4>
                <p>You've completed ${answeredCount} of ${this.questions.length} questions (${progressPercent}%). Would you like to continue where you left off?</p>
                <div class="resume-actions">
                    <button id="resume-quiz" class="btn btn-primary">
                        <i class="fas fa-play btn-icon"></i>
                        Resume Quiz
                    </button>
                    <button id="clear-progress" class="btn btn-secondary">
                        <i class="fas fa-trash btn-icon"></i>
                        Start Fresh
                    </button>
                </div>
            </div>
        `;
        
        // Add to welcome screen
        const welcomeContent = this.screens.welcome.querySelector('.welcome-content');
        welcomeContent.appendChild(resumeNotification);
        
        // Bind resume events
        document.getElementById('resume-quiz').addEventListener('click', () => {
            this.playSound('start');
            this.showScreen('quiz');
            this.displayQuestion();
            resumeNotification.remove();
        });
        
        document.getElementById('clear-progress').addEventListener('click', () => {
            this.playSound('click');
            this.clearSavedProgress();
            this.currentQuestionIndex = 0;
            this.answers = {};
            resumeNotification.remove();
        });
    }

    showScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        this.screens[screenName].classList.add('active');
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    querySelector(selector) {
        return document.querySelector(selector);
    }

    initializeSounds() {
        // Create audio context for modern sound generation
        this.audioContext = null;
        
        // Initialize audio context on first user interaction
        this.initAudioContext = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
        };
    }

    playSound(type) {
        this.initAudioContext();
        if (!this.audioContext) return;

        const currentTime = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        switch(type) {
            case 'click':
                // Modern click sound - short, clean beep
                oscillator.frequency.setValueAtTime(800, currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.1, currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.05);
                oscillator.start(currentTime);
                oscillator.stop(currentTime + 0.05);
                break;

            case 'start':
                // Start sound - ascending chime
                oscillator.frequency.setValueAtTime(400, currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + 0.1);
                oscillator.frequency.exponentialRampToValueAtTime(1200, currentTime + 0.2);
                gainNode.gain.setValueAtTime(0.15, currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.3);
                oscillator.start(currentTime);
                oscillator.stop(currentTime + 0.3);
                break;

            case 'complete':
                // Completion sound - triumphant melody
                const notes = [523, 659, 784, 1047]; // C, E, G, High C
                notes.forEach((freq, index) => {
                    const osc = this.audioContext.createOscillator();
                    const gain = this.audioContext.createGain();
                    osc.connect(gain);
                    gain.connect(this.audioContext.destination);
                    
                    const startTime = currentTime + (index * 0.1);
                    osc.frequency.setValueAtTime(freq, startTime);
                    gain.gain.setValueAtTime(0.1, startTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.2);
                    osc.start(startTime);
                    osc.stop(startTime + 0.2);
                });
                break;

            case 'answer':
                // Answer selection sound - soft confirmation
                oscillator.frequency.setValueAtTime(600, currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, currentTime + 0.03);
                gainNode.gain.setValueAtTime(0.08, currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.08);
                oscillator.start(currentTime);
                oscillator.stop(currentTime + 0.08);
                break;

            case 'navigate':
                // Navigation sound - subtle swoosh
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(1000, currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(500, currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.05, currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.1);
                oscillator.start(currentTime);
                oscillator.stop(currentTime + 0.1);
                break;
        }
    }
}

// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PoliticalQuiz();
});