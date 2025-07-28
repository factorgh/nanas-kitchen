import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMemo } from "react";

const Footer = () => {
  const storeConfig = useSelector((state) => state.storeConfig);

  const { email, domain } = useMemo(() => {
    const host = window.location.hostname;

    if (host.includes("nanaskitchen")) {
      return {
        email: "info@nanaskitchen.com",
        domain: "nanaskitchen.com",
      };
    } else if (host.includes("nanashito")) {
      return {
        email: "info@nanashito.com",
        domain: "nanashito.com",
      };
    } else {
      return {
        email: "info@example.com",
        domain: "example.com",
      };
    }
  }, []);

  return (
    <div className="bg-[#AF1313] h-auto py-10">
      <div className="container flex flex-col md:flex-row items-center justify-between px-5 md:px-20">
        {/* Logo and Description */}
        <div className="mb-8 md:mb-0 flex flex-col items-center justify-center ">
          <Link to="/">
            {storeConfig?.storeName === "Nana's Kitchen" ? (
              <img
                src="/nana-logo.png"
                alt="nana-logo"
                className="md:h-16 md:w-28 my-5 h-15 w-32"
              />
            ) : (
              <h1 className="text-white text-2xl font-bold my-5">
                {storeConfig?.storeName || "Default Store"}
              </h1>
            )}
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

            {/* Dynamic Email */}
            <a
              href={`mailto:${email}`}
              className="text-sm md:text-base hover:underline"
            >
              {email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
