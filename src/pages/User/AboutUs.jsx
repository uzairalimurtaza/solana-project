import React from "react";
import { Box, Container, Typography } from "@mui/material";
import styled from "styled-components";
import CircleIcon from "@mui/icons-material/Circle";
import Pdf from "../../assets/file/SolanaTv Whitepaper.pdf";
const AboutUs = () => {
  return (
    <>
      <AboutUsStyed>
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            sx={{ color: "var(--green-color)", pt: 4 }}
            className="top_heading"
          >
            <a
              href={Pdf}
              target="_blank"
              style={{ textDecoration: "none", color: "var(--green-color)" }}
            >
              White Paper
            </a>
          </Typography>
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "var(--green-color)", textAlign: "center", pt: 4 }}
            >
              What is SolanaTv
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              SolanaTv is a web3 video sharing/streaming platform on the Solana
              blockchain. Seeing that SolanaTv is the first of its kind, the
              platform will serve as a pioneer for what a web3 video streaming
              platform should be. SolanaTv will provide the space for NFT
              developers and 1/1 artists to expand on the creativity of their
              NFT projects in ways like animated movies, web-series, 1/1
              claymation interviews! At its full potential SolanaTv will also
              stream Solana/Crypto news, VR events, and much more. Great NFT
              Content, Great Expansion of Solana Projects, Great Platform to
              Bring all Communities Together.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              Even though we are a platform, SolanaTv will also produce its own
              set of originals, from 1/1 claymation interviews, game shows, the
              first EVER Solana awards shows, to an animated NFT series that is
              around 65% complete to date. We will start off with the 1/1
              claymation interviews with Solana project developers/teams that
              are doing volume and would like to speak with us. We have over 5
              projects interviewed already. Our 1/1 interviews will be released
              as a claymation episode so each interviewee can choose to be any
              of their NFTs.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              Our SolanaTv NFT project to give those a chance to buy a SolanaTv
              lifetime all access pass. Our SolanaTv NFT project will consist of
              9,999 tokens. The mint price will translate into a one time price
              for lifetime all access membership. Imagine paying $125 for an all
              access pass to Netflix and never having to pay another membership
              for as long as you hold the NFT. A $12.99 netflix monthly
              membership equals $155 for the year.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              As for the NFT projects, each NFT project or influencer listed on
              SolanaTv will have its own channel. Each holder of that project’s
              NFT will have full access to that project’s channel. As for
              non-holders, the developers decide if they want to charge for
              access to that channel or not. If they decide to charge for their
              content they can choose if they'd like to charge per video or a
              one time access fee. SolanaTV NFT holders will have access to all
              listed projects channel as well.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              To put everything into perspective, let me give you an example.
              Let’s say the Solana NFT project “DeGods” wanted to create an
              animated web-series. DeGod NFT holders would of course have full
              access to the DeGods channel and all their content on SolanaTv.
              Non-holders would have to pay a .5 Solana fee, set by DeGods, to
              view their content. DeGods could choose to make this fee per
              video, or a one time access fee for the channel. One of the
              beauties of SolanaTv is that money is sent directly to DeGods. A
              perfect way to keep up with a project you may not be able to buy
              into just yet. This allows creators to be in control of their
              earnings and give them an extended way to make an income.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              This fixes the issue of getting pennies on the dollar for your
              content. Youtube will payout anywhere from $3k - $20,000 per 1
              million views. If a content creator decided to charge $1 for their
              content then on a 1% conversion rate the person is looking at
              around $100k off the same video.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              There is also no central hub for Solana NFT news, videos, and
              interviews. No platform for projects to expand into the animated
              video space. No NFT streaming platform, even though its confirmed
              that Samsung is integrating NFTs to their TV’s. Creators are
              robbed of true earnings, getting pennies on the dollar for their
              ad revenue. Plus they have to give a lot of free content before
              ever getting $. No mass community announcements platform, limited
              communication developers have to their community. For people apart
              of 90+ projects, announcements can be hard to keep up with.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              Plus overall we need more fun in the Solana space. Nowadays
              projects are just hype, staking, breeding, mutations, then a slow
              rug followed by a de-rug. There’s no fire to the Solana gas.
              Utilities do in fact better the Solana ecosystem but we also need
              a little more fun.
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "var(--green-color)", textAlign: "center", pt: 4 }}
            >
              FAQ's
            </Typography>
            <Box sx={{ paddingTop: "20px" }}>
              <Typography
                variant="body"
                component="div"
                sx={{
                  color: "var(--purple-color)",
                  textAlign: "justify",
                  pt: 2,
                }}
              >
                What are the benefits of holding a SolanaTv NFT?
              </Typography>
              <ul style={{ margin: "0", padding: "0" }}>
                <li>
                  <CircleIcon className="icon" />
                  Lifetime free access to the SolanaTv platform. Free access of
                  the SolanaTV premium originals and live events.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  Casting for our game show will only be with SolanaTV holders.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  Free access to all the projects channels that list on
                  SolanaTV.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  Free live access to the First Ever Solana Awards Show.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  Must hold a SolanaTV NFT to be able to have a channel.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  Percentage of acquisition to holders
                </li>
                <li>
                  <CircleIcon className="icon" />& Much More.
                </li>
              </ul>
            </Box>
            <Box sx={{ paddingTop: "20px" }}>
              <Typography
                variant="body"
                component="div"
                sx={{
                  color: "var(--purple-color)",
                  textAlign: "justify",
                  pt: 2,
                }}
              >
                What if I don't hold a SolanaTV NFT??
              </Typography>
              <ul style={{ margin: "0", padding: "0" }}>
                <li>
                  <CircleIcon className="icon" />
                  You will only have free access to our SolanaTV weekly crypto
                  news channel.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  You will not have access to any of our content including the
                  1/1 claymation interviews, gameshow or web series.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  You will have to pay per video. Each payment will allow 48
                  hour access to said video.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  You will not be considered for our game show or any content we
                  produce with our holders.
                </li>
                <li>
                  <CircleIcon className="icon" />
                  You Will NOT be able to apply for a channel on SolanaTV.
                </li>
              </ul>
            </Box>
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{ color: "var(--green-color)", textAlign: "center", pt: 4 }}
            >
              Meet our team
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              Our team consists of a few different categories.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              1st is our SolanaTv staff. Starting with our founder Shane! He is
              the brains behind the SolanaTV brand and the platform. Shane has a
              background in film, brand development & marketing. Shane has
              worked on multiple film productions from Brotherhood to DrumLine
              2.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              We then have GEE. GEE serves as the creative inspiration to Shane
              for SolanaTV. GEE has over 10 years of business development, film
              production, directing, you name it. Gee has been ample in helping
              the project become what it is today as well as helping creating
              the content to come.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              Next we have Kingdom Domain. KD has worked on an extensive amount
              of film productions from the Netflix Original film "Sprinter" to
              the most recent James Bond film production in the Caribbean. KD
              has worked on these productions as Film Security Management, Stunt
              Coordination & Film Armory and Practical Effects.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              Then we have RED. Red is our Financial Analyst. Red has a business
              degree from Texas Tech University. Red advises our leadership team
              on aspects of capitalization, such as amounts, sourcing or timing.
              Red also makes recommendations to the leadership by analyzing
              financial information to forecast business, industry or market
              conditions.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              Next Up is our 3D artist George Tozas. George and I have spent
              countless hours in the lab designing what is known today as the
              10,000 SolanaTV robots and traits. He is a fantastic #D artist
              with a great heart and passion for what he does. He is our main
              artist on reserve.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              We then move onto our platform development team consisting of{" "}
              <br />
              <p style={{ color: "var(--purple-color)" }}>
                Sardar A - Project Manager
              </p>
              <p style={{ color: "var(--purple-color)" }}>
                Uzair D - Solution Architect
              </p>
              <p style={{ color: "var(--purple-color)" }}>
                Wali A - Front End Developer
              </p>
              <p style={{ color: "var(--purple-color)" }}>
                Muneeb S - Backend Developer
              </p>
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              Lastly we move to our claymation team. This team is responsible
              for the first SolanaTv original of the claymation Interviews.
            </Typography>
            <Typography
              variant="body"
              component="div"
              sx={{ color: "#fff", textAlign: "justify", pt: 2 }}
            >
              William Bridges - Over five years experience in the animation
              field. Been animating models and puppets for Adult Swim. Also have
              also created stop-motion puppets and animation for Stoopid Buddy
              Stoodios.
            </Typography>
          </Box>
        </Container>
      </AboutUsStyed>
    </>
  );
};

export default AboutUs;

const AboutUsStyed = styled.section`
  li {
    color: #fff;
    padding-top: 10px;
    list-style: none;
  }
  .icon {
    color: var(--green-color);
    max-width: 10px;
    margin-right: 10px;
  }

  .top_heading:hover {
    opacity: 0.6;
    transition: 0.5s;
  }
`;
