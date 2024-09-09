import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';

function MenuItem({ title, to, icon }) {
    return (
        <NavLink to={to} className="w-full">
            {icon}
            <span>{title}</span>
        </NavLink>                                                                                      
    );
}

MenuItem.prototype = {
    icon: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
};

export default MenuItem;