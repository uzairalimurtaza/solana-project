import React, { useState, useEffect, useContext } from "react";
import { SearchData } from "../../api/Url";
import Axios from "../../api/Axios";
import ThumbnailOne from "../../components/UserLayout/Category/ThumbnailOne";
import MainContext from "../../Context/MainContext";
import styled from "styled-components";
import { Container, Box, Grid, CircularProgress } from "@mui/material";
const Search = () => {
  const { searchValue } = useContext(MainContext);
  const [skip, setSkip] = useState(0);
  const [count, setCount] = useState();
  const [limit, setLimit] = useState(10);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);
  const [responseStatus, setResponseStatus] = useState(true);
  const [sortValue, setSortValue] = useState("title");
  const [sortType, setSortType] = useState("desc");
  const [allCategories, setallCategories] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  useEffect(() => {
    setLoader(true);
    setTimeout(() => {
      getSearchData(sortValue, sortType);
    }, 3000);
  }, [searchValue]);

  const getSearchData = async (sortValue, sortType) => {
    setResponseStatus(true);
    setLoader(true);
    setSearchResult([]);
    try {
      var yourObject = {};
      yourObject[sortValue] = sortType;
      //   console.log(yourObject, "onj");
      const data = {
        sort: yourObject,
        video_title: searchValue,
        video_description: description,
        skip,
        limit,
      };
      const response = await Axios.post(SearchData, data);
      setSearchResult(response.data.data);
      //   setTimeout(() => {
      setLoader(false);
      //   }, 1000);
      //   setCount(response.data.count);
      setResponseStatus(response.data.status);
    } catch (e) {
      //   console.log(e.response.data);
      setLoader(false);
      setSearchResult([]);
      setResponseStatus(e.response.data.status);
    }
  };
  return (
    <>
      <SearchStyled>
        <Box>
          <Container maxWidth="xl">
            {!responseStatus ? (
              <Grid
                item
                xs={12}
                sx={{
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "55vh",
                  alignItems: "center",
                  // background: "green",
                }}
              >
                <Box className="loader">
                  <h1 style={{ color: "#ffff" }}>No Data</h1>
                </Box>
              </Grid>
            ) : loader ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  py: 5,
                  height: "53vh",
                  alignItems: "center",
                }}
              >
                <CircularProgress color="secondary" />
              </Box>
            ) : (
              <Grid container spacing={2} sx={{ py: 5 }}>
                {searchResult.map((item, index) => (
                  <ThumbnailOne data={item} />
                ))}
              </Grid>
            )}
          </Container>
        </Box>
      </SearchStyled>
    </>
  );
};

export default Search;

const SearchStyled = styled.section`
  background: #000;
`;
