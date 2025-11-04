import React, { useState } from 'react';

interface ReadMoreProps {
  html: string;
  maxLength?: number;
  className?: string;
}

const ReadMore: React.FC<ReadMoreProps> = ({ html, maxLength = 600, className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getText = (htmlContent: string) => {
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    return temp.textContent || temp.innerText || '';
  };

  const plainText = getText(html);

  if (plainText.length <= maxLength) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const displayHtml = isExpanded
    ? html
    : html.slice(0, html.indexOf(plainText[maxLength]) + 1) + '...';

  return (
    <div >
      <div className={className}
        dangerouslySetInnerHTML={{ __html: isExpanded ? html : `${displayHtml}` }}
      />
      <button onClick={() => setIsExpanded(!isExpanded)} className="btn btn-light">
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default ReadMore;
