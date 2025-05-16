import { gql } from "@apollo/client";

export const GET_LAUNCHES = gql`
  query GetLaunches {
    launchesPast {
      mission_name
      launch_date_local
      launch_site {
        site_name_long
      }
      rocket {
        rocket_name
      }
      links {
        article_link
        flickr_images
      }
    }
  }
`;
