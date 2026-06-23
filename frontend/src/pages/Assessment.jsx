import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

const questionsBySkill = {
  1: [ // Video Editing
    { question: "What is a 'cut' in video editing?", options: ["A transition between clips", "A color filter", "An audio track", "A render setting"], answer: 0 },
    { question: "What does FPS stand for?", options: ["File Per Second", "Frames Per Second", "Format Pixel Size", "Final Production Stage"], answer: 1 },
    { question: "Which format is commonly used for video export?", options: ["MP3", "PNG", "MP4", "DOCX"], answer: 2 },
  ],
  2: [ // Frontend Development
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlink Text Markup Language", "None"], answer: 0 },
    { question: "Which tag is used for the largest heading?", options: ["<h6>", "<h1>", "<head>", "<header>"], answer: 1 },
    { question: "Which property changes text color in CSS?", options: ["text-color", "font-color", "color", "text-style"], answer: 2 },
    { question: "Which symbol is used for comments in JavaScript?", options: ["#", "//", "<!-- -->", "**"], answer: 1 },
  ],
  3: [ // Backend Development
    { question: "What is Node.js?", options: ["A database", "A JS runtime", "A CSS framework", "A browser"], answer: 1 },
    { question: "Which HTTP method is used to update data?", options: ["GET", "POST", "PUT", "DELETE"], answer: 2 },
    { question: "What does REST stand for?", options: ["Representational State Transfer", "Remote Server Technology", "Reactive State Tree", "None"], answer: 0 },
  ],
  4: [ // Python Programming
    { question: "Which keyword defines a function in Python?", options: ["func", "def", "function", "lambda"], answer: 1 },
    { question: "What is the output of print(2**3)?", options: ["6", "8", "9", "23"], answer: 1 },
    { question: "Which data type is immutable in Python?", options: ["List", "Dictionary", "Tuple", "Set"], answer: 2 },
  ],
  5: [ // Java Programming
    { question: "Which keyword is used to create a class in Java?", options: ["class", "Class", "struct", "object"], answer: 0 },
    { question: "What is JVM?", options: ["Java Virtual Machine", "Java Visual Mode", "Joint Variable Method", "None"], answer: 0 },
    { question: "Which is NOT an OOP concept?", options: ["Inheritance", "Polymorphism", "Compilation", "Encapsulation"], answer: 2 },
  ],
  6: [ // MongoDB
    { question: "MongoDB stores data in which format?", options: ["XML", "JSON-like BSON", "CSV", "YAML"], answer: 1 },
    { question: "What is a collection in MongoDB?", options: ["A table equivalent", "A row", "A column", "An index"], answer: 0 },
    { question: "Which command finds documents?", options: ["find()", "select()", "get()", "fetch()"], answer: 0 },
  ],
  7: [ // MySQL
    { question: "Which command retrieves data?", options: ["GET", "SELECT", "FETCH", "SHOW"], answer: 1 },
    { question: "What is a Primary Key?", options: ["A duplicate column", "A unique row identifier", "A foreign reference", "An index only"], answer: 1 },
    { question: "Which JOIN returns matched rows only?", options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL JOIN"], answer: 2 },
  ],
  8: [ // Communication Skills
    { question: "What is active listening?", options: ["Talking more", "Fully focusing on the speaker", "Interrupting often", "Ignoring tone"], answer: 1 },
    { question: "Which is a sign of good email etiquette?", options: ["All caps subject", "Clear concise subject line", "No greeting", "Long paragraphs"], answer: 1 },
    { question: "Non-verbal communication includes:", options: ["Tone and body language", "Only words", "Only emails", "None"], answer: 0 },
  ],
};

function Assessment() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const sampleQuestions = questionsBySkill[skillId] || questionsBySkill[2];

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (index) => {
    setSelected(index);
  };

  const handleNext = () => {
    const isCorrect = selected === sampleQuestions[currentQ].answer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setSelected(null);

    if (currentQ + 1 < sampleQuestions.length) {
      setCurrentQ((prev) => prev + 1);
    } else {
      submitAssessment(newScore);
    }
  };

  const submitAssessment = async (finalCount) => {
    const finalScore = Math.round((finalCount / sampleQuestions.length) * 100);
    try {
      await API.post('/assessments', {
        user_id: user.id,
        skill_id: skillId,
        score: finalScore,
      });
    } catch (err) {
      console.error('Error submitting assessment:', err);
    }
    setFinished(true);
  };

  const getLevel = (score) => {
    if (score >= 80) return 'Advanced';
    if (score >= 50) return 'Intermediate';
    return 'Beginner';
  };

  const finalScore = Math.round((score / sampleQuestions.length) * 100);

  if (finished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100 flex items-center justify-center p-8">
        <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md border-2 border-purple-100">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">Assessment Complete!</h2>
          <p className="text-5xl font-bold text-purple-600 mb-2">{finalScore}%</p>
          <p className="text-xl text-gray-700 mb-6">Level: <span className="font-semibold text-purple-700">{getLevel(finalScore)}</span></p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 hover:shadow-lg transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const q = sampleQuestions[currentQ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100 p-8">
      <button onClick={() => navigate(-1)} className="mb-6 text-purple-600 font-medium hover:text-purple-800 transition">
        ← Back to Roadmap
      </button>

      <h1 className="text-3xl font-bold mb-2 text-center text-purple-800">Skill Assessment</h1>
      <p className="text-center text-gray-600 mb-8">Question {currentQ + 1} of {sampleQuestions.length}</p>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-md border-2 border-purple-100">
        <h2 className="text-xl font-semibold text-purple-800 mb-6">{q.question}</h2>
        <div className="space-y-3">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className={
                selected === idx
                  ? "w-full text-left p-4 rounded-lg border-2 border-purple-500 bg-purple-50 text-purple-800 font-medium transition"
                  : "w-full text-left p-4 rounded-lg border-2 border-purple-100 hover:border-purple-300 transition"
              }
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={selected === null}
          className="mt-8 w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 hover:shadow-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentQ + 1 === sampleQuestions.length ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default Assessment;