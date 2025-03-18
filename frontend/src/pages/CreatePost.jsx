import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import preview from "../assets/preview.png";
import { FormField, Loader } from "../Components";
import getRandomPrompt from "../utils";
import axios from "axios";

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generateImg, setGenerateImg] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.photo) {
      try {
        setLoader(true);
        const response = await axios.post(
          "http://localhost:5000/api/v1/post/",
          form,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        navigate("/");
      } catch (error) {
        alert(error.message);
      } finally {
        setLoader(false);
      }
    } else {
      alert("kindly generate image");
    }
  };

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        setGenerateImg(true);

        const maxRetries = 5; // Set the max number of retries
        const retryDelay = 5000; // Start with a 5-second delay
        let retries = 0;

        while (retries < maxRetries) {
          const response = await axios.post(
            "http://localhost:5000/api/v1/dalle/create",
            { prompt: form.prompt },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            const data = response.data;
            console.log("Generated Image Data:", data);
            setForm({ ...form, photo: `${data.photo}` });
            break;
          }

          // If the model is still loading (503 status), retry after delay
          if (response.status === 503) {
            const estimatedTime = response.data.estimated_time || 10; // Default to 10 seconds if estimated_time is not available
            console.log(
              `Model is loading, retrying in ${estimatedTime / 1000} seconds...`
            );
            retries++;
            await new Promise((resolve) => setTimeout(resolve, estimatedTime)); // Wait based on the estimated loading time
            retryDelay *= 2; // Exponential backoff (increase delay)
          } else {
            throw new Error(`Failed with status code: ${response.status}`);
          }
        }

        if (retries === maxRetries) {
          alert("Model is still loading, please try again later.");
        }
      } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      } finally {
        setGeneratingImg(false);
        setGenerateImg(false);
      }
    } else {
      alert("Enter a prompt");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt();
    setForm({ ...form, prompt: randomPrompt });
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-black text-[32px] ">Create Post</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w[500px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
          vitae iusto dolorem odit? Similique harum assumenda totam odio est
          expedita.
        </p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            LabelName="Your name"
            type="text"
            name="name"
            placeholder="Enter name"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            LabelName="Prompt"
            type="text"
            name="prompt"
            placeholder="prompt here"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div
            className="relative bg-gray-50 border border-gray-300 text-sm rounded-lg
              focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center"
          >
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}
            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-green-700 font-medium rounded-md text-sm sm:w-auto w-full  px-5 py-2.5
                  text-center "
          >
            {generateImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div>
          <p className="mt-2  text-[#666e75] text-[14px] ">
            shre with community Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Asperiores doloribus natus totam vel magni fugiat.
          </p>
          <button
            type="submit"
            className="text-white bg-[#6469ff] font-medium rounded-md text-sm w-full  px-5 py-2.5 sm:w-auto text-center "
          >
            {loader ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
