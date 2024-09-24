import Button from './partials/Button';
import ThongSo from './partials/ThongSo';
import BieuDo from './partials/BieuDo';


function Home() {
    return (
        <>
            <div className="mb-16">
                <ThongSo />
            </div>

            <div className="grid grid-cols-3 gap-16 h-24">
                <div className="col-span-2 bg-slate-950 bg-opacity-50 rounded-2xl">
                    {/* <div className="text-white text-start font-bold text-3xl ml-8 p-4">Biểu đồ</div> */}
                    <BieuDo />
                </div>

                <div className="col-span-1 bg-slate-950 bg-opacity-50 rounded-2xl h-full">
                    <Button />
                </div>
            </div>
        </>
    );
}

export default Home;
