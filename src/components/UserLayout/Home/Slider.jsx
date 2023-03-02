import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Carousel from "react-bootstrap/Carousel";
import Slider2 from "../../../assets/images/Slider2.jpg";
import { useNavigate,Link } from "react-router-dom";

const Slider = () => {
  return (
    <>
      <Carousel
        pause={false}
        controls={false}
        nextIcon=""
        nextLabel=""
        indicators={false}
      >
        <Carousel.Item interval={5000}>
          <img className="d-block w-100" src={Slider2} alt="Second slide" />
          <div className="text">
            <p>
              1 on 1 interviews with your favorite artist, developers and
              influencers in the Solana space. Produced in Claymation
            </p>

            <Link
              to={"/video/62b966732c08972abab7abe5"}
              className="view_btn"
            >
              View now
            </Link>
            <a href="/" style={{ marginLeft: "10px" }} className="detail">
              Details
            </a>
          </div>
        </Carousel.Item>
      </Carousel>
    </>
  );
};

export default Slider;
