// import React, { useEffect } from 'react';

// const IndexSection = ({ trainingId, chapterId }) => {
//   useEffect(() => {
//     if (!trainingId || !chapterId) return;
//     console.log("IndexSection mounted for:", trainingId, chapterId);
//     // future: load index data or enable index inputs
//   }, [trainingId, chapterId]);

//   return (
//     <div className="text-white">
//       <h3 className="text-lg font-bold mb-2 text-blue-400">Index Section</h3>
//       {chapterId ? (
//         <p>Now you can add topics/subtopics to Chapter ID: {chapterId}</p>
//       ) : (
//         <p>This is where you’ll add topics & subtopics.</p>
//       )}
//     </div>
//   );
// };

// export default IndexSection;

import React from 'react';

const IndexSection = () => {
  return (
    <div className="text-white">
      <h3 className="text-lg font-bold mb-2 text-blue-400">Index Section</h3>
      <p>This is where you’ll add topics & subtopics.</p>
    </div>
  );
};

export default IndexSection;
