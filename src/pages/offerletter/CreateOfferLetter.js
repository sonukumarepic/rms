import React, { useEffect, useState } from "react";
import Logo from "../../assets/logo.png";
import DOMPurify from "dompurify";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import head from "../../assets/head.jpeg";
import footerlogo from "../../assets/footer.jpg.png";
import bottomimg from "../../assets/bottomimage.jpg.png";

const OfferLetter = () => {
  const [offerLetter, setOfferLetter] = useState("");
  const { pathname } = useLocation();
  const newPathName = pathname.replace("/job-offer/", "");
  const [data, setData] = useState({});
  console.log(data);

  const replacements = {
    "{name}": `${data?.applications?.full_name}`,
    "{role}": `${data?.applications?.recruitment?.degination}`,
    "{joining_date}": `${data?.joining_date}`,
    "{ctc}": `${data?.salary?.ctc}`,
  };

  // Helper function to replace the strings
  const replaceAll = (str, mapObj) => {
    const regex = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str?.replace(regex, (matched) => mapObj[matched]);
  };

  // Call the helper function
  const modifiedString = replaceAll(data?.template?.contents, replacements);

  const handleAccept = async () => {
    // e.preventDefault()
    try {
      const formData = new FormData();
      formData.append("offer_code", newPathName);
      formData.append("type", "accept");
      const request = await axios.postForm(
        `${process.env.REACT_APP_API_URL}saveOffer`,
        formData,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const response = await request?.data;
      if (response?.code === 200) {
        toast.success(`${response?.message}`);
        setTimeout(() => {
          window.open("about:blank", "_self");
          window.close();
        }, 4000);
        clearTimeout();
        // setTimeout(() => {
        //   window.open("about:blank", "_self");
        //   window.close();
        // }, 5000);
        // clearTimeout();
        // setShowStatusModal(false);
        // getAssigneeData();
        // setShowAddModal(false);
      }
    } catch (error) {
      console.log("error", error);
      if (error?.response?.data?.error) {
        const errors = Object.values(error?.response?.data?.error);
        console.log("Errors", errors);
        errors.map((x) => toast.error(`${x}`));
      }
      if (error?.response?.data?.message) {
        if (error?.response?.data?.error) {
          const errors = Object.values(error?.response?.data?.error);
          console.log("Errors", errors);
          errors.map((x) => toast.error(`${x}`));
        }
        if (error?.response?.data?.message) {
          toast.error(`${error?.response?.data?.message}`);
        }
      }
    }
    Swal.fire({
      title: "Download Offer Letter",
      text: "Click save to download it..!",
      icon: "info",
      confirmButtonText: "Save",
    }).then((result) => {
      if (result.isConfirmed) {
        const element = document.getElementById("div-to-download");
        const html = element.innerHTML;
        const newWindow = window.open("", "_blank");
        newWindow.document.open();
        newWindow.document.write(`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Print</title>
                    </head>
                    <body>
                      ${html}
                    </body>
                  </html>
                `);
        newWindow.document.close();
        newWindow.print();
      }
    });
  };

  const getOfferLetter = async () => {
    const request = await axios.get(
      `${process.env.REACT_APP_API_URL}job-offer/${newPathName}`
    );
    const response = await request?.data;
    console.log("offer letter response", response);
    setData(response.data);
    if (response?.code === 200) {
      setOfferLetter(response?.data?.message);
    }
  };

  useEffect(() => {
    getOfferLetter();
  }, []);

  const handleRejection = () => {
    Swal.fire({
      title: "Decline Offer",
      text: "Did you really want to decline offer?",
      icon: "info",
      confirmButtonText: "Yes",
      denyButtonText: "Cancel",
      showDenyButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: text } = await Swal.fire({
          input: "textarea",
          inputLabel: "Reason",
          inputPlaceholder: "Type your reason here...",
          inputAttributes: {
            "aria-label": "Type your Reason here",
          },
        });

        if (text) {
          console.log(text);
          try {
            const formData = new FormData();
            formData.append("offer_code", newPathName);
            formData.append("type", "rejected");
            formData.append("reason", text);
            const request = await axios.postForm(
              `${process.env.REACT_APP_API_URL}saveOffer`,
              formData,
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );
            const response = await request?.data;
            if (response?.code === 200) {
              toast.success(`${response?.message}`);
              setTimeout(() => {
                window.open("about:blank", "_self");
                window.close();
              }, 5000);
              clearTimeout();
            }
          } catch (error) {
            console.log("error", error);
            if (error?.response?.data?.error) {
              const errors = Object.values(error?.response?.data?.error);
              console.log("Errors", errors);
              errors.map((x) => toast.error(`${x}`));
            }
            if (error?.response?.data?.message) {
              if (error?.response?.data?.error) {
                const errors = Object.values(error?.response?.data?.error);
                console.log("Errors", errors);
                errors.map((x) => toast.error(`${x}`));
              }
              if (error?.response?.data?.message) {
                toast.error(`${error?.response?.data?.message}`);
              }
            }
          }
        }
      }
      if (result.isDenied) {
        Swal.fire("Cancelled!", "", "error");
      }
    });
  };
  return (
    <div className="">
      <ToastContainer position="top-center" />
      <div className="flex print:hidden justify-start bg-primary p-2 px-4">
        <img src={Logo} className="w-40 h-10" />
      </div>

      <img src={head} alt="Logo" style={{ width: "700px" }} className="head" />
      <div className="p-4">
        <div className="print:hidden">
          <h2 className="text-xl font-medium">Offer Letter</h2>
        </div>
        <div className=" p-4 print:block border-gray-200 border bg-gray-50">
          <div
            id="div-to-download"
            style={{ display: "block !important" }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(data.message),
            }}
          ></div>
        </div>

        <div className="bottomimg">
          <img className="bottomlg" src={bottomimg} alt="bottomimg" />
        </div>
        <div className="logodiv mx-auto">
          <div className="footerlogo">
            <img className="footerlg" src={footerlogo} alt="footerlogo" />
          </div>
        </div>
        <div className="py-2 print:hidden">
          <button
            onClick={() => handleAccept()}
            className="py-2 px-6 hover:bg-green-600 mr-2 font-medium rounded-sm bg-green-500 text-white delay-75 duration-75"
          >
            Accept
          </button>
          <button
            onClick={() => handleRejection()}
            className="py-2 px-6 hover:bg-red-600 ml-2 font-medium rounded-sm bg-red-500 text-white delay-75 duration-75"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferLetter;
