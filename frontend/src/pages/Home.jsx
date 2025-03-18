import React from "react";
import { useState, useEffect } from "react";
import axios, { all } from "axios";
import { Cards, FormField, Loader } from "../Components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Cards key={post._id} {...post} />);
  }
  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase ">
      {title}
    </h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setPosts] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/v1/post/");
      if (response) {
        setPosts(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    setsearchText(e.target.value);

    const prompt = allPosts.data.filter((post) =>
      post.prompt.toLowerCase().includes(searchText.toLowerCase()) || post.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResult(prompt);
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-black text-[32px] ">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w[500px]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
          vitae iusto dolorem odit? Similique harum assumenda totam odio est
          expedita.
        </p>
      </div>

      <div className="mt-16">
        <FormField
          LabelName="Search Some Posts"
          type="text"
          name="post"
          placeholder="Search Posts..."
          value={searchText}
          handleChange={handleChange}
        />
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs-grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchResult}
                  title="No search results found"
                />
              ) : (
                <RenderCards data={allPosts.data} title="No result found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
