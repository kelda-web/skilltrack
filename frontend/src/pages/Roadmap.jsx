import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

function Roadmap() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const topicsRes = await API.get(`/roadmaps/${skillId}`);
        setTopics(topicsRes.data);
      } catch (err) {
        console.error('Error fetching topics:', err);
      }

      try {
        if (user && user.id) {
          const progressRes = await API.get(`/progress/${user.id}`);
          const completed = progressRes.data
            .filter((p) => p.completed)
            .map((p) => p.topic_id);
          setCompletedIds(completed);
        }
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };
    fetchData();
  }, [skillId]);

  const toggleComplete = async (topicId, isCompleted) => {
    try {
      await API.post('/progress', {
        user_id: user.id,
        topic_id: topicId,
        completed: !isCompleted,
      });
      setCompletedIds((prev) =>
        isCompleted ? prev.filter((id) => id !== topicId) : [...prev, topicId]
      );
    } catch (err) {
      console.error('Error updating progress:', err);
    }
  };

  const progressPercent = topics.length
    ? Math.round((completedIds.length / topics.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-violet-50 to-indigo-100 p-8">
      <button onClick={() => navigate('/skills')} className="mb-6 text-purple-600 font-medium hover:text-purple-800 transition">
        ← Back to Skills
      </button>

      <h1 className="text-3xl font-bold mb-2 text-center text-purple-800">Learning Roadmap</h1>

      <div className="max-w-2xl mx-auto mb-6">
        <div className="flex justify-between text-sm text-purple-700 mb-1">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-purple-200 rounded-full h-3 overflow-hidden">
          <div className="h-full bg-purple-600 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-3">
        {topics.map((topic) => {
          const isCompleted = completedIds.includes(topic.id);
          return (
            <div key={topic.id} className="bg-white p-5 rounded-xl shadow-md border-2 border-purple-100 hover:border-purple-300 transition flex items-center justify-between">
              <div>
                <h3 className={isCompleted ? "font-semibold text-lg text-gray-400 line-through" : "font-semibold text-lg text-purple-800"}>
                  {topic.topic_name}
                </h3>
                {topic.resource_link && (
                  <a href={topic.resource_link} target="_blank" rel="noreferrer" className="text-sm text-indigo-500 hover:text-indigo-700">
                    View Resource
                  </a>
                )}
              </div>
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => toggleComplete(topic.id, isCompleted)}
                className="w-6 h-6 accent-purple-600 cursor-pointer"
              />
            </div>
          );
        })}
      </div>

      {topics.length > 0 && (
        <div className="text-center mt-8">
          <button onClick={() => navigate(`/assessment/${skillId}`)} className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 hover:shadow-lg transition-all duration-200">
            Take Assessment
          </button>
        </div>
      )}
    </div>
  );
}

export default Roadmap;