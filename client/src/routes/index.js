import config from "~/config";

//Layouts
// import {Header} from "~/layouts/DefaultLayout/Header";

//pages
import Home from "~/pages/Home";
import DataSensor from "~/pages/DataSensor";
import ActionHistory from "~/pages/ActionHistory";
import Profile from "~/pages/Profile";

// Define the public and private routes
const publicRoutes = [
    {path: config.routes.home, component: Home},
    {path: config.routes.datasensor, component: DataSensor},
    {path: config.routes.actionhistory, component: ActionHistory},
    {path: config.routes.profile, component: Profile},
];

const privateRoutes = [

];

export { publicRoutes, privateRoutes };