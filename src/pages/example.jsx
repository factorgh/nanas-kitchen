// import { useState, useEffect } from "react";
// import { Form, Row, Col, Select, Input } from "antd";

// const { Option } = Select;

// const CheckoutPage = () => {
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [zipCodes, setZipCodes] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [selectedState, setSelectedState] = useState(null);

//   // Fetch countries on component mount
//   useEffect(() => {
//     fetch("https://restcountries.com/v3.1/all")
//       .then((res) => res.json())
//       .then((data) => {
//         const countryList = data.map((country) => ({
//           name: country.name.common,
//           code: country.cca2,
//         }));
//         setCountries(countryList);
//       });
//   }, []);

//   // Fetch states based on selected country
//   useEffect(() => {
//     if (selectedCountry) {
//       fetch(
//         `https://api.geonames.org/countryInfoJSON?country=${selectedCountry}&username=demo`
//       ) // Replace `demo` with your Geonames username
//         .then((res) => res.json())
//         .then((data) => {
//           const stateList = data.geonames.map((state) => state.name);
//           setStates(stateList);
//         });
//     }
//   }, [selectedCountry]);

//   // Fetch zip codes based on selected state
//   useEffect(() => {
//     if (selectedState) {
//       fetch(`https://api.zippopotam.us/${selectedCountry}/${selectedState}`)
//         .then((res) => res.json())
//         .then((data) => {
//           const zipList = data.places.map((place) => place["post code"]);
//           setZipCodes(zipList);
//         });
//     }
//   }, [selectedState]);

//   return (
//     <Form layout="vertical">
//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="Country">
//             <Select
//               showSearch
//               placeholder="Select Country"
//               onChange={(value) => {
//                 setSelectedCountry(value);
//                 setStates([]);
//                 setZipCodes([]);
//                 setSelectedState(null);
//               }}
//             >
//               {countries.map((country) => (
//                 <Option key={country.code} value={country.code}>
//                   {country.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="State/City">
//             <Select
//               showSearch
//               placeholder="Select State/City"
//               onChange={(value) => {
//                 setSelectedState(value);
//                 setZipCodes([]);
//               }}
//               disabled={!states.length}
//             >
//               {states.map((state) => (
//                 <Option key={state} value={state}>
//                   {state}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </Col>
//       </Row>
//       <Row gutter={16}>
//         <Col span={12}>
//           <Form.Item label="Zip Code">
//             <Select
//               showSearch
//               placeholder="Select Zip Code"
//               disabled={!zipCodes.length}
//             >
//               {zipCodes.map((zip) => (
//                 <Option key={zip} value={zip}>
//                   {zip}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>
//         </Col>
//         <Col span={12}>
//           <Form.Item label="Address">
//             <Input placeholder="Enter your address" />
//           </Form.Item>
//         </Col>
//       </Row>
//     </Form>
//   );
// };

// export default CheckoutPage;
