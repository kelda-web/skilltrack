import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

function SkillSelection() {
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get('/skills');
        setSkills(res.data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      }
    };
    fetchSkills();
  }, []);

  const handleSelectSkill = (skillId) => {
    navigate(`/roadmap/${skillId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-purple-800">Select a Skill to Learn</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
        {skills.map((skill) => (
          <div
            key={skill.id}
            onClick={() => handleSelectSkill(skill.id)}
            className="bg-white p-6 rounded-2xl shadow-md cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 border-2 border-purple-100 hover:border-purple-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-purple-700">{skill.name}</h2>
            <p className="text-gray-600">{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillSelection;