import { useState, useEffect } from "react";
import "../css/Payment.css";
import BasketItem from "../components/BasketItem";
import { useStateValue } from "../Context";
import { Link, useHistory } from "react-router-dom";
import CurrencyFormatC from "../components/CurrencyFormatC";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "../axios";
function Payment() {
  let [{ user, basket }, dispatch] = useStateValue();
  let stripe = useStripe();
  let elements = useElements();
  let [error, setError] = useState(null);
  let [disable, setDisable] = useState(true);
  let [processing, setProcessing] = useState("");
  let [succeeded, setSucceeded] = useState(false);
  let [clientSecret, setClientSecret] = useState(true);
  let history = useHistory();
  let totalPrice = basket?.reduce((acc, item) => +item.price + acc, 0) * 100;
  useEffect(() => {
    //generate the special stripe secret which allows us to charge  a customer
    let getClientSecret = async () => {
      let response = await axios({
        method: "post",
        url: `/payments/create/?total=100`,
      });
      //from backend (functions)
      setClientSecret(response.data.clientSecret);
    };
    getClientSecret();
  }, [totalPrice]);
  console.log("secret", clientSecret);

  let handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    //WOW
    let payload = await stripe
      .confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      })
      .then(({ paymentIntent }) => {
        //paymentIntent === payment confirmation
        setSucceeded(true);
        setProcessing(false);
        setError(false);
        history.replaceState("/orders");
      });
    console.log(payload);
  };
  let handleChange = (e) => {
    setDisable(e.empty);
    setError(e.error?.message);
  };
  return (
    <div className="payment">
      <div className="payment__container">
        <h1>
          Checkout <Link to="/checkout">({basket?.length} items)</Link>
        </h1>
        <div className="payment__section">
          <div className="payment__title">
            <h3>deeeeeeee</h3>
          </div>
          <div className="payment__address">
            <p>{user?.email}</p>
            <p>tbilisi</p>
            <p>dfsfs</p>
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Review items and delivery</h3>
          </div>
          <div className="payment__items">
            {basket.map((item, i) => {
              return <BasketItem item={item} key={"p-item" + i} />;
            })}
          </div>
        </div>
        <div className="payment__section">
          <div className="payment__title">
            <h3>Payment method</h3>
          </div>
          <div className="payment__details">
            <form onSubmit={handleSubmit}>
              {error ? <h4 className="error">{error}</h4> : null}
              <CardElement onChange={handleChange} />
              <div>
                <CurrencyFormatC title="payment" value={34.131} amount={45} />
              </div>
              <div>
                <button disabled={disable || processing || succeeded}>
                  {processing ? "Processing" : "Buy now"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
