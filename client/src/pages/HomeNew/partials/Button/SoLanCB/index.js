import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AlertCount = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const getCount = async () => {
            try {
                const response = await axios.get('http://localhost:3002/api/action-history/count-alert-on');
                setCount(response.data.count);
            } catch (error) {
                console.error('Error fetching alert count:', error);
            }
        };

        // Call getCount immediately
        getCount();

        // Then call getCount every 5 seconds
        const intervalId = setInterval(getCount, 1000);

        // Clear interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='text-white'>
            Số lần bật của cảnh báo: {count}
        </div>
    );
};

export default AlertCount;