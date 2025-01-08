import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
} from "antd";
import { MapPin } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../../components/cart-item";
import manualLocations from "../../utils/manual-locations";

import { CloseSquareFilled } from "@ant-design/icons";
import { useForm } from "antd/es/form/Form";
import ProductCard from "../../components/product-card";
import Wrapper from "../../components/wrapper";
import { CountryContext } from "../../context/country-context";
import {
  createCheckoutSession,
  getCarriersCode,
} from "../../services/order-service";
import { getAllProducts } from "../../services/product-service";
import {
  addToCart,
  clearCart,
  removeFromCart,
} from "../../store/slices/cartSlice";
import {
  addToDollarCart,
  clearDollarCart,
} from "../../store/slices/dollarSlice";
import { formatCurrency } from "../../utils/currency-formatter";
import { deriveDeliveryRate } from "../../utils/delivery-fee";
import { handlePayStackPayment } from "../../utils/paystack-handler";
import {
  calculateDimensions,
  calculateWeight,
  fetchShippingRate,
} from "../../utils/ship-station";

const CheckoutPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userCountry } = useContext(CountryContext);
  const [coLocation, setCoLocation] = useState({
    lat: null,
    lng: null,
  });
  const [convertedAddress, setConvertedAddress] = useState("");
  const navigate = useNavigate();

  console.log(userCountry);
  const dispatch = useDispatch();

  const [shippingCost, setShippingCost] = useState(() => {
    if (userCountry === "GHANA") {
      return 1;
    } else {
      return 0;
    }
  });
  const [updatedCartItems, setUpdatedCartItems] = useState([]);
  const [isLoadingShippingCost, setIsLoadingShippingCost] = useState(false);
  const [savedDI, setSavedDI] = useState([]);
  const [savedCT, setSavedCT] = useState([]);
  const [isShppingRateEmpty, setIsShppingRateEmpty] = useState(false);
  const [isGeoEnabled, setIsGeoEnabled] = useState(false);

  const [currentLocation, setCurrentLocation] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);

  console.log(savedDI);
  console.log(savedCT);

  const [protectivePackage, setIsProtectivePackage] = useState(false);
  const formattedPrice = (price, currency, locale) =>
    formatCurrency(price, currency, locale);

  const formRef = useRef(null);
  const [postalCode, setPostalCode] = useState(null);
  const [form] = useForm();

  console.log("All update Cart Items", updatedCartItems);
  const [products, setProducts] = useState([]);
  const [paystackLoading, setPaystackLoading] = useState(false);

  // Get products
  useEffect(() => {
    const getProducts = async () => {
      const res = await getAllProducts();
      setProducts(res);
    };
    getProducts();
  }, []);
  useEffect(() => {
    // Update the country field whenever userCountry changes
    form.setFieldsValue({ country: userCountry });
  }, [userCountry, form]);

  useEffect(() => {
    const updateShippingCost = async () => {
      if (!postalCode || updatedCartItems.length === 0) return;

      setIsLoadingShippingCost(true);
      const weight = calculateWeight(updatedCartItems);
      const dimensions = calculateDimensions(updatedCartItems);

      try {
        const cost = await fetchShippingRate(
          weight,
          dimensions,
          "US",
          postalCode
        );
        console.log("Shipping rate status");
        console.log(cost);
        if (cost === 0) {
          setIsShppingRateEmpty(true);
        } else {
          setIsShppingRateEmpty(false);
        }
        setShippingCost(cost);
      } catch (error) {
        console.error("Failed to update shipping cost:", error);
        setShippingCost(0);
      } finally {
        setIsLoadingShippingCost(false); // End loading state
      }
    };

    updateShippingCost();
  }, [updatedCartItems, postalCode]);

  useEffect(() => {
    const checkShipServices = async () => {
      try {
        const res = await getCarriersCode();

        const filteredServices = res.filter((service) => {
          // Replace the condition below with your logic for selecting items
          return (
            service.code === "usps_ground_advantage" ||
            service.code === "globalpost_economy" ||
            service.code === "globalpost_priority" ||
            service.code === "gp_plus" ||
            service.code === "globalpost_parcel_select_smart_saver"
          );
        });

        console.log("Filtered Services:", filteredServices);

        console.log(res);
      } catch (error) {
        console.error("Failed to update shipping services:", error);
      }
    };

    checkShipServices();
  }, []);

  const mapCountryToCode = (country) => {
    const countryMapping = {
      GHANA: "GH",
      USA: "US",
    };

    return countryMapping[country.toUpperCase()] || country;
  };
  const totalCartPrice = useSelector((state) =>
    state.cart.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );
  const totalCartDollarPrice = useSelector((state) =>
    state.dollarCart.dollarCart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  );

  const protectivePackageCost = 30;

  const calculatedTotalPrice =
    totalCartPrice +
    (protectivePackage ? protectivePackageCost : 0) +
    deliveryFee;

  const handleProtectivePackageChange = (checked) => {
    setIsProtectivePackage(checked);
  };

  // Hnadle Form submit
  const onFinish = async (values) => {
    if (isShppingRateEmpty) return;
    const countryCode = mapCountryToCode(userCountry);
    const formattedLocation = `https://www.google.com/maps?q=${coLocation.lat},${coLocation.lng}`;
    const updatedValues = {
      ...values,
      country: countryCode,
      location: formattedLocation,
    };

    console.log("Form values after processing:", updatedValues);
    // const convertedPrice = Math.round(calculatedTotalPrice);

    await formRef.current.validateFields();

    if (countryCode !== "GH") {
      handleStripeCheckout(updatedValues);
    } else {
      handlePayStackPayment(
        setPaystackLoading,
        updatedCartItems,
        updatedValues,
        calculatedTotalPrice,
        handleRedirect
        // convertedPrice
      );
    }
  };

  const handleRedirect = () => {
    // Ensure useNavigate is used inside a React component
    navigate("/success");
    // message.success("Payment successful! Redirecting to home page...");

    // Redirect to the home page after 3 seconds
    setTimeout(() => {
      navigate("/");
    }, 3000); // 3000 milliseconds = 3 seconds
  };
  //Calculate total price

  console.log(totalCartPrice);

  // CartItems
  const cartItems = useSelector((state) => state.cart.cart);
  const dollarCartItems = useSelector((state) => state.dollarCart.dollarCart);
  console.log(
    dollarCartItems,
    "----------------------Dollar Cart Items--------------------"
  );
  console.log(
    cartItems,
    "----------------------Cart Items--------------------"
  );

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("dollarCartItems", JSON.stringify(dollarCartItems));
  }, [dollarCartItems]);

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cartItems");
    const savedDollarCartItems = localStorage.getItem("dollarCartItems");
    if (savedDollarCartItems.length !== 0) {
      setSavedDI(savedDollarCartItems);
    }
    if (savedCartItems.length !== 0) {
      setSavedCT(savedCartItems);
    }
  }, []);

  // Updated Cart Items for shopping calculation
  useEffect(() => {
    setUpdatedCartItems(cartItems);
  }, [cartItems]);
  // Delete cart
  const handleDelete = (id) => {
    dispatch(removeFromCart(id));
  };

  // Render cart items
  const renderCartItems = () => (
    <div className="flex flex-col gap-5">
      {cartItems.map((product) => (
        <CartItem onDelete={handleDelete} key={product.id} product={product} />
      ))}
    </div>
  );
  const renderDollarCartItems = () => (
    <div className="flex flex-col gap-5">
      {cartItems.map((product) => (
        <CartItem onDelete={handleDelete} key={product.id} product={product} />
      ))}
    </div>
  );

  // Handle geolocation retrieval
  // const handleGeolocation = () => {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         const locationString = `Lat: ${latitude}, Lng: ${longitude}`;

  //         // Set geolocation as form value
  //         form.setFieldsValue({ location: locationString });
  //         notification.success({ message: "Location set successfully!" });
  //       },
  //       (error) => {
  //         notification.error({
  //           message: "Error getting location",
  //           description: error.message,
  //         });
  //       }
  //     );
  //   } else {
  //     notification.error({
  //       message: "Geolocation not supported",
  //       description: "Your browser does not support geolocation.",
  //     });
  //   }
  // };

  // Handle geolocation retrieval
  // const handleGeolocation = () => {
  //   if (navigator.geolocation) {
  //     setLoading(false);
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log(
  //           "-------------------------------------Postion on google maps",
  //           latitude,
  //           longitude
  //         );

  //         // Update the location state
  //         setCoLocation((prev) => ({
  //           ...prev,
  //           lat: latitude,
  //           lng: longitude,
  //         }));
  //         try {
  //           const address = await getHumanReadableLocation(latitude, longitude);
  //           const deliverycost = deriveDeliveryRate(address);
  //           setDeliveryFee(deliverycost);

  //           // form.setFieldsValue({ location: address });
  //           setConvertedAddress(address);
  //           // notification.success({ message: "Location set successfully!" });
  //         } catch (error) {
  //           console.log(error);
  //           // Already handled in getHumanReadableLocation
  //         } finally {
  //           setLoading(false);
  //         }
  //       },
  //       (error) => {
  //         setLoading(false);
  //         notification.error({
  //           message: "Error getting location",
  //           description: error.message,
  //         });
  //       }
  //     );
  //   } else {
  //     notification.error({
  //       message: "Geolocation not supported",
  //       description: "Your browser does not support geolocation.",
  //     });
  //   }
  // };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsGeoEnabled(checked);
    // setDeliveryFee(0);

    if (checked) {
      // Simulate fetching the user's current location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          console.log(
            "-------------------------------------Postion on google maps",
            latitude,
            longitude
          );
          setCoLocation((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
          }));
          // form.resetFields(["location"]);
          // form.setFieldsValue({ location: "" });
          const location = `Latitude: ${latitude}, Longitude: ${longitude}`;
          setCurrentLocation(location);
        },
        (error) => {
          form.resetFields(["location"]);
          console.error("Error fetching location:", error);
          setCurrentLocation("Unable to fetch location.");
        }
      );
    } else {
      setCurrentLocation("");
    }
  };

  // handle add to cart
  const handleAddToCart = (product) => {
    const newProduct = {
      id: product._id,
      title: product.title,
      image: product.image,
      price: product.cediDiscount,
      quantity: 1,
      totalPrice: product.cediDiscount,
      weight: product.weight,
      height: product.height,
      length: product.length,
      width: product.width,
    };

    dispatch(addToCart(newProduct));
    setShowModal(false);
  };

  const handleDollarAddToCart = (product) => {
    const newProduct = {
      id: product._id,
      title: product.title,
      image: product.image,
      price: product.dollarDiscount,
      quantity: 1,
      totalPrice: product.dollarDiscount,
      weight: product.weight,
      height: product.height,
      length: product.length,
      width: product.width,
    };

    dispatch(addToDollarCart(newProduct));
    setShowModal(false);
  };

  const onClose = (e) => {
    console.log(e, "I was closed.");
  };
  if (cartItems.length === 0) {
    return (
      <Wrapper>
        <div className="mx-auto container">
          <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="h-96 flex flex-col justify-center items-center">
              <Card
                onClick={() => {
                  dispatch(clearDollarCart());
                  dispatch(clearCart());
                }}
                className="flex flex-col  justify-center items-center"
              >
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

  const handleLocationChange = (value) => {
    setConvertedAddress(value);

    // const str = deriveLocationsChoord(value);
    // console.log(
    //   "----------------------------------------------------------------Updated location---------------"
    // );
    // console.log(str);
    // const [latitude, longitude] = str.split(",");

    // setCoLocation((prev) => ({
    //   ...prev,
    //   lat: latitude,
    //   lng: longitude,
    // }));
    form.setFieldsValue({ location: value });
    const deliverycost = deriveDeliveryRate(value);
    setDeliveryFee(deliverycost);
    console.log(deliverycost);
  };
  // Add total price calculation logic here
  const calculateStripeTotal = totalCartDollarPrice + shippingCost;
  console.log(
    "----------------------------------------------------------------"
  );
  console.log(calculateStripeTotal);

  const handleStripeCheckout = async (updatedValues) => {
    setLoading(true);
    try {
      const data = await createCheckoutSession(
        cartItems,
        updatedValues,
        calculateStripeTotal
      );
      // Redirect to Stripe checkout URL
      // window.location.href = data.url;
      window.open(data.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      message.error("An error occurred!. Please try again later");
      // message.error(error.response.data.error);
      console.error("Error during Stripe Checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <div className="flex justify-center items-center min-h-screen ">
        <div className=" flex flex-col justify-center items-center my-10 shadow-md">
          <Card className="flex flex-col  justify-center items-center ">
            <h3 className="text-3xl font-bold mb-5 text-center">
              Place Order Now
            </h3>
            <h4 className="text-xl font-bold mb-5">Item(s)</h4>
            {userCountry !== "GHANA"
              ? renderDollarCartItems()
              : renderCartItems()}
            <button
              onClick={() => setShowModal(true)}
              className="w-full mt-5 bg-red-500 text-white py-3 rounded-md"
            >
              +Add Another Item
            </button>
            <Modal
              width={1200}
              open={showModal}
              onCancel={() => setShowModal(false)}
              footer={null}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
                {products.map((product) => (
                  <ProductCard
                    handleAddToCart={() => {
                      handleAddToCart(product);
                      handleDollarAddToCart(product);
                    }}
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            </Modal>
            {/* User details Section  */}
            <Form
              form={form}
              title="User Details"
              onFinish={onFinish}
              layout="vertical"
              ref={formRef}
              className="mt-10 flex flex-col"
            >
              <h4 className="text-xl font-bold mb-5">User Details</h4>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="First Name"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                    name="firstName"
                  >
                    <Input placeholder="Enter your first name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                    label="Last Name"
                    name="lastName"
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Country/Region" name="country">
                    <Input
                      defaultValue={userCountry}
                      value={userCountry}
                      disabled
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Email"
                    rules={[
                      { required: true, message: "This field is required" },
                      {
                        type: "email",
                        message: "Please enter a valid email address",
                      },
                    ]}
                    name="email"
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Phone" name="phone">
                    <Input
                      placeholder="Enter your phone number"
                      rules={[
                        { required: true, message: "Field is required!" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                    label="Address"
                    name="address"
                  >
                    <Input
                      placeholder="Enter your address"
                      rules={[
                        { required: true, message: "Field is required!" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="State / City"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                    name="state"
                  >
                    <Input placeholder="Enter your state or city" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                    label="Zip/Postal Code"
                    name="zip"
                  >
                    <Input
                      onInput={(e) => setPostalCode(e.target.value)} // Capture autofill
                      onBlur={(e) => setPostalCode(e.target.value)} // Fallback for unfocus
                      placeholder="Enter your zip code"
                    />
                  </Form.Item>
                  {isShppingRateEmpty && (
                    <Alert
                      message="Please enter a valid zip code to place order"
                      type="error"
                      closable={{
                        "aria-label": "close",
                        closeIcon: <CloseSquareFilled />,
                      }}
                      onClose={onClose}
                    />
                  )}
                </Col>
              </Row>

              <h4 className="text-xl font-bold mb-5 mt-5">Location</h4>
              {userCountry === "GHANA" && (
                <>
                  <Form.Item
                    name="location"
                    label="Select Manual Location"
                    rules={[
                      { required: true, message: "Please select a location!" },
                    ]}
                  >
                    <Select
                      // disabled={!!isGeoEnabled}
                      showSearch // Enables search functionality
                      placeholder="Choose a location"
                      style={{ width: "100%" }}
                      onChange={(e) => handleLocationChange(e)}
                      options={manualLocations.map((location) => ({
                        label: `${location.name}`, // Display name
                        value: location.name, // Value for selection
                      }))}
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      } // Case-insensitive search
                    />
                  </Form.Item>
                  {/* Location Checkbox */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "8px",
                      // justifyContent: "center", // Center-align the entire row
                    }}
                  >
                    {/* Checkbox for enabling location */}
                    <Form.Item style={{ margin: 0 }}>
                      <Checkbox
                        checked={isGeoEnabled}
                        onChange={handleCheckboxChange}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: "8px",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          {" "}
                          <MapPin size={16} color="#007bff" />
                          Pin your location for delivery
                        </div>
                      </Checkbox>
                    </Form.Item>

                    {/* Display current location */}
                    {/* {isGeoEnabled && currentLocation && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "14px",
                          color: "#000", // Adjust color if needed
                        }}
                      >
                        <MapPin size={16} color="#007bff" />
                        {convertedAddress}
                      </span>
                    )} */}
                  </div>

                  {/* Display Current Location */}
                </>
              )}
              {userCountry === "GHANA" && (
                <Row>
                  <Form.Item label="">
                    <Checkbox
                      checked={protectivePackage}
                      onChange={(e) =>
                        handleProtectivePackageChange(e.target.checked)
                      }
                    >
                      Need Protective Package (GHC 30.00)
                    </Checkbox>
                  </Form.Item>
                </Row>
              )}

              <div className="flex justify-between mt-5">
                <div>Sub Total</div>
                <div>
                  {" "}
                  {formattedPrice(
                    userCountry !== "GHANA"
                      ? totalCartDollarPrice
                      : totalCartPrice,
                    userCountry !== "GHANA" ? "USD" : "GHS",
                    userCountry !== "GHANA" ? "en-US" : "en-GH"
                  )}
                </div>
              </div>
              {userCountry === "GHANA" && (
                <div className="flex justify-between mt-5">
                  <div>Delivery Fee</div>
                  <div>
                    {" "}
                    {formattedPrice(
                      deliveryFee,
                      userCountry !== "GHANA" ? "USD" : "GHS",
                      userCountry !== "GHANA" ? "en-US" : "en-GH"
                    )}
                  </div>
                </div>
              )}
              {userCountry !== "GHANA" && (
                <div className="flex justify-between mt-5">
                  <div>Shipping</div>
                  {shippingCost > 0 ? (
                    <div>
                      {formattedPrice(
                        userCountry !== "GHANA" ? shippingCost : shippingCost,
                        userCountry !== "GHANA" ? "USD" : "GHS",
                        userCountry !== "GHANA" ? "en-US" : "en-GH"
                      )}
                    </div>
                  ) : (
                    <p>Shipping not available.</p>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-5">
                <div>Total</div>
                <div className="text-2xl">
                  {formattedPrice(
                    userCountry !== "GHANA"
                      ? totalCartDollarPrice + shippingCost
                      : calculatedTotalPrice,
                    userCountry !== "GHANA" ? "USD" : "GHS",
                    userCountry !== "GHANA" ? "en-US" : "en-GH"
                  )}
                </div>
              </div>
              <Button
                loading={paystackLoading || loading}
                type="primary"
                htmlType="submit"
                disabled={isLoadingShippingCost || shippingCost === 0}
                className="w-full mt-5 bg-red-500"
              >
                {isLoadingShippingCost ? "Calculating..." : "Place Order"}
              </Button>
            </Form>
          </Card>
        </div>
      </div>
    </Wrapper>
  );
};

export default CheckoutPage;
