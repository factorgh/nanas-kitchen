import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#AF1313] h-auto py-10">
      <div className="container  flex flex-col md:flex-row items-center justify-between px-5 md:px-20">
        {/* Logo and Description */}
        <div className="mb-8 md:mb-0 flex flex-col items-center justify-center ">
          <Link to="/">
            <img
              src="/nana-logo.png"
              alt="nana-logo"
              className="md:h-16 md:w-28 my-5 h-15 w-32"
            />
            {/* <h1 className="text-white text-5xl font-bold mb-3 ">NANA SHITO</h1> */}
          </Link>
          <p className="text-white text-center md:text-left">
            ... an extension of your kitchen.
          </p>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col items-center text-center ml-3">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
            CONTACT INFO
          </h3>
          <div className="flex flex-col w-full md:w-96 rounded-3xl bg-white p-5 items-center gap-2">
            {/* Phone Numbers */}
            <a
              href="tel:+18322769667"
              className="text-sm md:text-base hover:underline"
            >
              USA : +1 832 276 9667
            </a>
            <a
              href="tel:+233534789333"
              className="text-sm md:text-base hover:underline"
            >
              Ghana : +233 534 789 333
            </a>
            <a
              href="tel:+2330242492556"
              className="text-sm md:text-base hover:underline"
            >
              Ghana : +233 242 492 556
            </a>

            {/* Email */}
            <a
              href="mailto:info@nanaskitchen.net"
              className="text-sm md:text-base hover:underline"
            >
              info@nanakitchen.com
            </a>

            {/* Location */}
            {/* <p className="text-sm md:text-base text-center">
              <span className="font-bold">Location:</span> 7850 W. Grand Parkway
              South, Richmond, Texas 77406
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
``;
