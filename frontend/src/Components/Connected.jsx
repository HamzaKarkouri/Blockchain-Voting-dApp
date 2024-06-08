// Connected.js
import React from 'react';

function Connected({ account, remainingTime }) {
    return (
        <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-lg shadow-md mb-6 text-white">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Connected Account</h3>
                    <p className="break-all">{account}</p>
                </div>
                <div className="text-right">
                    <h4 className="text-lg font-semibold">Remaining Time</h4>
                    <p>{remainingTime}</p>
                </div>
            </div>
        </div>
    );
}

export default Connected;
