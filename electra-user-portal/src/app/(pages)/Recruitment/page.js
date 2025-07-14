import React from 'react';

const Page = () => {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSd5BPH56MWWzI6ZyBg0whZHijYwKNYS4Xic0GxmbNfymGgWhw/viewform?embedded=true"
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
        loading="lazy"
      >
        Loading…
      </iframe>
    </div>
  );
};

export default Page;
