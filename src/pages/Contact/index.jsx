import { Form, Input } from "antd";
import Wrapper from "../../components/wrapper";

const ContactPage = () => {
  return (
    <Wrapper>
      <div className="bg-[url('/contact.jpg')] bg-cover bg-center h-80 sm:h-[550px] w-full relative mb-10 md:mb-20">
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl sm:text-5xl lg:text-6xl font-bold">
          CONTACT US
        </h1>
      </div>

      <div className="container mx-auto px-4 sm:px-8 lg:px-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
        {/* Contact Information Section */}
        <div className="mb-10 md:mb-10">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Contact Us
          </h3>
          <h5 className="mt-5 font-bold">Address</h5>
          <p className="mb-5">7850 W. GrandParkway</p>
          <p className="mb-5">South, Richmond,</p>
          <p className="mb-5">Texas 77406</p>
          <h5 className="mt-5">Phone & Email</h5>
          <p className="mb-5">
            Tel: +1 8322769667 || +233 534789333 || +233 024 2492556
          </p>
          <p className="mb-20">
            <strong>Email</strong>: chef@nanaskitchen.net
          </p>

          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5">
            Locations & Stores
          </h3>
          <p className="mb-5 font-bold">Richmond, TX</p>
          <p className="text-xl">
            7850 W. GrandParkway South, Richmond, Texas 77406
          </p>
        </div>

        {/* Contact Form Section */}
        <div className="w-full">
          <Form
            layout="vertical"
            className="container mx-auto flex flex-col px-4 sm:px-8 lg:px-0 mt-5 md:mt-0"
          >
            <Form.Item name="name" label="Name">
              <Input placeholder="Name" className="h-10 w-full" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Email" className="h-10 w-full" />
            </Form.Item>
            <Form.Item name="message" label="Message">
              <Input.TextArea
                rows={4}
                placeholder="Message"
                className="w-full"
              />
            </Form.Item>
            <button
              type="submit"
              className="bg-[#AF1313] text-white py-2 px-4 rounded-md mt-3 w-full mb-10"
            >
              Send
            </button>
          </Form>
        </div>
      </div>
    </Wrapper>
  );
};

export default ContactPage;
