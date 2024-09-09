import BongDen from "./BongDen";
import Quat from "./Quat";
import DieuHoa from "./DieuHoa";
export default function Button() {
  return (
    <div className="grid grid-rows-3 gap-8 items-center justify-center p-12 h-full"> 
        <style jsx>{`
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              
              .spin {
                animation: spin 2s linear infinite;
              }
        `}</style>  
        <BongDen/>
        <Quat/>
        <DieuHoa/>
    </div> 

  );
}
