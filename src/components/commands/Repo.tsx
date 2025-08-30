import React, { useEffect } from 'react';

const Repo: React.FC = () => {
  useEffect(() => {
    window.open("https://github.com/sallysooo", "_blank");
  }, []);

  return <div className='wrapper'>opening github on another tab...</div>;
};

export default Repo
