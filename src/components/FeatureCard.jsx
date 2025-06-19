import React from 'react';

const FeatureCard = ({ feature }) => {
  return (
    <div className="feature-card">
      <div className="flex items-start gap-3">
        <div className="text-primary-500 flex-shrink-0">
          {feature.icon}
        </div>
        <div>
          <h4 className="font-semibold mb-1">{feature.title}</h4>
          <p className="text-sm text-dark-text/80">{feature.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;