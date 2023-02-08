import React from "react";
import "../css/Header.css";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { basketActions } from "../store";
import { useSelector, useDispatch } from "react-redux";
import { Menu, Search } from "@mui/icons-material/";
import { Link } from "react-router-dom";
import { auth } from "../FireBaseApp";
function Header() {
  let user = useSelector((state) => state.basket.user);

  let basket = useSelector((state) => state.basket.basket);
  let totalAmount = basket.reduce((acc, item) => item.amount + acc, 0);
  let dispatch = useDispatch();

  let handleAuthentication = () => {
    if (user?.email) {
      auth.signOut();
    } else {
      auth.onAuthStateChanged((authUser) => {
        dispatch(
          basketActions.setUser({ email: authUser?.email, uid: authUser?.uid })
        );
      });
    }
  };

  return (
    <div className="header">
      <div className="header__top">
        <div className="header__1">
          <Link to="/">
            <img
              src="http://pngimg.com/uploads/amazon/amazon_PNG11.png"
              alt="logo"
            />
          </Link>
        </div>
        <div className="header__search header__2">
          <input type="text" className="header__searchInput" />

          <div className="header__searchIcon">
            <Search />
          </div>
        </div>
        <div className="header__nav header__3">
          <Link to={user?.email ? "/" : "/login"}>
            <div className="header__option" onClick={handleAuthentication}>
              <span className="header__optionLineOne">
                Hello , {user?.email ? user.email : "Guest"}
              </span>
              <span className="header__optionLineTwo">
                {!user?.email ? "Sign In" : "Sign out"}
              </span>
            </div>
          </Link>
          <Link to={user?.email ? "/orders" : "/"}>
            <div className="header__option">
              <span className="header__optionLineTwo">Orders</span>
            </div>
          </Link>

          <div className="header__optionBasket">
            <Link to="/checkout">
              <ShoppingBasketIcon />
            </Link>

            <div className="header__basketCount">{totalAmount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
