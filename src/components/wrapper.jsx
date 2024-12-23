/* eslint-disable react/prop-types */
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Footer from "./footer";
import Header from "./header";
const Wrapper = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }} // Start hidden and move up
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="box min-h-screen"
    >
      <Header />

      <div className="">
        <div className="">{children}</div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default Wrapper;
