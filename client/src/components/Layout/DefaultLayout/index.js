import Header from "./Header";
import Sidebar from "./Sidebar";

function DefaultLayout({ children }) {
    return (
        <div className="grid grid-cols-11 bg-gradient-to-tr from-indigo-900 to-slate-900 h-screen">
            
            <div style={{position: 'fixed', top: '0', width: '17.5vw'}} className="col-start-1 col-end-3 w-fit">
                <div style={{background: "linear-gradient(111.84deg, rgba(6, 11, 38, 0.94) 59.3%, rgba(26, 31, 55, 0) 100%)", height: 'calc(-32px + 100vh)'}} className="flex items-start justify-center m-6 mr-0 h-full w-90 rounded-3xl pr-18"><Sidebar /></div>    
            </div>

            <div className="col-start-3 col-end-12">
                <div style={{width: 'calc(-350px + 100vw)'}} className="mx-auto">
                    <div className="w-full mt-4 py-8 flex justify-center">
                    <Header />
                    </div>
                    <div className="w-full h-auto">
                        {children}
                    </div>
                </div>
                  
            </div>
        </div>
    );
}

export default DefaultLayout;