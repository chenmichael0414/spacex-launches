export type LaunchSite = {
  site_name_long: string;
};

export type Rocket = {
  rocket_name: string;
};

export type LaunchLinks = {
  article_link: string;
  flickr_images: string[];
};

export type Launch = {
  mission_name: string;
  launch_date_local: string;
  launch_site: LaunchSite;
  rocket: Rocket;
  launch_links: LaunchLinks;
};

export type LaunchResponse = {
  launches: Launch[];
};
