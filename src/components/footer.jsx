const Footer = () => {
  return (
    <div className="bg-[#AF1313] h-96 ">
      <div className="container mx-auto flex items-center justify-between px-20">
        <div className="mt-15">
          <img
            src="/nana-logo.png"
            alt="nana-logo"
            className="h-20 w-42 my-5"
          />
          <p className="text-white">... an extension of your kitchen</p>
        </div>
        <div className=" mt-5 flex flex-col items-center">
          <h3 className="text-2xl font-bold text-white mb-3">CONTACT INFO</h3>
          <div className="flex flex-col w-96 h-72 rounded-3xl bg-white p-5 items-center justify-center gap-2">
            <p>+1 8322769667</p>
            <p>+233 534789333</p>
            <p>+233 024 2492556</p>
            <p>chef@nanaskitchen.net</p>
            <p>
              <span className="font-bold">Location:</span> 7850 W. GrandParkway
              South,
            </p>
            Richmond, Texas 77406
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
