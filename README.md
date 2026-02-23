# EESCIT Project | Political Quiz

A modern, interactive political compass quiz that measures users' political positions across 6 key dimensions: Economic, Environmental, Societal, Cultural, Industrial, and Technological.

## Features

### 🎯 Quiz Functionality
- **60 Questions**: 10 questions per political dimension
- **5-Point Scale**: Strongly Against, Against, Neutral, For, Strongly For
- **Smart Navigation**: Previous/Next buttons with return to last question system
- **Keyboard Support**: Use keys 1-5 for answers, arrow keys for navigation
- **Progress Tracking**: Visual progress bar showing quiz completion

### 📊 Results & Scoring
- **6-Axis Scoring**: Scores calculated on -100 to +100 scale for each dimension
- **Ideology Labels**: Automatic assignment of ideology titles based on scores
  - Economic: Communist, Socialist, Social Democrat, Capitalist, Libertarian
  - Environmental: Eco-Socialist, Green, Environmental Pragmatist, Skeptic, Climate Denier
  - Societal: Progressive, Liberal, Moderate, Conservative, Traditionalist
  - Cultural: Cultural Radical, Multiculturalist, Pluralist, Cultural Conservative, Nationalist
  - Industrial: Industrial Collectivist, Protectionist, Mixed Economy, Free Trader, Laissez-Faire
  - Technological: Tech Regulator, Digital Progressive, Tech Centrist, Tech Optimist, Tech Libertarian
- **Detailed Descriptions**: Personalized descriptions for each political position
- **Share Results**: Built-in sharing functionality to copy or share results

### 🎨 Design & UX
- **Modern Interface**: Clean black and white design with gray gradients
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Elegant transitions and micro-interactions
- **Accessibility**: Proper focus states and keyboard navigation
- **Fast Performance**: Optimized for quick loading and smooth interactions

## Technical Details

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Typography**: Inter font family (Google Fonts)
- **No Dependencies**: Completely self-contained, no external frameworks required

### File Structure
```
EESCIT Project/
├── frontend/
│   ├── index.html          # Main quiz interface
│   └── style.css           # Modern styling and animations
├── backend/
│   └── script.js           # Quiz logic and scoring
├── ressources/
│   └── misc/
│       └── questions.txt   # Quiz questions database
├── README.md               # This file
└── LICENSE.md              # License information
```

### Scoring Algorithm
The quiz uses a weighted scoring system:
- **Answer Values**: Strongly Against (-2), Against (-1), Neutral (0), For (+1), Strongly For (+2)
- **Normalization**: Raw scores are normalized to -100 to +100 scale
- **Ideology Mapping**: Scores are mapped to ideology labels based on predefined ranges
  - Far Left: ≤ -60
  - Left: -60 to -20
  - Center: -20 to +20
  - Right: +20 to +60
  - Far Right: ≥ +60

## Getting Started

### Installation
1. Clone or download the project files
2. Open `frontend/index.html` in a web browser
3. No additional setup required!

### Usage
1. Click "Start Quiz" to begin
2. Answer each question using the buttons or keyboard (1-5)
3. Navigate between questions using Previous/Next buttons or arrow keys
4. View your results on the final screen
5. Share your results or retake the quiz

## Customization

### Adding Questions
Edit `ressources/misc/questions.txt` to add or modify questions. Follow the existing format:
```
[Axis Name]
[Number]. [Question text]
```

### Modifying Scoring
Update the scoring logic in `backend/script.js`:
- Modify `getIdeologyTitle()` to change ideology labels
- Update `getScoreDescription()` to change descriptions
- Adjust score ranges in the scoring algorithm

### Styling Changes
Edit `frontend/style.css` to customize:
- Colors and themes
- Animations and transitions
- Layout and responsive breakpoints
- Typography and spacing

## Browser Support

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Features Used**: CSS Grid, Flexbox, CSS Variables, ES6+ JavaScript

## License

This project is licensed under All Rights Reserved except for personal use. See [LICENSE.md](LICENSE.md) for details.

## Author

Created by Dean Fink - Copyright © 2026

---

**Note**: This quiz is designed for educational and entertainment purposes. The political labels and descriptions are simplified representations and may not capture the full complexity of political ideologies.