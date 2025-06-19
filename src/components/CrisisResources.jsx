import React from 'react';
import { Phone, MessageSquare, AlertTriangle } from 'lucide-react';

const CrisisResources = () => {
  return (
    <div className="crisis-alert mb-6">
      <div className="flex items-center justify-center gap-2 mb-4">
        <AlertTriangle className="w-6 h-6" />
        <h3 className="text-xl font-bold">Need Immediate Help?</h3>
      </div>
      
      <p className="mb-4">If you're experiencing a crisis or need immediate support:</p>
      
      <div className="grid md:grid-cols-3 gap-4 text-left">
        <div className="bg-red-800/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Phone className="w-5 h-5" />
            <strong>Suicide Prevention</strong>
          </div>
          <p className="text-sm">Call or text 988 (US)</p>
          <p className="text-xs text-red-200">24/7 confidential support</p>
        </div>
        
        <div className="bg-red-800/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5" />
            <strong>Crisis Text Line</strong>
          </div>
          <p className="text-sm">Text HOME to 741741</p>
          <p className="text-xs text-red-200">24/7 text support</p>
        </div>
        
        <div className="bg-red-800/30 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <strong>Emergency</strong>
          </div>
          <p className="text-sm">Call 911</p>
          <p className="text-xs text-red-200">Immediate emergency help</p>
        </div>
      </div>
      
      <p className="text-sm mt-4 text-red-200">
        These resources are available 24/7 and provide immediate, confidential support.
      </p>
    </div>
  );
};

export default CrisisResources;