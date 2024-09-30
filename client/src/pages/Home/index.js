import Button from './partials/Button';
import ThongSo from './partials/ThongSo';
import BieuDo from './partials/BieuDo';
// import BieuDo2 from './partials/BieuDo2';


function Home() {
    return (
        <div className=''>
            <div className="mb-16">
                <ThongSo />
            </div>

            <div className="grid grid-cols-3 gap-16 h-24">
                <div className="col-span-2  rounded-2xl">
                    {/* <div className="text-white text-start font-bold text-3xl ml-8 p-4">Biểu đồ</div> */}
                    <div className='grid grid-rows-1 gap-4'>
                        <div className='bg-slate-950 bg-opacity-50 rounded-2xl'><BieuDo /></div>
                        {/* <div className='bg-slate-950 bg-opacity-50 rounded-2xl'><BieuDo2 /></div> */}
                    </div>
                </div>

                <div className="col-span-1 bg-slate-950 bg-opacity-50 rounded-2xl max-h-[380px]">
                    <Button />
                </div>
            </div>
        </div>
    );
}

export default Home;
