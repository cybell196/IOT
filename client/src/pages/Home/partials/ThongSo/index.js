import { FaTemperatureLow } from "react-icons/fa6";
import { IoIosWater, IoMdSunny} from "react-icons/io";

function ThongSo() {
    return(
        <div className="grid grid-cols-3 gap-24 h-full">
            <div class="bg-slate-950 bg-opacity-50 flex items-center justify-start p-10 rounded-3xl">
                <div className="grid grid-cols-3 w-full">
                <div className="col-span-2">
                    <p className="text-start text-slate-300 text-3xl font-bold mb-1">Nhiệt độ</p>
                    <p className="text-start text-white text-3xl font-bold">500°C</p>
                </div>

                <div className="col-span-1 ml-12 flex items-center justify-center">
                    <div className="p-6 bg-violet-400 rounded-3xl">
                    <FaTemperatureLow className="text-center text-white text-3xl"/>
                    
                    </div>
                </div>
                </div>
            </div>

            <div class="bg-slate-950 bg-opacity-50 flex items-center justify-start p-10 rounded-3xl">
                <div className="grid grid-cols-3 w-full">
                <div className="col-span-2">
                    <p className="text-start text-slate-300 text-3xl font-bold mb-1">Độ ẩm</p>
                    <p className="text-start text-white text-3xl font-bold">800%</p>
                </div>

                <div className="col-span-1 ml-12 flex items-center justify-center">
                    <div className="p-6 bg-violet-400 rounded-3xl">
                    <IoIosWater className="text-center text-white text-3xl"/>
                    </div>

                </div>
                </div>
            </div>
            
            <div class="bg-slate-950 bg-opacity-50 flex items-center justify-start p-10 rounded-3xl">
                <div className="grid grid-cols-3 w-full">
                <div className="col-span-2">
                    <p className="text-start text-slate-300 text-3xl font-bold mb-1">Ánh sáng</p>
                    <p className="text-start text-white text-3xl font-bold">500 Lux</p>
                </div>

                <div className="col-span-1 ml-12 flex items-center justify-center">
                    <div className="p-6 bg-violet-400 rounded-3xl">
                    <IoMdSunny className="text-center text-white text-3xl"/>
                    </div>
                </div>
                </div>
            </div>
            
        </div>
    );
}

export default ThongSo;