import { useState, useEffect } from "react";
import InfluencerCard from "./Card";
import styled from "styled-components";

const InfluencerSearch = () => {
  const [influencers, setInfluencers] = useState(null);
  const [searchString, setSearchString] = useState("");
  const [platformString, setPlatformString] = useState("all");

  useEffect(() => {
    getInfluencers();
  }, []);

// create variable to filter influencers by what is typed
  const searchBar = (influencers) => {
    const stringArr = searchString.split(" ");
    const results = [];

    if (searchString === "") {
      return influencers;
    }

    stringArr.forEach((term) => {
      influencers.forEach((influencer) => {
        if (influencer.handle.toLowerCase().includes(term.toLowerCase())) {
          results.push(influencer);
        } else if (influencer.platform.name.toLowerCase().includes(term.toLowerCase())) {
          results.push(influencer);
        } else if (influencer.tags.some((tag) => tag.name.toLowerCase().includes(term.toLowerCase()))) {
          results.push(influencer);
        }
      });
    });

    const uniqResults = results.reduce((unique, item) => unique.includes(item) ? unique : [...unique, item], []);
    return uniqResults;
  };

// create variable to filter influencers by platform selected
  const platFilter = (influencers) => {
    if (platformString === "" || platformString === "all") {
      return influencers;
    }
    return influencers.filter((influencer) => {
      return influencer.platform.name === platformString;
    });
  };

// ensure that platform filter can be applied on top of search bar use
  const allFilters = platFilter(searchBar(influencers))

  const getInfluencers = () =>
    fetch("http://localhost:3000/api/v1/influencers", {
      headers: {
        "Content-Type": "application/json",
        Accepts: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setInfluencers(data));


  return (
    <div>
      <SearchInputContainer>
        <SearchInput
          placeholder="Enter influencer handle, platform, or tag"
          type="text"
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
        { <SelectInput
          value={platformString}
          onChange={(e) => setPlatformString(e.target.value)}
          name="platforms"
          id="platforms"
        >
          <option value="all">All</option>
          <option value="instagram">Instagram</option>
          <option value="twitter">Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">Tik-Tok</option>
          <option value="youtube">Youtube</option>
        </SelectInput> }
      </SearchInputContainer>
      <SearchContainer>
        {!influencers && <Loader />}
        <div>
          {allFilters?.map((inf, i) => (
            <InfluencerCard influencer={inf} key={"inf_card_" + i} />
          ))}

        </div>
      </SearchContainer>
    </div>
  );
};

const SelectInput = styled.select`
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  border: 2px solid #2d9fd9;
  color: grey;
  width: 100px;
  height: 35px;
  padding-left: 10px;
  &:focus {
    outline: none;
    border: 2px solid #ee7622;
    color: grey;
  }
  margin: 10px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 20vw 30px 20vw;
`;

const Loader = styled.div`
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: loader-spin 2s linear infinite;
  position: absolute;
  top: 45vh;
`;

const SearchInput = styled.input`
  -webkit-border-radius: 20px;
  -moz-border-radius: 20px;
  border-radius: 20px;
  border: 2px solid #2d9fd9;
  color: grey;
  width: 300px;
  height: 30px;
  padding-left: 20px;
  &:focus {
    outline: none;
    border: 2px solid #ee7622;
    color: grey;
  }
  margin: 10px;
`;

const SearchInputContainer = styled.div`
  width: 100%;
  position: fixed;
  background-color: #f2f2f2;
  z-index: 1000;
`;

export default InfluencerSearch;
