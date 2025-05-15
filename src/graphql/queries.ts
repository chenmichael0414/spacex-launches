import { gql } from '@apollo/client';

export const GET_LAUNCHES = gql`
    query GetLaunches {
        launches {
            mission_name
            launch_date_local
            launch_site {
                site_name_long
            }
            rocket {
                rocket_name
            }
            launch_links {
                article_link
                flickr_images
            }
        }
    }
`;