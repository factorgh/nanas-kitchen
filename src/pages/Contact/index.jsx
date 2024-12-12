import { Form, Input } from "antd";
import Wrapper from "../../components/wrapper";

const ContactPage = () => {
  return (
    <Wrapper>
      <div className="bg-[url('/contact.jpg')] bg-cover bg-center h-[550px] w-full relative mb-20">
        <h1 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-6xl font-bold">
          CONTACT US
        </h1>
      </div>
      <div className="container mx-auto px-20 grid grid-cols-1 md:grid-cols-2">
        {/* Contact form */}
        <div className="mb-20">
          <h3 className="text-5xl font-bold  mb-5">Contact Us</h3>
          <h5 className="mt-5 font-bold">Address</h5>
          <p className="mb-5">7850 W. GrandParkway</p>
          <p className="mb-5"> South, Richmond,</p>
          <p className="mb-5"> Texas 77406</p>
          <h5 className="mt-5">Phone & Email</h5>
          <p className="mb-5">
            Tel: +1 8322769667 || +233 534789333 || +233 024 2492556
          </p>
          <p className="mb-20">
            <strong>Email</strong>:chef@nanaskitchen.net
          </p>

          <h3 className="text-5xl font-bold  mb-5">Locations & Stores</h3>
          <p className="mb-5 font-bold">Richmond, TX</p>
          <p className="text-xl">
            7850 W. GrandParkway South, Richmond, Texas 77406
          </p>
        </div>
        <div>
          <Form
            layout="vertical"
            className="container mx-auto flex flex-col px-20 mt-20"
          >
            <Form.Item name="name" label="Name">
              <Input placeholder="Name" className="h-10 w-full" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Email" className="h-10" />
            </Form.Item>
            <Form.Item name="message" label="Message">
              <Input.TextArea rows={4} placeholder="Message" />
            </Form.Item>
            <button
              type="submit"
              className="bg-[#AF1313] text-white py-2 px-4 rounded-md mt-3 w-full"
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
