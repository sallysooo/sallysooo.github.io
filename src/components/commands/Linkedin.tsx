import React, { useEffect } from 'react';

const Linkedin: React.FC = () => {
  useEffect(() => {
    window.open("https://www.linkedin.com/in/jisoo-kim-66619b2bb/", "_blank");
  }, []);

  return <div className='wrapper'>be my friend!</div>;
};

export default Linkedin
