import { useContext } from "react";
import { UserContext, useUserContext } from "./Context";

function NavBar() {
    const { user } = useUserContext();
    return (
        <nav>
            <div className="profile">{user ? user.username : "Loading..."}</div>
        </nav>
    );
}

export default NavBar;
