import { ApolloClient, InMemoryCache } from "@apollo/client";
import { cache } from "react";

export const client = new ApolloClient({
  uri: "https://api.spacex.land/graphql/",
  cache: new InMemoryCache(),
});
