import { Card, Col, Form, Input, Modal, Row, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CartItem from "../../components/cart-item";
import PaymentModal from "../../components/payment-modal";
import ProductCard from "../../components/product-card";
import Wrapper from "../../components/wrapper";
import { addToCart, removeFromCart } from "../../store/slices/cartSlice";

const CheckoutPage = () => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const [countries, setCountries] = useState([]);
  const [openPayment, setOpenPayment] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState(null);

  // UseEffects
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const countryList = data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(countryList);
      });
  }, []);

  // Fetch states based on selected country
  useEffect(() => {
    if (selectedCountry) {
      fetch(
        `https://api.geonames.org/countryInfoJSON?country=${selectedCountry}&username=demo`
      ) // Replace `demo` with your Geonames username
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
    }
  }, [selectedCountry]);

  // Fetch zip codes based on selected state

  //Calculate total price
  const totalCartPrice = useSelector((state) =>
    state.cart.cart.reduce((total, item) => total + item.totalPrice, 0)
  );
  console.log(totalCartPrice);

  // CartItems
  const cartItems = useSelector((state) => state.cart.cart);
  console.log(cartItems);

  // Delete cart
  const handleDelete = (id) => {
    dispatch(removeFromCart(id));
  };

  const others = [
    {
      id: 1,
      title: "16oz Black Shitor(Mild)",
      image: "/shito-p1.jpg",
      price: 11.99,
      discount: "$17.99",
    },
    {
      id: 2,
      title: "16oz Black Shitor(Hot)",
      image: "/shito-p1.jpg",
      price: 11.99,
      discount: "$17.99",
    },
    {
      id: 3,
      title: "16oz Black Shitor(Mild)",
      image: "/shito-p1.jpg",
      price: 11.99,
      discount: "$17.99",
    },
    // Add more products here
  ];

  const { Option } = Select;
  // Render cart items
  const renderCartItems = () => (
    <div className="flex flex-col gap-5">
      {cartItems.map((product) => (
        <CartItem onDelete={handleDelete} key={product.id} product={product} />
      ))}
    </div>
  );

  // handle add to cart
  const handleAddToCart = (product) => {
    const newProduct = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      discount: product.discount,
      quantity: 1,
      totalPrice: product.price,
    };
    // Add to cart
    dispatch(addToCart(newProduct));

    // Close Modal
    setShowModal(false);
  };

  // Render other products

  // Modal content

  if (cartItems.length === 0) {
    return (
      <Wrapper>
        <div className="mx-auto container">
          <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="h-96 flex flex-col justify-center items-center">
              <Card className="flex flex-col  justify-center items-center">
                <h3 className="text-3xl font-bold mb-5 text-center">
                  Ooooops !!! Cart is empty
                  <Link to="/">
                    <button className="w-full mt-5 bg-red-500 text-white py-2 rounded-md text-sm">
                      Order Again
                    </button>
                  </Link>
                </h3>
              </Card>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  // Render checkout page content
  // Add total price calculation logic here
  return (
    <Wrapper>
      <div className="flex justify-center items-center min-h-screen ">
        <div className=" flex flex-col justify-center items-center my-10 shadow-md">
          <Card className="flex flex-col  justify-center items-center ">
            <h3 className="text-3xl font-bold mb-5 text-center">
              Place Order Now
            </h3>
            <h4 className="text-xl font-bold mb-5">Item(s)</h4>
            {renderCartItems()}
            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-5 bg-red-500 text-white py-3 rounded-md"
            >
              +Add Another Item
            </button>
            <Modal
              width={1000}
              open={showModal}
              onCancel={() => setShowModal(false)}
              footer={null}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                {others.map((product) => (
                  <ProductCard
                    handleAddToCart={handleAddToCart}
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </Modal>
            {/* User details Section  */}
            <Form title="User Details" layout="vertical" className="mt-10">
              <h4 className="text-xl font-bold mb-5">User Details</h4>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="First Name" name="firstName">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Last Name" name="lastName">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Country/Region" name="country">
                    <Select
                      showSearch
                      placeholder="Select Country"
                      onChange={(value) => {
                        setSelectedCountry(value);
                      }}
                    >
                      {countries.map((country) => (
                        <Option key={country.code} value={country.code}>
                          {country.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Email" name="email">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone" name="phone">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Address" name="address">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="State" name="State">
                    <Input placeholder="Enter your state or city" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Zip/Postal Code" name="zip">
                    <Input placeholder="Enter your zip code" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="state" name="state">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
            <div className="flex justify-between mt-5">
              <div>Subtotal</div>
              <div>$17.98</div>
            </div>
            <div className="flex justify-between mt-5">
              <div>Shipping</div>
              <div>$5.00</div>
            </div>
            <div className="flex justify-between mt-5">
              <div>Total</div>
              <div>${totalCartPrice}</div>
            </div>
            <button
              onClick={() => setOpenPayment(true)}
              className="w-full mt-5 bg-red-500 text-white py-3 rounded-md"
            >
              Place Order
            </button>
            <PaymentModal
              openPayment={openPayment}
              setOpenPayment={setOpenPayment}
              userDetails={{}}
              cartItems={cartItems}
            />
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};

export default CheckoutPage;
