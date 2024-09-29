import { useEffect, useState } from 'react';
import { FaTemperatureLow } from 'react-icons/fa6';
import { IoIosWater, IoMdSunny } from 'react-icons/io';
import { fetchLastData } from './api'; // Import hàm gọi API từ file api.js
import { connectWebSocket } from '../webSocket'; // Import hàm WebSocket từ file webSocket.js

import CountUp from 'react-countup';

function ThongSo() {
    const [data, setData] = useState({ nhietdo: 0, doam: 0, anhsang: 0 });
    const [oldData, setOldData] = useState({ nhietdo: 0, doam: 0, anhsang: 0 });
    
    useEffect(() => {
        const loadData = async () => {
            const result = await fetchLastData();
            const oldDataTemp = { ...data }; // Lưu giá trị cũ của data
            setData({
                nhietdo: result.nhiet_do,
                doam: result.do_am,
                anhsang: result.anh_sang,
            });
            setOldData(oldDataTemp);
        };
        loadData();

        const ws = connectWebSocket(setData); // Chỉ sử dụng kết nối WebSocket chung
        return () => ws && ws.close(); // Đóng kết nối khi component unmount
    }, []);

    return (
        <div className="grid grid-cols-3 gap-24 h-full">
            
            <div class="bg-slate-950 bg-opacity-50 flex items-center justify-start p-10 rounded-3xl">
                <div className="grid grid-cols-3 w-full">
                    <div className="col-span-2">
                        <p className="text-start text-slate-300 text-3xl font-bold mb-1">Nhiệt độ</p>
                        <p className="text-start text-white text-3xl font-bold">
                            <CountUp start={oldData.nhietdo} end={data.nhietdo} decimals={1} suffix="°C" />
                        </p>
                    </div>

                    <div className="col-span-1 ml-12 flex items-center justify-center">
                        <div className={`p-6 rounded-3xl transition-all duration-300 ${
                                data.nhietdo > 27 ? 'bg-red-500' : 'bg-orange-400'}`}>
                            <FaTemperatureLow className="text-center text-white text-3xl animate-bounce" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-950 bg-opacity-50 flex items-center justify-start p-10 rounded-3xl">
                <div className="grid grid-cols-3 w-full">
                    <div className="col-span-2">
                        <p className="text-start text-slate-300 text-3xl font-bold mb-1">Độ ẩm</p>
                        <p className="text-start text-white text-3xl font-bold">
                            <CountUp start={oldData.doam} end={data.doam} decimals={1} suffix="%" />
                        </p>
                    </div>

                    <div className="col-span-1 ml-12 flex items-center justify-center">
                        <div className={`p-6 rounded-3xl transition-all duration-300 ${
                                data.doam > 90 ? 'bg-cyan-600' : 'bg-cyan-400'}`}>
                            <IoIosWater className="text-center text-white text-3xl animate-drip" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-slate-950 bg-opacity-50 flex items-center justify-start p-10 rounded-3xl">
                <div className="grid grid-cols-3 w-full">
                    <div className="col-span-2">
                        <p className="text-start text-slate-300 text-3xl font-bold mb-1">Ánh sáng</p>
                        <p className="text-start text-white text-3xl font-bold">
                            <CountUp start={oldData.anhsang} end={data.anhsang} decimals={1} suffix=" Lux" />
                        </p>
                    </div>

                    <div className="col-span-1 ml-12 flex items-center justify-center">
                        <div className={`p-6 rounded-3xl transition-all duration-1000 ${
                                data.anhsang > 2200 ? 'bg-yellow-400' : 'bg-yellow-300'}`}>
                            <IoMdSunny className="text-center text-yellow-600 text-3xl animate-ping " />
                        </div>
                    </div>
                </div>
            </div>

            {/* <div class="bg-slate-950 bg-opacity-50 flex items-center justify-start p-10 rounded-3xl">
                <div className="grid grid-cols-3 w-full">
                    <div className="col-span-2">
                        <p className="text-start text-slate-300 text-3xl font-bold mb-1">Doodj buij</p>
                        <p className="text-start text-white text-3xl font-bold">
                            <CountUp start={oldData.anhsang} end={data.anhsang} decimals={1} suffix=" Lux" />
                        </p>
                    </div>

                    <div className="col-span-1 ml-12 flex items-center justify-center">
                        <div className="p-6 bg-violet-400 rounded-3xl">
                            <IoMdSunny className="text-center text-white text-3xl" />
                        </div>
                    </div>
                </div>
            </div> */}

        </div>
    );
}

export default ThongSo;
