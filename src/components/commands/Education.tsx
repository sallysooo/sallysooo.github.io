import React from 'react';

const education = [
  {
    title: "🎓 Education",
    desc: "Junior at Sookmyung Women's University",
  },
  {
    title: "💻 Major",
    desc: "Data Science & Big Data Engineering in Department of Software",
  },
  {
    title: "🔐 CLUB Activities",
    desc: "Web Hacking Academic Director · Member @ SISS (Sookmyung Information Security Study) | 2023~\nAI Research Memeber @ BOAZ (https://www.bigdataboaz.com/)",
  },
  {
    title: "💡 Interests",
    desc: "Anomaly Detection, AI-driven Security, Data Mining, Data Engineering",
  },
  {
    title: "🏫 Currently in SNSec. Lab @ SMWU",
    desc: "I'm working as an undergraduate research intern at the System Network Security Lab, focusing on real-time anomaly detection in automotive Ethernet traffic using unsupervised deep learning. > Advisor: Prof. Seonghoon Jeong",
  },
];

const Education: React.FC = () => {
  return (
    <div>
      {education.map((edu, index) => (
        <div key={index} className="education">
          <h3>{edu.title}</h3>
          <p>{edu.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default Education
