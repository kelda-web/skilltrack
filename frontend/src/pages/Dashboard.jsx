import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [skills, setSkills] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [roadmaps, setRoadmaps] = useState({});
  const [photo, setPhoto] = useState(localStorage.getItem('profilePhoto') || null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skillsRes = await API.get('/skills');
        setSkills(skillsRes.data);

        const progressRes = await API.get(`/progress/${user.id}`);
        setProgressData(progressRes.data);

        const assessRes = await API.get(`/assessments/${user.id}`);
        setAssessments(assessRes.data);

        const roadmapMap = {};
        for (const skill of skillsRes.data) {
          const r = await API.get(`/roadmaps/${skill.id}`);
          roadmapMap[skill.id] = r.data;
        }
        setRoadmaps(roadmapMap);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      }
    };
    fetchData();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      localStorage.setItem('profilePhoto', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getSkillProgress = (skillId) => {
    const topics = roadmaps[skillId] || [];
    if (topics.length === 0) return 0;
    const topicIds = topics.map((t) => t.id);
    const completed = progressData.filter(
      (p) => topicIds.includes(p.topic_id) && p.completed
    ).length;
    return Math.round((completed / topics.length) * 100);
  };

  const getLatestAssessment = (skillId) => {
    const results = assessments.filter((a) => a.skill_id === skillId);
    return results.length ? results[results.length - 1] : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer group">
              {photo ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-purple-300 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-purple-300 flex items-center justify-center text-white text-2xl font-bold border-4 border-purple-300 shadow-md">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition">
                Change
              </div>
              <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </label>
            <div>
              <h1 className="text-2xl font-bold text-purple-800">Welcome, {user?.name}</h1>
              <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white text-purple-700 border-2 border-purple-300 px-5 py-2 rounded-lg font-medium hover:bg-purple-50 transition"
          >
            Logout
          </button>
        </div>

        <h2 className="text-xl font-semibold text-purple-800 mb-4">Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill) => {
            const progress = getSkillProgress(skill.id);
            const latest = getLatestAssessment(skill.id);
            return (
              <div
                key={skill.id}
                className="bg-white p-5 rounded-xl shadow-md border-2 border-purple-100 cursor-pointer hover:border-purple-300 transition"
                onClick={() => navigate(`/roadmap/${skill.id}`)}
              >
                <h3 className="font-semibold text-purple-800 mb-2">{skill.name}</h3>
                <div className="w-full bg-purple-200 rounded-full h-2 overflow-hidden mb-2">
                  <div
                    className="h-full bg-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{progress}% complete</span>
                  {latest ? (
                    <span className="text-purple-700 font-medium">
                      {latest.score}% • {latest.level}
                    </span>
                  ) : (
                    <span className="text-gray-400">Not assessed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate('/skills')}
            className="text-purple-600 font-medium hover:text-purple-800 transition"
          >
            ← Back to Skill Selection
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;