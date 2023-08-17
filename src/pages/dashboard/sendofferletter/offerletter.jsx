import React, { useRef, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-hot-toast";
import cipllogo from "../../../assets/logocipl.jpg";
import footerlogo from "../../../assets/footer.jpg.png";
import bottomimg from "../../../assets/bottomimage.jpg.png";
import { useSelector } from "react-redux";
import head from "../../../assets/head.jpeg";

// console.log("16", joining_date);

const SingleOfferLetter = () => {
  let { id } = useParams();
  const [data, setData] = useState({});

  const offerletter = useSelector((state) => state.offerletter);

  console.log("20", offerletter);

  let obj = offerletter.offerletter[0];
  let joining_date = offerletter.joining_date;

  console.log("19", obj);

  const replacements = {
    "{name}": `${obj?.full_name}`,
    "{role}": `${obj?.recruitment?.degination}`,
    "{joining_date}": `${joining_date}`,
    "{ctc}": `${obj?.salarydetails?.ctc}`,
    "{created_date}": `${new Date().toJSON().slice(0, 10)}`,
  };

  // Helper function to replace the strings
  const replaceAll = (str, mapObj) => {
    const regex = new RegExp(Object.keys(mapObj).join("|"), "gi");
    return str?.replace(regex, (matched) => mapObj[matched]);
  };

  // Call the helper function
  const modifiedString = replaceAll(data?.contents, replacements);

  const datatoken = localStorage.getItem("data");
  const jsonData = JSON.parse(datatoken);
  const accessToken = jsonData?.access_token;
  const authorize = "Bearer" + " " + accessToken;
  const navigate = useNavigate();

  const offerLetterRef = useRef(null);

  const handlePrintPDF = () => {
    const element = offerLetterRef.current;

    html2pdf().from(element).save("offer_letter.pdf");
  };

  useEffect(() => {
    document.title = "CIPLCRM | Offer letter";

    axios
      .get(
        `${process.env.REACT_APP_API_URL}offerletter`,

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${authorize}`,
          },
        }
      )
      .then((res) => {
        setData(res.data.data.find((ele) => ele.id == Number(id)));
        console.log(res.data.data.find((ele) => ele.id == Number(id)));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDelete = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}offerletter/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${authorize}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
        navigate("/admin/offerletter");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault()
    try {
      const formData = new FormData();
      formData.append("template_id", `${data.id}`);
      formData.append("joining_date", joining_date);
      formData.append("send_email", "yes");
      formData.append("message", modifiedString);
      const request = await axios.postForm(
        `${process.env.REACT_APP_API_URL}create-offer/${obj.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
        }
      );
      const response = await request?.data;
      if (response?.code === 200) {
        console.log(response.message);
        toast.success(`${response?.message}`);
        navigate("/admin/offerletters");

        // setShowEditPopup(false);
        // getAssigneeData();
        //   setShowAddModal(false)
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="border rounded border-t-2 border-r-gray-400 border-l-gray-400 border-b-gray-400 border-gray-800 p-4 mx-4 my-2 bg-white">
        <div className="flex my-5 justify-end">
          <Link to={`/admin/sendupdateofferletter/${id}`}>
            <FiEdit
              style={{ cursor: "pointer", marginRight: "20px" }}
              className="text-lg "
            />
          </Link>

          {/* <RiDeleteBin6Line
            style={{ cursor: "pointer" }}
            className="text-lg "
            onClick={handleDelete}
          /> */}
        </div>
        <div className="w-full mr-1">
          <label className="flex pr-1 mb-2">Template Name</label>

          <div className="border w-full px-2 py-2">{data.templatename}</div>
        </div>
        <form>
          <div className=" w-full flex py-4 items-center">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="w-full col-span-2">
                <div className="w-full">
                  <div
                    ref={offerLetterRef}
                    className="mx-auto"
                    style={{
                      width: "700px",
                      // height: "800px",
                    }}
                  >
                    <img
                      src={head}
                      alt="Logo"
                      style={{ width: "700px" }}
                      className="head"
                    />

                    <h2 className="text-center text-lg font-bold">
                      Offer Letter
                    </h2>
                    <div dangerouslySetInnerHTML={{ __html: modifiedString }} />
                  </div>

                  <div className="bottomimg">
                    <img className="bottomlg" src={bottomimg} alt="bottomimg" />
                  </div>
                  <div className="logodiv mx-auto">
                    <div className="footerlogo">
                      <img
                        className="footerlg"
                        src={footerlogo}
                        alt="footerlogo"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="flex my-4 transition-all delay-150 duration-150 px-8 py-2 rounded text-white bg-green-700 hover:bg-green-500"
                  >
                    <span
                      className="text-xl font-medium"
                      onClick={handleSubmit}
                    >
                      Send
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default SingleOfferLetter;
